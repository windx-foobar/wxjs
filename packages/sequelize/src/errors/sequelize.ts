export class ConnectionError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = ConnectionError.name;
    }

    super(message);
  }
}
