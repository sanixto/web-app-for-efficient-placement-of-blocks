export default class Block {
  #width: number;
  #height: number;

  constructor(width: number, height: number) {
    this.#width = width;
    this.#height = height;
  }

  getArea(): number {
    return this.#width * this.#height;
  }

  rotateBy90(): void {
    [this.#height, this.#width] = [this.#width, this.#height];
  }
}
