export default class Block {
  #width: number;
  #height: number;
  initOrder: number;
  pos: {
    top: number,
    left: number,
    bottom: number,
    right: number,
  };
  #backgroundColor: string;
  isSurrounded = false;

  constructor(width: number, height: number, initOrder: number) {
    this.#width = width;
    this.#height = height;
    this.initOrder = initOrder;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get backgroundColor(): string {
    return this.#backgroundColor;
  }

  set backgroundColor(col: string) {
    const regexp = /#[0-9A-Fa-f]{6}/;
    if (regexp.test(col) && col.length === 7) this.#backgroundColor = col;
    else throw new Error('Incorrect color');
  }

  setPosition(left: number, right: number, top: number, bottom: number): void {
    this.pos = { left, right, top, bottom };
  }

  getArea(): number {
    return this.#width * this.#height;
  }

  rotateBy90(): void {
    [this.#height, this.#width] = [this.#width, this.#height];
  }

  draw(container: HTMLElement): void {
    const blockElem = document.createElement('div');
    blockElem.style.width = `${this.#width}px`;
    blockElem.style.height = `${this.#height}px`;
    blockElem.style.top = `${this.pos.top}px`;
    blockElem.style.left = `${this.pos.left}px`;
    blockElem.style.backgroundColor = this.backgroundColor;
    blockElem.className = 'block';
    blockElem.innerHTML = `<div>${this.initOrder}</div>`;
    container.appendChild(blockElem);
  }
}
