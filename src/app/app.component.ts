import { Component } from '@angular/core';
import { ReactComponentDirective } from '../app-react/react-component.directive';
import MyReactComponent from '../app-react/components/hello-react-world';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  imports: [ReactComponentDirective, MatFormFieldModule, MatSelectModule],
  template: `
    <main
      style="padding: 20px; margin: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;"
    >
      <h1>Angular</h1>

      <h4>File</h4>
      <mat-form-field>
        <mat-select [(value)]="selected" (valueChange)="onChange($event)">
          @for (food of foods; track food) {
          <mat-option [value]="food.value">{{ food.viewValue }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div
        [reactComponent]="MyReactComponent"
        [reactComponentProps]="props"
      ></div>
    </main>
  `,
})
export class AppComponent {
  title = 'aqira-insights';
  MyReactComponent = MyReactComponent;
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  selected = 'steak-0';

  props = {
    selected: this.selected,
  };

  onChange(event: any) {
    this.props = {
      ...this.props,
      selected: event,
    };
  }
}
