import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroEsquerda'
})
export class ZeroEsquerdaPipe implements PipeTransform {

  transform(value: any, tamanho: number): any {
    return this.padLeft(value, tamanho);
  }

  padLeft(text: string, size: number): string {
    return (String('0').repeat(size) + text).substr( (size * -1), size) ;
}

}
