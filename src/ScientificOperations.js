export class ScientificOperations {
  static sqrt(value) {
    return Math.sqrt(value);
  }

  static square(value) {
    return value * value;
  }

  static sin(value) {
    return Math.sin((value * Math.PI) / 180);
  }

  static cos(value) {
    return Math.cos((value * Math.PI) / 180);
  }

  static log(value) {
    return Math.log10(value);
  }
}
