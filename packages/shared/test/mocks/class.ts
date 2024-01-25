export class EmptyClass {
  static toString() {
    return `class ${EmptyClass.name} {}`;
  }
}

export class FilledClass extends EmptyClass {
  foo: string = 'bar';

  baz(): void {}

  static toString(): string {
    return `class ${FilledClass.name} {}`;
  }
}
