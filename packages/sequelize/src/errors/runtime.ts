export class SequelizeNotFoundError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeNotFoundError.name;
    }

    super(message);
  }
}
