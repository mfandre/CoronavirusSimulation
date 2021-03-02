import { Component, ViewChild, ElementRef, OnInit, NgZone, Input } from '@angular/core';
import { Person, Healthy, HealthyColor } from '../../models/person';
import { Random } from '../../utils/random';
import { Observable, Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { VelocityConstant } from 'src/app/behaviors/velocity/velocity_constant';

@Component({
  selector: 'corona-canvas',
  templateUrl: './corona-canvas.component.html',
  styleUrls: ['./corona-canvas.component.css']
})
export class CoronaCanvasComponent implements OnInit {
  @Input() showCreatePopulationButton:boolean = false;
  @Input() populationSize:number = 200;
  @Input() infectedPercent:number = 0.1;
  @Input() stoppedPercent:number = 0.3;
  @Input() chanceOfInfect:number = 0.3;
  @Input() incubationTime:number = 140;
  @Input() healingTime:number = 300;
  @Input() personSize:number = 5;

  private playSubscription: Subscription;
  @Input() playEvent: Observable<void>;

  private stopSubscription: Subscription;
  @Input() stopEvent: Observable<void>;

  private resetSubscription: Subscription;
  @Input() resetEvent: Observable<void>;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  persons: Person[] = [];
  randomGenerator:Random = new Random();
  epoch = 0;
  playing:Boolean = false;
  totalPersons = 0;
  infectedPersons = 0;
  actualInfectedPersons = 0;
  actualHealedPersons = 0;
  actualOkPersons = 0;
  actualDeadPersons = 0;
  stoppedPersons = 0;
  worldWidth = 0;
  worldHeight = 0;
  style_width = 0;
  style_height = 0;
  actualCountByAge = {};
  personsPositions = {};

  public optionHistogramByAge:any = {};
  public updateOptionHistogramByAge:any = undefined;

  public optionCoronaInfection:any = {};
  public updateOptionCoronaInfection:any = undefined;

  constructor(private ngZone: NgZone, private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.setCanvasSize();
    this.createHistogramByAgeChart();
    this.createCoronaInfectionChart();

    this.playSubscription = this.playEvent.subscribe(() => this.play());
    this.stopSubscription = this.stopEvent.subscribe(() => this.stop());
    this.resetSubscription = this.resetEvent.subscribe(() => this.reset());
  }

  setCanvasSize() {
    let dpi = window.devicePixelRatio;
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    //let style_height = +getComputedStyle(this.canvas.nativeElement).getPropertyValue("height").slice(0, -2);//get CSS width
    //let style_width = +getComputedStyle(this.canvas.nativeElement).getPropertyValue("width").slice(0, -2);//scale the canvas
    //this.canvas.nativeElement.setAttribute('height', (style_height * dpi)+"");
    //this.canvas.nativeElement.setAttribute('width', (style_width * dpi)+"");

    //let style_width = document.body.clientWidth/2;
    //let style_height = document.body.clientHeight/2;
    this.style_width = 800;
    this.style_height = 600;

    if(this.deviceService.isMobile()){
      this.style_width = 290;
    }

    if(this.deviceService.isTablet()){
      this.style_width = 400;
    }

    this.worldWidth = this.style_width / 10; //5 is the Z size of person square
    this.worldHeight = this.style_height / 10; //5 is the Z size of person square

    this.canvas.nativeElement.setAttribute('height', (this.style_height)+"");
    this.canvas.nativeElement.setAttribute('width', (this.style_width)+"");
  }

  updatePersonsDictPosition() {
    this.personsPositions = {}

    for(let i = 0; i < this.persons.length; i++){
      let positionId = this.persons[i].getUniquePositionPersonId()
      if(this.personsPositions[positionId] == undefined){
        this.personsPositions[positionId] = [this.persons[i]]
      }else{
        this.personsPositions[positionId].push(this.persons[i])
      }
    }
  }

  tick() {
    this.epoch++;
    let refreshStatisticsCounter = 100;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.persons.forEach((person: Person) => {
      person.move(this.persons);

      person.setLifetime(this.epoch);
      if(refreshStatisticsCounter-- <= 0){
        this.getStatistics();
        refreshStatisticsCounter = 100;
      }
    });
    this.checkInfection();
    this.updatePersonsDictPosition();

    this.requestId = requestAnimationFrame(() => this.tick);
  }

  getSamePositionPersons(){
    let list_persons_same_position = []
    for (var prop in this.personsPositions) {
      if (Object.prototype.hasOwnProperty.call(this.personsPositions, prop)) {
          if(this.personsPositions[prop].length > 0){
            list_persons_same_position.push(this.personsPositions[prop])
          }
      }
    }

    return list_persons_same_position;
  }

  checkInfection(){
    //console.log("checkInfection")
    //get array of persons in the same position
    let persons_in_same_position = this.getSamePositionPersons()
    //console.log("checkInfection: persons_in_same_position", persons_in_same_position)

    if(persons_in_same_position == undefined || persons_in_same_position.length == 0){
      //console.log("no colision")
      return
    }

    for(let i = 0; i < persons_in_same_position.length; i++){
      let person = persons_in_same_position[i][0]
      //check collision
      for(let j = 1; j < persons_in_same_position[i].length; j++){
        person.getInfectionBehavior().infect(person, persons_in_same_position[i][j]);

        //when hit someone has chance of 30% to change direction
        person.setVelocityBehavior(new VelocityConstant(
            (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*person.getVelocityBehavior().getVx(),
            (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*person.getVelocityBehavior().getVy()
        ));
      }
      
    }
  }

  createPopulation(){
    //just create first time
    if(this.persons.length > 0)
      return;
    this.createPersons(this.populationSize, this.infectedPercent,this.stoppedPercent);
    this.tick();
  }

  reset(){
    this.persons = [];
    this.epoch = 0;
    this.createCoronaInfectionChart();
    this.createHistogramByAgeChart();
    this.updateOptionHistogramByAge = undefined;
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
    this.ctx.clearRect(0, 0, this.style_width, this.style_height);
  }

  play() {
    this.playing = true;
    this.createPopulation();
    this.ngZone.runOutsideAngular(() => this.tick());
    this.interval = setInterval(() => {
      this.tick();
    }, 100);
  }

  stop(){
    this.playing = false;
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  createPersons(numberOfPersons:number, infectedPercentage:number, stopedPercentage:number){
    let numberPersonsInfected = Math.ceil(numberOfPersons * infectedPercentage);
    let numberPersonsStoped = Math.ceil((numberOfPersons-numberPersonsInfected) * stopedPercentage);

    this.totalPersons = numberOfPersons;
    this.infectedPersons = numberPersonsInfected;
    this.stoppedPersons = numberPersonsStoped;

    for(let i = 0; i < (numberOfPersons - numberPersonsInfected - numberPersonsStoped); i++){
      let vx = this.randomGenerator.getRandomInt(0,10)%2 == 0 ? 1 : -1; //50% chance
      let vy = this.randomGenerator.getRandomInt(0,10)%2 == 0 ? 1 : -1; //50% chance
      let person = new Person(this.ctx, this.personSize,Healthy.ok, vx, vy, this.chanceOfInfect, this.incubationTime, this.healingTime);
      person.setRandomPosition();
      this.persons = this.persons.concat(person);
    }

    //infected people
    for(let i = 0; i < numberPersonsInfected; i++){
      let vx = this.randomGenerator.getRandomInt(0,10)%2 == 0 ? 1 : -1;
      let vy = this.randomGenerator.getRandomInt(0,10)%2 == 0 ? 1 : -1;
      let person = new Person(this.ctx, this.personSize, Healthy.sick_hidden, vx, vy, this.chanceOfInfect, this.incubationTime, this.healingTime);
      person.setRandomPosition();
      this.persons = this.persons.concat(person);
    }

    //stopped people
    for(let i = 0; i < numberPersonsStoped; i++){
      let vx = 0;
      let vy = 0;
      let person = new Person(this.ctx, this.personSize, Healthy.ok, vx, vy, this.chanceOfInfect, this.incubationTime, this.healingTime);
      person.setRandomPosition();
      this.persons = this.persons.concat(person);
    }
    
  }


  getStatistics(){
    let countOkPersons = 0;
    let countInfectedPersons = 0;
    let countHealedPersons = 0;
    let countDeadPersons = 0;

    let ageGroupPercentage = {
      80 : 0,
      70 : 0,
      60 : 0,
      50 : 0,
      40 : 0,
      30 : 0,
      20 : 0,
      10 : 0,
      0  : 0
    }

    for(let i =0;i<this.persons.length; i++){
      if(this.persons[i].getHealthy() == Healthy.ok){
        countOkPersons++;
      }
      else if(this.persons[i].getHealthy() == Healthy.healed){
        countHealedPersons++;
      }
      else if(this.persons[i].getHealthy() == Healthy.dead){
        countDeadPersons++;
      }
      else if(this.persons[i].getHealthy() == Healthy.sick || this.persons[i].getHealthy() == Healthy.sick_hidden){
        countInfectedPersons++;
      }

      for(let key in ageGroupPercentage){
        if (parseInt(key)/10 == Math.floor(this.persons[i].getAge()/10))
          ageGroupPercentage[key] = ageGroupPercentage[key] + 1;
      }
    }

    this.actualInfectedPersons = countInfectedPersons;
    this.actualHealedPersons = countHealedPersons;
    this.actualOkPersons = countOkPersons;
    this.actualDeadPersons = countDeadPersons;
    this.actualCountByAge = ageGroupPercentage;

    this.updateHistogramByAgeChart(ageGroupPercentage);
    this.updateCoronaInfectionChart(this.epoch, this.actualOkPersons, this.actualInfectedPersons, this.actualHealedPersons, this.actualDeadPersons);
  }

  createCoronaInfectionChart(){
    this.optionCoronaInfection = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Healthy',
        type: 'line',
        color: HealthyColor.ok,
        showSymbol: false,
        hoverAnimation: false,
        data: [],
        areaStyle: {},
      },{
        name: 'Infected',
        type: 'line',
        color: HealthyColor.sick,
        showSymbol: false,
        hoverAnimation: false,
        data: [],
        areaStyle: {},
      },{
        name: 'Healed',
        type: 'line',
        color: HealthyColor.healed,
        showSymbol: false,
        hoverAnimation: false,
        data: [],
        areaStyle: {},
      },{
        name: 'Dead',
        type: 'line',
        color: HealthyColor.dead,
        showSymbol: false,
        hoverAnimation: false,
        data: [],
        areaStyle: {},
      }],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
  }

  updateCoronaInfectionChart(time:number, ok:number, infected:number, healed:number, dead:number){
    //avoiding to insert the same time
    let lastInsertedData = this.optionCoronaInfection.series[0].data[this.optionCoronaInfection.series[0].data.length-1]
    if(lastInsertedData != undefined && lastInsertedData[0] == time){
      return;
    }

    this.optionCoronaInfection.series[0].data.push([time, ok]);
    this.optionCoronaInfection.series[1].data.push([time, infected]);
    this.optionCoronaInfection.series[2].data.push([time, healed]);
    this.optionCoronaInfection.series[3].data.push([time, dead]);

    //console.log(this.optionCoronaInfection.series[0].data)

    this.updateOptionCoronaInfection ={
      series: [{
        data: this.optionCoronaInfection.series[0].data
      },{
        data: this.optionCoronaInfection.series[1].data
      },{
        data: this.optionCoronaInfection.series[2].data
      },{
        data: this.optionCoronaInfection.series[3].data
      }]
    };
  }

  createHistogramByAgeChart(){
    this.optionHistogramByAge = {
      tooltip: {},
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        }
      },
      yAxis: {
      },
      series: [{
        name: 'Age Histogram',
        type: 'bar',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      }],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
  }

  updateHistogramByAgeChart(ageGroupPercentage){
    if(this.updateOptionHistogramByAge != undefined)// avoid redraw chart
      return;

    const data = [];

    for(let age in ageGroupPercentage){
      data.push([age + " - " + (parseInt(age)+9), ageGroupPercentage[age]])
    }

    this.updateOptionHistogramByAge ={
      series: [{
        data: data
      }]
    };
  }

  ngOnDestroy() {
    this.playSubscription.unsubscribe();
    this.stopSubscription.unsubscribe();
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
}
