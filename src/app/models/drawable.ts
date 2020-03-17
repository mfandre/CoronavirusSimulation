export class Drawable {
    private color:string = 'red';
    private x:number = 0;
    private y:number = 0;
    private z:number = 10;
    private width = -1;
    private height = -1
    private boundry = {
        xMin : 0,
        xMax : 0,
        yMin : 0,
        yMax : 0
    };
    
    constructor(protected ctx: CanvasRenderingContext2D) {
        let sizeWidth = this.ctx.canvas.clientWidth;
        let sizeHeight = this.ctx.canvas.clientHeight;
        this.width = sizeWidth;
        this.height = sizeHeight;
        this.calculateBoundry();
    }
  
    private calculateBoundry(){
        this.boundry = {
            xMin : 0,
            xMax : (this.width/this.z)-1,
            yMin : 0,
            yMax : (this.height/this.z)-1
        }
    }

    protected setColor(color:string){
        this.color = color;
    }

    protected setPosition(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    protected setX(x:number){
        if(this.x > this.boundry.xMax){
            this.x = this.boundry.xMax;
        }
        else if(this.x < this.boundry.xMin){
            this.x = this.boundry.xMin;
        }
        else{
            this.x = x;
        }
    }

    protected setY(y:number){
        if(this.y > this.boundry.yMax){
            this.y = this.boundry.yMax;
        }
        else if(this.y < this.boundry.yMin){
            this.y = this.boundry.yMin;
        }
        else{
            this.y = y;
        }
    }

    protected getX(){
        return this.x;
    }

    protected getY(){
        return this.y;
    }

    protected setSize(size:number){
        this.z = size;
        this.calculateBoundry();
    }

    protected getSize():number{
        return this.z;
    }

    /**
     * return 0 if draw correct (inside the boundry)
     * -1 if exceed X boundry
     * -2 if exceed Y boundry
     */
    protected draw():number {
        let result = 0;

        if(this.x >= this.boundry.xMax){
            result = -1;
            this.x = this.boundry.xMax;
        }
        else if(this.x <= this.boundry.xMin){
            result = -1;
            this.x = this.boundry.xMin;
        }
        
        else if(this.y >= this.boundry.yMax){
            result = -2;
            this.y = this.boundry.yMax;
        }
        else if(this.y <= this.boundry.yMin){
            result = -2;
            this.y = this.boundry.yMin;
        }

        this.ctx.fillStyle = this.color;

        //draw circle
        //this.ctx.beginPath();
        //this.ctx.arc(this.x, this.y, this.z, 0, 2 * Math.PI);
        //this.ctx.stroke(); 

        //draw square
        this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);

        //console.log(this.x)
        //console.log(this.y)
        return result;
    }
}