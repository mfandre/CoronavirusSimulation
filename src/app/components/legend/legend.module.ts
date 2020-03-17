import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { NgxEchartsModule } from 'ngx-echarts';
import { LegendComponent } from './legend.component';


@NgModule({
  declarations: [ LegendComponent ],
  exports:      [ LegendComponent ],
  bootstrap:    [ LegendComponent ],
  imports: [
    BrowserModule,
    NgxEchartsModule
  ],
  providers: [],
})
export class LegendModule { }
