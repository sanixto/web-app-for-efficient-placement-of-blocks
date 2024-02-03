import Block from './Block.js';
import Point from './intefaces/Point.interface.js';
import BlockDimension from './intefaces/InputBlock.interface.js';

class Editor {
  #container: HTMLElement;
  #blocks: Block[];
  #placedBlocks: Block[];
  #startPoint: Point;
  #endPoint: Point;

  constructor() {
    this.#blocks = [];
    this.#placedBlocks = [];
    this.#container = document.getElementById('container');
    this.updateContainer();
  }

  generateBlocks(dimensions: BlockDimension[]): void {
    this.#blocks = dimensions.map((inputBlock, i) => new Block(inputBlock.width, inputBlock.height, i));
  }

  clearContainer(): void {
    this.#container.innerHTML = '';
  }

  updateContainer(): void {
    const viewportWidth: number = document.documentElement.clientWidth;;
    const viewportHeight: number = document.documentElement.clientHeight;;
    this.#container.style.width = `${viewportWidth}px`;
    this.#container.style.height = `${viewportHeight}px`;
    this.#setRange(0, viewportHeight, viewportWidth, 0);
  }

  async drawBlocks() {
    let isRunning = true;
    let curBlock: Block;
    this.#blocks.sort((a, b) => b.getArea() - a.getArea());

    while (isRunning) {
      let nextBlock: Block = this.#findBlock();

      // notice block if it is already surrounded by other blocks
      if (!nextBlock && curBlock) {
        let rightNeighbour = this.#findRightNeighbourWithSameTopPosition(curBlock);
        while (rightNeighbour) {
          rightNeighbour.isSurrounded = true;
          rightNeighbour = this.#findRightNeighbourWithSameTopPosition(rightNeighbour);
        }
        curBlock.isSurrounded = true;
        curBlock = null;
      }

      // set the range for adding new blocks
      if (!nextBlock && !curBlock) {
        curBlock = this.#findLowestBlock();
        if (curBlock) {
          let { left: startX, top: startY } = curBlock.pos;
          let endX = startX + curBlock.width;
          
          const partitions = this.#findNearestPartitionsPos(endX, startY);
          if (partitions.leftX) startX = partitions.leftX;
          else startX = 0;
          if (partitions.rightX) endX = partitions.rightX;
          else endX = this.#container.clientWidth;

          this.#setRange(startX, startY, endX, this.#container.clientHeight);
        } else {
          isRunning = false;
        }
      }

      // set up and draw block
      if (nextBlock) {
        this.#placedBlocks.push(nextBlock);
        this.#blocks = this.#blocks.filter(b => b.initOrder !== nextBlock.initOrder);
        
        const { left, top, right, bottom } = this.#getNextPosition(nextBlock); 
        nextBlock.setPosition(left, right, top, bottom);

        const nextColor = this.#getNextColor(nextBlock);
        try {
          nextBlock.backgroundColor = nextColor;
        } catch(e) {
          console.log(e)
        }

        nextBlock.draw(this.#container);
        this.#startPoint.x += nextBlock.width;
      }
    }
  }

  #getNextPosition(nextBlock: Block): { left: number, top: number, right: number, bottom: number } {
    const left = this.#startPoint.x;
    const top = this.#startPoint.y - nextBlock.height;
    const right = this.#container.clientWidth - this.#startPoint.x + nextBlock.width;
    const bottom = this.#container.clientHeight - this.#startPoint.y;
    return { left, top, right, bottom };
  } 

  #setRange(startX: number, startY: number, endX: number, endY: number): void {
    this.#startPoint = { x: startX, y: startY };
    this.#endPoint = { x: endX, y: endY };
  }

  #findBlock(): Block {
    for (const block of this.#blocks) {
      const top = this.#startPoint.y - block.height;
      const right = this.#container.clientWidth - this.#startPoint.x;
      if (!this.#isOutOfContainer(right, top)) {
        if ((this.#endPoint.x - this.#startPoint.x) >= block.width) return block;
      }
    } 
  }

  #isOutOfContainer(x: number, y: number): boolean {
    if (x > this.#container.clientWidth || y < 0) return true;
  }

  #findLowestBlock(): Block {
    const notSurroundedBlocks = this.#placedBlocks.filter(block => !block.isSurrounded);
    let result = notSurroundedBlocks[0];
    for (const block of notSurroundedBlocks) {
      if (block.pos.top > result.pos.top) result = block;
    }
    return result;
  }

  #findNearestPartitionsPos(x: number, y: number): {leftX: number, rightX: number} {
    return {
      leftX: this.#findNearestLeftPartitionPos(x, y),
      rightX: this.#findNearestRightPartitionPos(x, y),
    }
  }

  #findNearestLeftPartitionPos(x: number, y: number): number {
    const partitions: Block[] = this.#findAllLeftPartitions(x, y);
    const partitionPositions: number[] = partitions.map(partition => partition.pos.left + partition.width);
    return partitionPositions.length ? Math.max(...partitionPositions) : null;
  }

  #findNearestRightPartitionPos(x: number, y: number): number {
    const partitions: Block[] = this.#findAllRightPartitions(x, y);
    const partitionPositions: number[] = partitions.map(partition => partition.pos.left);
    return partitionPositions.length ? Math.min(...partitionPositions) : null;
  }

  #findAllLeftPartitions(x: number, y: number): Block[] {
    const partitions: Block[] = this.#findAllPartitions(y);
    return partitions.filter(partition => partition.pos.left < x);
  }

  #findAllRightPartitions(x: number, y: number): Block[] {
    const partitions: Block[] = this.#findAllPartitions(y);
    return partitions.filter(partition => partition.pos.left >= x);
  }

  #findAllPartitions(y: number): Block[] {
    const partitions: Block[] = this.#placedBlocks.filter(block => {
      if (block.pos.top < y && block.pos.top + block.height >= y)
        return true;
    });
    return partitions;
  }
    
  #findRightNeighbourWithSameTopPosition(block: Block): Block {
    const neighbour = this.#placedBlocks.find(placedBlock => {
      if (placedBlock.pos.top === block.pos.top && 
        placedBlock.pos.left === block.pos.left + block.width) return true;
    })
    return neighbour;
  }

  #getNextColor(nextBlock: Block) {
    const identicalBLock = this.#findIdenticalPlacedBlock(nextBlock);
    if (identicalBLock) return identicalBLock.backgroundColor;
    else return this.#generateRandomColor();
  }
  
  #findIdenticalPlacedBlock(block: Block): Block {
    const result = this.#placedBlocks.find(placedBlock => {
      if (this.#areIdenticalBlocks(block, placedBlock))
        return block;
    });
    return result;
  }

  #areIdenticalBlocks(block1: Block, block2: Block):boolean {
    if (block1.height === block2.height && block1.width === block2.width)
      if (block1.initOrder !== block2.initOrder) return true;
    return false;
  }

  #generateRandomColor(): string {
    const randomNumber = Math.floor(Math.random() * 16777215);
    const hexColor = randomNumber.toString(16).padStart(6, '0');
    return `#${hexColor}`;
  }
}

export default new Editor();