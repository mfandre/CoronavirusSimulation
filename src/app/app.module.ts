import { BrowserModule, Title } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { DeviceDetectorModule } from 'ngx-device-detector'
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoronaCanvasModule } from './components/corona-canvas/corona-canvas.module';
import { LegendModule } from './components/legend/legend.module';
import { AssumptionModule } from './components/assumption/assumption.module';
import { TitleModule } from './components/title/title.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    DeviceDetectorModule.forRoot(),
    CoronaCanvasModule,
    LegendModule,
    AssumptionModule,
    TitleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
