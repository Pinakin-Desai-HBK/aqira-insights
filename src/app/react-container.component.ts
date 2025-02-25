import { Component, ElementRef, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgReact } from '../app-react/ng-context';
import App from '../app-react/App';

@Component({
  selector: 'app-react-container',
  imports: [CommonModule],
  template: ``,
})
export class ReactContainerComponent {
  private ngReact = inject(NgReact);
  private root = this.ngReact.createRoot(inject(ElementRef).nativeElement);

  ngOnInit() {
    this.ngReact.render(this.root, App);
  }

  ngOnDestroy() {
    this.root.unmount();
  }
}
