export default class AuthenticationException {
  name: string;
  errors: any[];
  constructor(msg: string) {
    this.name = 'AuthenticationException';
    this.errors = [msg];
  }
}
