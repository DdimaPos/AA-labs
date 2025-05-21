export class Logger {
  constructor() {
    this.steps = [];
  }

  log(message) {
    this.steps.push(message);
    console.log(message);
  }

  getLogs() {
    return this.steps;
  }
}

