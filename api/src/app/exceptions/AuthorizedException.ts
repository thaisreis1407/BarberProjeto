export default class AuthorizedException {
  name: string;
  errors: any[];
  constructor(msg: string) {
    this.name = 'AuthorizedError';
    this.errors = [msg];
  }
}
