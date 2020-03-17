import { Drawable } from './drawable';
import { VelocityConstant } from '../behaviors/velocity/velocity_constant';
import { Random } from '../utils/random';
import { InfectionBehavior } from '../behaviors/infection/infection_behavior';
import { NormalInfection } from '../behaviors/infection/normal_infection';
import { VelocityBehavior } from '../behaviors/velocity/velocity_behavior';

export enum Healthy {
    ok = 1,
    sick_hidden = 2,
    sick = 3,
    healed = 4,
    contacting = 5,
    dead = 6
}

export enum HealthyColor {
    ok = "#73a373",
    sick_hidden = "#eedd78",
    sick = "#dd6b66",
    healed = "#73b9bc",
    contacting = "#ea7e53",
    dead = "#212529"
}

export class Person extends Drawable{
    private id;
    private age:number;
    private health:Healthy = 1;
    private lifeTime:number = 0;
    private infectionTime:number = 0;
    private velocityBehavior:VelocityBehavior;
    private infectionBehavior:InfectionBehavior;
    private randomGenerator:Random = new Random();

    constructor(ctx: CanvasRenderingContext2D, health:Healthy, vx:number, vy:number,chanceOfInfect:number, incubationTime:number,healingTime:number) {
        super(ctx);
        this.id = this.randomGenerator.getNewGuid();
        this.age = this.randomGenerator.getRandomInt(1,96);
        this.setSize(10);
        this.setHealthy(health);
        this.velocityBehavior = new VelocityConstant(vx,vy);
        this.infectionBehavior = new NormalInfection(chanceOfInfect, incubationTime, healingTime);
    }

    getColorBasedOnHealthy():string{
        switch(this.health){
            case Healthy.ok:
                return HealthyColor.ok;
            case Healthy.sick:
                return HealthyColor.sick;
            case Healthy.sick_hidden:
                return HealthyColor.sick_hidden;
            case Healthy.contacting:
                return HealthyColor.contacting;
            case Healthy.healed:
                return HealthyColor.healed;
            case Healthy.dead:
                return HealthyColor.dead;
        }
    }
  
    public setHealthy(health:Healthy){
        this.health = health;
        this.setColor(this.getColorBasedOnHealthy());
    }

    public getHealthy():Healthy{
        return this.health;
    }

    public setRandomPosition(xMax:number,yMax:number){
        this.setX(this.randomGenerator.getRandomInt(0,xMax));
        this.setY(this.randomGenerator.getRandomInt(0,yMax));
    }

    public setLifetime(time:number){
        this.lifeTime = time;
    }

    public getLifetime():number{
        return this.lifeTime;
    }

    public setInfectiontime(time:number){
        this.infectionTime = time;
    }

    public getInfectiontime():number{
        return this.infectionTime;
    }

    public getAge():number{
        return this.age;
    }

    public stopMove(){
        //just stop updating the velocity vector to 0
        this.velocityBehavior = new VelocityConstant(0,0);
    }

    public startMove(){
        //random direction
        this.velocityBehavior = new VelocityConstant(
            (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1),
            (this.randomGenerator.getRandomInt(0,100) <= 40 ? 1 : -1)
        );
    }

    move(persons:Person[]){
        //console.log("this.getX()",this.getX())
        //console.log("this.getY()",this.getY())
        this.setX(this.getX() + this.velocityBehavior.getVx());
        this.setY(this.getY() + this.velocityBehavior.getVy());

        //10% chance to change the current movement behavior to a random one... if not sick
        if(this.randomGenerator.getRandomInt(0,100) <= 10 && this.getHealthy() != Healthy.sick)
            this.velocityBehavior = new VelocityConstant(
                (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*this.velocityBehavior.getVx(),
                (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*this.velocityBehavior.getVy()
            );

        //draw the points
        let drawResult = this.draw();

        //updating symptoms of infection
        this.infectionBehavior.updateSymptoms(this);

        //check colisions with other people
        for(let i = 0;i<persons.length; i++){
            if(this.checkHitAnotherPerson(persons[i])){
                //run infection behavior to simulate infections in other people
                this.infectionBehavior.infect(this, persons[i]);

                //when hit someone has chance of 30% to change direction
                this.velocityBehavior = new VelocityConstant(
                    (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*this.velocityBehavior.getVx(),
                    (this.randomGenerator.getRandomInt(0,100) <= 30 ? 1 : -1)*this.velocityBehavior.getVy()
                );
                return;
            }
        }
        
        //when hit the boundry limit I invert the velocity vector
        if (drawResult == -1){
            this.velocityBehavior = new VelocityConstant(
                -1*this.velocityBehavior.getVx(),
                this.velocityBehavior.getVy()
            );
        }
        else if (drawResult == -2){
            this.velocityBehavior = new VelocityConstant(
                this.velocityBehavior.getVx(),
                -1*this.velocityBehavior.getVy()
            );
        }
    }

    checkHitAnotherPerson(person2:Person):Boolean{
        if (this.id == person2.id) //excluding yourself
            return;
            
        if(this.getX() == person2.getX() && this.getY() == person2.getY()){
            //console.log("HITTT", this.getX(), this.getY(), person2.getX(), person2.getY())
            return true;
        }
        return false;
    }

    moveStepRight() {
        this.setX(this.getX() + this.velocityBehavior.getVx());
        this.draw();
    }

    moveStepDown() {
        this.setY(this.getY() + this.velocityBehavior.getVy());
        this.draw();
    }
}
  