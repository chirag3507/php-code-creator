
import React from 'react';
import { BlockType } from './types';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  defaultValues: Record<string, string>;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'start',
    label: 'PHP Start',
    description: 'Begins the PHP script context',
    color: 'bg-purple-600',
    icon: <span className="font-bold text-xs">&lt;?</span>,
    defaultValues: {}
  },
  {
    type: 'database',
    label: 'DB Connection',
    description: 'PDO database connection',
    color: 'bg-blue-600',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
    defaultValues: { host: 'localhost', dbname: 'test', user: 'root', pass: '' }
  },
  {
    type: 'variable',
    label: 'Set Variable',
    description: 'Assign a value to a variable',
    color: 'bg-green-600',
    icon: <span className="font-bold text-xs">$v</span>,
    defaultValues: { name: 'myVar', value: 'Hello World' }
  },
  {
    type: 'echo',
    label: 'Output (Echo)',
    description: 'Print text or variables',
    color: 'bg-orange-600',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    defaultValues: { content: 'This is a message' }
  },
  {
    type: 'query',
    label: 'SQL Query',
    description: 'Execute a database query',
    color: 'bg-indigo-600',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    defaultValues: { sql: 'SELECT * FROM users', resultVar: 'users' }
  },
  {
    type: 'condition',
    label: 'If Statement',
    description: 'Conditional logic block',
    color: 'bg-red-600',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    defaultValues: { condition: '$a > 10', then: 'echo "Greater";' }
  },
  {
    type: 'loop',
    label: 'Foreach Loop',
    description: 'Iterate over arrays',
    color: 'bg-yellow-600',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    defaultValues: { array: '$items', item: '$item', body: 'echo $item;' }
  }
];
