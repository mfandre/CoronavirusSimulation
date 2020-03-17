import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { NgxEchartsModule } from 'ngx-echarts';
import { TitleComponent } from './title.component';


@NgModule({
  declarations: [ TitleComponent ],
  exports:      [ TitleComponent ],
  bootstrap:    [ TitleComponent ],
  imports: [
    BrowserModule,
    NgxEchartsModule
  ],
  providers: [],
})
export class TitleModule { }
