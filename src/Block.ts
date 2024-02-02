export default class Block {
  #width: number;
  #height: number;
  initOrder: number;
  coords: {
    top: number,
    left: number,
    bottom: number,
    right: number,
  };
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

  setCoords(left: number, right: number, top: number, bottom: number): void {
    this.coords = { left, right, top, bottom };
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
    blockElem.style.top = `${this.coords.top}px`;
    blockElem.style.left = `${this.coords.left}px`;
    blockElem.className = 'block';
    blockElem.innerHTML = `<div>${this.initOrder}</div>`;
    container.appendChild(blockElem);
  }
}
