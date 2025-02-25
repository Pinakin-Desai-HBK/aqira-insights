import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactContainerComponent } from './react-container.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactContainerComponent],
  template: `<main
    style="padding: 20px; margin: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;"
  >
    <h1>Angular</h1>
    <app-react-container></app-react-container>
  </main>`,
})
export class AppComponent {}
