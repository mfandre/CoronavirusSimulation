import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { Person, Healthy } from './models/person';
import { Random } from './utils/random';
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

/*
<table>
      <tr *ngFor="let person of persons;">{{person.id}}</tr>
    </table>
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  playing:Boolean = false;
  editing:Boolean = false;
  playSubject: Subject<void> = new Subject<void>();
  stopSubject: Subject<void> = new Subject<void>();
  resetSubject: Subject<void> = new Subject<void>();

  //parameters temp
  public tempChanceInfection:number = 30;
  public tempIncubationTime:number = 140;
  public tempTimeToHeal:number = 300;
  public tempStoppedPersons1:number = 70;
  public tempStoppedPersons2:number = 10;
  public tempInfectedPercent:number = 10;
  public tempPersonSize:number = 5;
  public tempPopulationSize:number = 300;

  public chanceInfection:number = 30;
  public incubationTime:number = 140;
  public timeToHeal:number = 300;
  public stoppedPersons1:number = 60;
  public stoppedPersons2:number = 30;
  public infectedPercent:number = 10;
  public personSize:number = 5;
  public populationSize:number = 300;

  constructor(private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    //just to better fitting the population in less area (and performance)
    if(this.deviceService.isMobile()){
      this.populationSize = 120;
      this.tempPopulationSize = 120;
    }

    if(this.deviceService.isTablet()){
      this.populationSize = 170;
      this.tempPopulationSize = 170;
    }
  }

  play(){
    this.playing = true;
    this.playSubject.next();
  }

  stop(){
    this.playing = false;
    this.stopSubject.next();
  }

  edit(){
    if(this.playing)
      return;
    this.editing = true;
  }

  closeEdit(){
    this.editing = false;
  }

  checkBetween(value:number, min:number, max:number, def:number = 50):number{
    if(value < min || value > max)
      return def;
    
    return value;
  }

  apply(){
    this.timeToHeal = this.checkBetween(this.tempTimeToHeal,0,1000, 1000);
    this.incubationTime = this.checkBetween(this.tempIncubationTime,0,1000, 1000);
    this.stoppedPersons1 = this.checkBetween(this.tempStoppedPersons1,0,100);
    this.stoppedPersons2 = this.checkBetween(this.tempStoppedPersons2,0,100);
    this.chanceInfection = this.checkBetween(this.tempChanceInfection,0,100);
    this.infectedPercent = this.checkBetween(this.tempInfectedPercent,0,100);
    this.personSize = this.checkBetween(this.tempPersonSize,1,20,5);
    this.populationSize = this.checkBetween(this.tempPopulationSize,0,1000,300);

    this.tempTimeToHeal = this.timeToHeal;
    this.tempIncubationTime = this.incubationTime;
    this.tempStoppedPersons1 = this.stoppedPersons1;
    this.tempStoppedPersons2 = this.stoppedPersons2;
    this.tempChanceInfection = this.chanceInfection;
    this.tempInfectedPercent = this.infectedPercent;
    this.tempPersonSize = this.personSize;
    this.tempPopulationSize = this.populationSize;

    this.resetSubject.next();
    this.editing = false;
  }
}
