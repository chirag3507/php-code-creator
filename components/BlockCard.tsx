
import React from 'react';
import { BlockData, BlockType } from '../types';
import { BLOCK_DEFINITIONS } from '../constants';

interface BlockCardProps {
  block: BlockData;
  isSidebar?: boolean;
  onUpdate?: (id: string, values: Record<string, string>) => void;
  onRemove?: (id: string) => void;
  onAdd?: (type: BlockType) => void;
}

const BlockCard: React.FC<BlockCardProps> = ({ 
  block, 
  isSidebar = false, 
  onUpdate, 
  onRemove,
  onAdd
}) => {
  const definition = BLOCK_DEFINITIONS.find(d => d.type === block.type);
  if (!definition) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate(block.id, { ...block.values, [e.target.name]: e.target.value });
    }
  };

  const handleClick = () => {
    if (isSidebar && onAdd) {
      onAdd(block.type);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        ${definition.color} 
        ${isSidebar ? 'cursor-pointer hover:brightness-110 transition-all scale-95 hover:scale-100' : 'mb-4'}
        rounded-lg p-3 shadow-lg border border-white/10 text-white min-w-[240px] relative group
      `}
    >
      {!isSidebar && (
        <button 
          onClick={() => onRemove?.(block.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white/20 p-1.5 rounded">
          {definition.icon}
        </div>
        <h3 className="font-bold text-sm uppercase tracking-wider">{definition.label}</h3>
      </div>

      {!isSidebar && (
        <div className="space-y-2 mt-3 bg-black/20 p-2 rounded">
          {Object.keys(definition.defaultValues).map(key => (
            <div key={key}>
              <label className="text-[10px] uppercase font-semibold text-white/60 block mb-0.5">{key}</label>
              <input 
                name={key}
                value={block.values[key] || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-white/30"
                placeholder={`Enter ${key}...`}
              />
            </div>
          ))}
        </div>
      )}
      
      {isSidebar && (
        <p className="text-[10px] text-white/70 italic leading-tight">
          {definition.description}
        </p>
      )}
    </div>
  );
};

export default BlockCard;
