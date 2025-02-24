import { Directive, ElementRef, Input } from '@angular/core';
import { createRoot } from 'react-dom/client';
import { ComponentProps, createElement, ElementType } from 'react';
import { inject } from '@angular/core';

@Directive({
  selector: '[reactComponent]',
  standalone: true,
})
export class ReactComponentDirective<Comp extends ElementType> {
  @Input() reactComponent!: Comp;
  @Input() reactComponentProps!: ComponentProps<Comp>;

  private root = createRoot(inject(ElementRef).nativeElement);

  ngOnChanges() {
    this.root.render(
      createElement(this.reactComponent, this.reactComponentProps)
    );
  }

  ngOnDestroy() {
    this.root.unmount();
  }
}
