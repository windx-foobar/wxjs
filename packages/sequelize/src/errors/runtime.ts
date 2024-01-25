export class SequelizeRuntimeError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeRuntimeError.name;
    }

    super(message);
  }
}

export class SequelizeNotFoundError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeNotFoundError.name;
    }

    super(message);
  }
}

export class ModelNotFoundError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = SequelizeNotFoundError.name;
    }

    super(message);
  }
}

export class ModelNotDefinedError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = ModelNotDefinedError.name;
    }

    super(message);
  }
}
