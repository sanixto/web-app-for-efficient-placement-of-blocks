import editor from './Editor.js';
import BlockDimension from './intefaces/InputBlock.interface.js';
import readBlocksFromFile from './readBlocksFromFile.js';

try {
  const filename: string = 'inputBlocks.json';
  const inputDimensions: BlockDimension[] = await readBlocksFromFile(filename);
  editor.generateBlocks(inputDimensions);
  editor.drawBlocks();

  window.addEventListener('resize', () => {
    editor.clearContainer();
    editor.updateContainer();
    editor.generateBlocks(inputDimensions);
    editor.drawBlocks();
  });
} catch(e) {
  console.error('Something went wrong', e);
}





