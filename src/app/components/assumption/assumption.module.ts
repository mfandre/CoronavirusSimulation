import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { NgxEchartsModule } from 'ngx-echarts';
import { AssumptionComponent } from './assumption.component';


@NgModule({
  declarations: [ AssumptionComponent ],
  exports:      [ AssumptionComponent ],
  bootstrap:    [ AssumptionComponent ],
  imports: [
    BrowserModule,
    NgxEchartsModule
  ],
  providers: [],
})
export class AssumptionModule { }
