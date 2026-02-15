
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BlockData, BlockType } from './types';
import { BLOCK_DEFINITIONS } from './constants';
import BlockCard from './components/BlockCard';
import { explainCode } from './services/geminiService';

const App: React.FC = () => {
  const [activeBlocks, setActiveBlocks] = useState<BlockData[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  // Generate PHP code from blocks
  useEffect(() => {
    let code = '';
    const startBlock = activeBlocks.find(b => b.type === 'start');
    
    if (startBlock) {
      code += '<?php\n\n';
    }

    activeBlocks.forEach(block => {
      switch (block.type) {
        case 'database':
          code += `// Database Connection\n$dsn = "mysql:host=${block.values.host};dbname=${block.values.dbname}";\n$pdo = new PDO($dsn, "${block.values.user}", "${block.values.pass}");\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n`;
          break;
        case 'variable':
          const val = isNaN(Number(block.values.value)) ? `"${block.values.value}"` : block.values.value;
          code += `$${block.values.name} = ${val || 'null'};\n`;
          break;
        case 'echo':
          code += `echo "${block.values.content}";\n`;
          break;
        case 'query':
          code += `// Execute Query\n$stmt = $pdo->prepare("${block.values.sql}");\n$stmt->execute();\n$${block.values.resultVar} = $stmt->fetchAll(PDO::FETCH_ASSOC);\n\n`;
          break;
        case 'condition':
          code += `if (${block.values.condition}) {\n    ${block.values.then}\n}\n`;
          break;
        case 'loop':
          code += `foreach (${block.values.array} as ${block.values.item}) {\n    ${block.values.body}\n}\n`;
          break;
        default:
          break;
      }
    });

    setGeneratedCode(code.trim());
  }, [activeBlocks]);

  const addBlock = useCallback((type: BlockType) => {
    const def = BLOCK_DEFINITIONS.find(d => d.type === type);
    if (!def) return;

    const newBlock: BlockData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: def.label,
      values: { ...def.defaultValues }
    };

    setActiveBlocks(prev => [...prev, newBlock]);
  }, []);

  const updateBlock = useCallback((id: string, values: Record<string, string>) => {
    setActiveBlocks(prev => prev.map(b => b.id === id ? { ...b, values } : b));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setActiveBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleExplain = async () => {
    if (!generatedCode) return;
    setIsExplaining(true);
    const result = await explainCode(generatedCode);
    setExplanation(result);
    setIsExplaining(false);
  };

  const clearCanvas = () => {
    if (window.confirm('Clear all blocks?')) {
      setActiveBlocks([]);
      setExplanation('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar - Available Blocks */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            PHP Builder
          </h1>
          <p className="text-xs text-gray-400 mt-1">Click blocks to add to canvas</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {BLOCK_DEFINITIONS.map(def => (
            <BlockCard 
              key={def.type} 
              block={{ id: 'temp', type: def.type, label: def.label, values: def.defaultValues }} 
              isSidebar={true}
              onAdd={addBlock}
            />
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 flex justify-between items-center bg-gray-900 border-b border-gray-800 z-10">
          <div className="flex gap-4">
            <button 
              onClick={handleExplain}
              disabled={isExplaining || !generatedCode}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {isExplaining ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.674a1 1 0 00.995-.85l.608-4.053a1.513 1.513 0 01.467-1.041l.194-.194a1.5 1.5 0 012.12 0l1.122 1.122A1.5 1.5 0 0119 13.122l-1.122 1.122a1.5 1.5 0 01-2.12 0l-.194-.194a1.513 1.513 0 01-1.041-.467l-4.053-.608A1 1 0 0010.337 13H5.663a1 1 0 00-.995.85l-.608 4.053a1.513 1.513 0 01-.467 1.041l-.194.194a1.5 1.5 0 01-2.12 0L.151 17.915A1.5 1.5 0 010 16.854l1.122-1.122a1.5 1.5 0 012.12 0l.194.194c.264.264.637.408 1.041.467l4.053.608A1 1 0 009.663 17z" /></svg>
              )}
              {isExplaining ? 'Analyzing...' : 'AI Explain'}
            </button>
            <button 
              onClick={clearCanvas}
              className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-md text-sm font-semibold transition-colors"
            >
              Clear Canvas
            </button>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {activeBlocks.length} Blocks on canvas
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-[#0d1117] flex flex-col items-center custom-scrollbar">
          {activeBlocks.length === 0 ? (
            <div className="mt-20 text-center space-y-4 opacity-50">
              <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="text-xl font-medium">Canvas is empty</p>
              <p className="text-sm">Select a block from the sidebar to begin building your logic</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-0 flex flex-col items-center">
              {activeBlocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  <BlockCard 
                    block={block} 
                    onUpdate={updateBlock} 
                    onRemove={removeBlock} 
                  />
                  {index < activeBlocks.length - 1 && (
                    <div className="h-8 w-1 bg-gray-700 my-1 rounded-full"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code & Output */}
      <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col shadow-2xl">
        <div className="h-1/2 flex flex-col border-b border-gray-700">
          <div className="p-3 bg-gray-900 flex justify-between items-center border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Generated PHP</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                alert('Code copied to clipboard!');
              }}
              className="text-[10px] bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300"
            >
              Copy Code
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar bg-[#161b22]">
            <pre className="text-blue-300 whitespace-pre-wrap leading-relaxed">
              {generatedCode || '// No blocks yet...'}
            </pre>
          </div>
        </div>

        <div className="h-1/2 flex flex-col bg-gray-800">
          <div className="p-3 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">AI Logic Explanation</span>
          </div>
          <div className="flex-1 p-5 overflow-y-auto text-gray-300 leading-relaxed custom-scrollbar">
            {explanation ? (
              <div className="prose prose-invert prose-sm">
                <p className="whitespace-pre-wrap">{explanation}</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm">Run AI analysis to get an explanation of your code logic.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
