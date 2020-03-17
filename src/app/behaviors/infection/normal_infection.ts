import { InfectionBehavior } from './infection_behavior';
import { Person, Healthy } from 'src/app/models/person';
import { Random } from 'src/app/utils/random';

export class NormalInfection implements InfectionBehavior{
    private chanceOfInfect:number;
    private incubationTime:number;
    private healingTime:number;
    private randomGenerator:Random = new Random();

    constructor(chanceOfInfect:number, incubationTime:number,healingTime:number) {
        this.chanceOfInfect = chanceOfInfect;
        this.incubationTime = incubationTime;
        this.healingTime = healingTime;
    }

    dieChance(person1:Person){
        //#assumption#5 just die during sick status
        if(person1.getLifetime() <= 1 || person1.getHealthy() != Healthy.sick)
            return;

        let ageGroupPercentage = {
            "80" : 0.18,
            "70" : 0.098,
            "60" : 0.046,
            "50" : 0.04,
            "40" : 0.03,
            "30" : 0.02,
            "20" : 0.01,
            "10" : 0.01,
            "0"  : 0.01
        }

        let chanceToDie = ageGroupPercentage[Math.floor(person1.getAge()/10)]

        if(this.randomGenerator.getRandomInt(0,100) < chanceToDie*100){
            person1.setHealthy(Healthy.dead);
            person1.stopMove();
            //console.log("DEAD!!!");
        }
    }

    updateSymptoms(person1:Person){
        //check for dieChance
        this.dieChance(person1);

        //change between sick_hidden to sick (sick present symptons)
        if(person1.getHealthy() == Healthy.sick_hidden){
            if(person1.getLifetime() - person1.getInfectiontime() >= this.incubationTime){
                person1.setHealthy(Healthy.sick);
                person1.stopMove();//when sick the person dont move... assumption#1
            }
        }
        //change sick to healed...
        else if(person1.getHealthy() == Healthy.sick){
            if(person1.getLifetime() >= this.healingTime + person1.getInfectiontime()){
                person1.setHealthy(Healthy.healed);
                person1.startMove();//after sickness the person move again... assumption#4
            }
        }
    }

    infect(person1:Person, person2:Person){

        let person1Sickness:Boolean = person1.getHealthy() == Healthy.sick || person1.getHealthy() == Healthy.sick_hidden;
        let person2Sickness:Boolean = person2.getHealthy() == Healthy.sick || person2.getHealthy() == Healthy.sick_hidden;

        //just ignoring if has contacting
        if(person1.getHealthy() == Healthy.contacting || person2.getHealthy() == Healthy.contacting)
            return;

        //if sick and heal will never get infected again... its not necessary true
        //assumption#3 after healed never infected again
        if(person1.getHealthy() == Healthy.healed || person2.getHealthy() == Healthy.healed)
            return;

        //if dead do nothing... assumption#2 after dead dont infection other
        if(person1.getHealthy() == Healthy.dead || person2.getHealthy() == Healthy.dead)
            return;

        if(person1Sickness && !person2Sickness){
            if(this.randomGenerator.getRandomInt(0,100) < this.chanceOfInfect*100){
                person2.setHealthy(Healthy.sick_hidden);
                person2.setInfectiontime(person2.getLifetime());
                //console.log("infectionnnn")
            }   
        }

        if(person2Sickness && !person1Sickness){
            if(this.randomGenerator.getRandomInt(0,100) < this.chanceOfInfect*100){
                person1.setHealthy(Healthy.sick_hidden);
                person1.setInfectiontime(person1.getLifetime());
                //console.log("infectionnnn")
            }
        }
    }
}
  