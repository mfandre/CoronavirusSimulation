import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { CoronaCanvasComponent } from './corona-canvas.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [ CoronaCanvasComponent ],
  exports:      [ CoronaCanvasComponent ],
  bootstrap:    [ CoronaCanvasComponent ],
  imports: [
    BrowserModule,
    NgxEchartsModule
  ],
  providers: [],
})
export class CoronaCanvasModule { }
