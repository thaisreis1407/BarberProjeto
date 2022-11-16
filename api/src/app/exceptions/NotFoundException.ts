export default class NotFoundException {
  name: string;
  errors: any[];
  constructor(msg = '') {
    this.name = 'NotFoundError';
    this.errors = [msg || 'Recurso não encontrado'];
  }
}
