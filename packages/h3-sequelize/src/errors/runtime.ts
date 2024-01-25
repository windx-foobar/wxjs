export class H3EventContextSequelizeNotFound extends Error {
  constructor(message?: string) {
    if (!message) {
      message = H3EventContextSequelizeNotFound.name;
    }

    super(message);
  }
}

export class EventIsNotH3Event extends Error {
  constructor(message?: string) {
    if (!message) {
      message = EventIsNotH3Event.name;
    }

    super(message);
  }
}
