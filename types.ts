
export type BlockType = 
  | 'start' 
  | 'database' 
  | 'variable' 
  | 'condition' 
  | 'loop' 
  | 'echo' 
  | 'query'
  | 'logic';

export interface BlockData {
  id: string;
  type: BlockType;
  label: string;
  values: Record<string, string>;
}

export interface DraggedItem {
  type: BlockType;
  label: string;
}
