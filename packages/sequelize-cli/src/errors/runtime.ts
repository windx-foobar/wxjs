export class SequelizeCliRuntimeError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeCliRuntimeError.name;
    }

    super(message);
  }
}

export class SequelizeCliArgumentsError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeCliArgumentsError.name;
    }

    super(message);
  }
}
