import { Component, Injectable } from '@angular/core';
import { ReactComponentDirective } from '../app-react/react-component.directive';
import MyReactComponent from '../app-react/components/hello-react-world';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface CsvFiles {
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactComponentDirective,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <main
      style="padding: 20px; margin: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;"
    >
      <h1>Angular</h1>

      <h4>File</h4>
      <mat-form-field>
        <mat-select [(value)]="selected" (valueChange)="onChange($event)">
          @for (file of csvFiles; track file) {
          <mat-option [value]="file.name">{{ file.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <div>
        <h4>Selected cell: {{ cellValue }}</h4>
      </div>

      <div
        [reactComponent]="MyReactComponent"
        [reactComponentProps]="props"
      ></div>
    </main>
  `,
})
@Injectable({ providedIn: 'root' })
export class AppComponent {
  title = 'aqira-insights';

  MyReactComponent = MyReactComponent;

  csvFiles: CsvFiles[] = [
    { name: 'complex_input1.csv' },
    { name: 'MonitoringData.csv' },
  ];
  selected = this.csvFiles[0].name;

  cellValue = '';

  props = {
    csvData: '',
    onCellClick: (value: string) => (this.cellValue = value),
  };

  private httpClient: HttpClient;

  private setCSVData(name: string) {
    this.httpClient
      .get(`files/${name}`, { responseType: 'text' })
      .subscribe((csvData) => {
        this.props = { ...this.props, csvData };
      });
  }

  constructor(http: HttpClient) {
    this.httpClient = http;

    this.setCSVData(this.csvFiles[0].name);
  }

  onChange(event: any) {
    this.cellValue = '';
    this.setCSVData(event);
  }
}
