import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { Person, Healthy } from './models/person';
import { Random } from './utils/random';
import { Subject } from 'rxjs';

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

  public chanceInfection:number = 30;
  public incubationTime:number = 140;
  public timeToHeal:number = 300;
  public stoppedPersons1:number = 60;
  public stoppedPersons2:number = 30;
  public infectedPercent:number = 10;

  constructor() {}

  ngOnInit() {
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
      return 50;
    
    return value;
  }

  apply(){
    this.timeToHeal = this.checkBetween(this.tempTimeToHeal,0,1000, 1000);
    this.incubationTime = this.checkBetween(this.tempIncubationTime,0,1000, 1000);
    this.stoppedPersons1 = this.checkBetween(this.tempStoppedPersons1,0,100);
    this.stoppedPersons2 = this.checkBetween(this.tempStoppedPersons2,0,100);
    this.chanceInfection = this.checkBetween(this.tempChanceInfection,0,100);
    this.infectedPercent = this.checkBetween(this.tempInfectedPercent,0,100);

    this.tempTimeToHeal = this.timeToHeal;
    this.tempIncubationTime = this.incubationTime;
    this.tempStoppedPersons1 = this.stoppedPersons1;
    this.tempStoppedPersons2 = this.stoppedPersons2;
    this.tempChanceInfection = this.chanceInfection;
    this.tempInfectedPercent = this.infectedPercent;

    this.resetSubject.next();
    this.editing = false;
  }
}
