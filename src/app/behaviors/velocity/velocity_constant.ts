import { VelocityBehavior } from './velocity_behavior';

export class VelocityConstant implements VelocityBehavior{
    private v0x:number;
    private v0y:number;

    constructor(v0x:number, v0y:number) {
        this.v0x = v0x;
        this.v0y = v0y;
    }

    getVx(){
        return this.v0x;
    }

    getVy(){
        return this.v0y;
    }
}
  