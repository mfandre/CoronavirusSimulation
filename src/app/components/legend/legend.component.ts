import { Component, ViewChild, ElementRef, OnInit, NgZone, Input } from '@angular/core';
import { HealthyColor } from 'src/app/models/person';

@Component({
  selector: 'corona-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent {
  public sickColor:string = HealthyColor.sick;
  public sickHiddenColor:string = HealthyColor.sick_hidden;
  public healedColor:string = HealthyColor.healed;
  public okColor:string = HealthyColor.ok;
  public deadColor:string = HealthyColor.dead;
}
