import {Directive, ElementRef, AfterViewInit, Input} from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})

export class AutoFucosDirective implements AfterViewInit {
  constructor(private el: ElementRef) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
      this.el.nativeElement.focus();
      } catch (error) {
      }
    }, 200);
  }
}
