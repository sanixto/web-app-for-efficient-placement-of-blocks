import inputBLock from './intefaces/inputBlock.interface.js';
import readBlocksFromFile from './readBlocksFromFile.js';
import Block from './Block.js';

export default async function generateBlocks(): Promise<Block[]> {
  const filename: string = 'inputBlocks.json';
  
  try {
    const inputBlocks: inputBLock[] = await readBlocksFromFile(filename);
    const blocks: Block[] = inputBlocks.map(inputBlock => new Block(inputBlock.width, inputBlock.height));
    return blocks;
  } catch(e) {
    console.error('Failed generation blocks', e);
  }
}