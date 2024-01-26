export type PromiseLike<T = any> = Pick<Promise<T>, 'then' | 'catch'>;
export type Thenable<T = any> = Pick<PromiseLike<T>, 'then'>;
