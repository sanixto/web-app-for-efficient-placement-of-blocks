import Block from './Block.js';
import generateBlocks from './generateBlocks.js';

try {
  const blocks: Block[] = await generateBlocks();
  console.log(blocks);
} catch(e) {
  console.error('Something went wrong', e);
}






