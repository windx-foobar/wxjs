class Thenable {
  constructor(
    protected readonly val?: any
  ) {}

  public then() {
    return this.val;
  }

  get [Symbol.toStringTag]() {
    return Thenable.name;
  }
}

class PromiseLike extends Thenable {
  catch() {}

  get [Symbol.toStringTag]() {
    return PromiseLike.name;
  }
}

export const emptyPromise = Promise.resolve();
export const resultPromise = Promise.resolve(1);
export const emptyPromiseLike = new PromiseLike();
export const resultPromiseLike = new PromiseLike(1);
export const emptyThenable = new Thenable();
export const resultThenable = new Thenable(1);
