import inputBLock from './intefaces/inputBlock.interface.js';

export default async function readBlocksFromFile(path: string): Promise<inputBLock[]> {
  try {
    const response: Response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks. Status: ${response.status}`);
    }

    const blocks: Promise<inputBLock[]> = response.json();
    return blocks;
  } catch(e) {
    console.error(`Failed reading blocks from file ${path}:`, e);
    throw e;
  }
}