export default class ValidationException {
  name: string;
  errors: any[];
  constructor(msg: string) {
    this.name = 'ValidationError';
    this.errors = [msg];
  }
}
