import BlockDimension from './intefaces/InputBlock.interface.js';

export default async function readBlocksFromFile(path: string): Promise<BlockDimension[]> {
  try {
    const response: Response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks. Status: ${response.status}`);
    }

    const dimensions: Promise<BlockDimension[]> = response.json();
    return dimensions;
  } catch(e) {
    console.error(`Failed reading blocks from file ${path}:`, e);
    throw e;
  }
}