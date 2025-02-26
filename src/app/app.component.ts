import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactContainerComponent } from "./react-container.component";

@Component({
  selector: "app-root",
  imports: [CommonModule, ReactContainerComponent],
  template: `<main style="padding: 20px; background-color: #d7d7d7; height: 100vh;">
    <div style="margin-bottom: 20px; font-size: 20px;">Angular</div>
    <app-react-container></app-react-container>
  </main>`
})
export class AppComponent {}
