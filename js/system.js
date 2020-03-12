class System {
    constructor(canvas, minX, minY, maxX, maxY){
        this.padding = 40;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.min_x = minX;
        this.min_y = minY;
        this.max_x = maxX;
        this.max_y = maxY;

        this.scF_x = (canvas.width-this.padding)/(this.max_x-this.min_x);
        this.scF_y = (canvas.height-this.padding)/(this.max_y-this.min_y);
    }
    convert(point){
        let r = {
            x: this.scF_x*(point.x-this.min_x)+this.padding,
            y: this.canvas.height-this.scF_y*(point.y-this.min_y)-this.padding
        };
        return r;
    }
    drawLine(from, to){
        from = this.convert(from);
        to = this.convert(to);
        let ctx = this.context;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    drawArrow(context, from, to) {
        from = this.convert(from);
        to = this.convert(to);

        let radius = context.lineWidth*2;
        let setBackLength = radius;

        let angle = Math.atan2(to.y - from.y, to.x - from.x)
        to.x -= setBackLength*Math.cos(angle);
        to.y -= setBackLength*Math.sin(angle);

        context.fillStyle = context.strokeStyle;
        let x_center = to.x, y_center = to.y;
        let x, y;

        context.beginPath();
        x = radius * Math.cos(angle) + x_center;
        y = radius * Math.sin(angle) + y_center;
        context.moveTo(x, y);
        for(let i=0; i<2; i++) {
            angle += (1.0 / 3.0) * (2 * Math.PI)
            x = radius * Math.cos(angle) + x_center;
            y = radius * Math.sin(angle) + y_center;
            context.lineTo(x, y);
        }
        context.closePath();
        context.fill();

        context.beginPath()						//Arrow Line
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
    }
    drawAxis(){
        let ctx = this.context
        ctx.lineWidth = 4;
        this.drawArrow(ctx, {x:0, y:this.min_y}, {x:0, y:this.max_y}); //y-Axis
        this.drawArrow(ctx, {x:this.min_x, y:0}, {x:this.max_x, y:0}); //x-Axis
    }
    drawMarks(n=10, numbers=true){
        let offSet_x = Math.floor((this.max_x-this.min_x)/n), offSet_y = Math.floor((this.max_y-this.min_y)/n);
        if(offSet_x < 1 || offSet_y < 1){
            console.log("Trying to do too many marks...");
            return;
        }
        let y=this.min_y;
        this.context.strokeStyle="grey";
        this.context.lineWidth=2;
        this.context.font="12px New Times Roman";
        this.context.fillStyle = "grey";
        this.context.textAlign = "center";
        for(let x=this.min_x; x<this.max_x; x+=offSet_x){	// x marks
            if(x===0){
                continue;
            }
            this.drawLine({x:x,y:0},{x:x,y:-0.015*(this.max_y-this.min_y)});
            if(numbers){
                let pos = this.convert({x:x,y:-0.015*(this.max_y-this.min_y)})
                this.context.fillText(x.toString(), pos.x, pos.y+12+2);
            }
        }
        this.context.textAlign = "end";
        for(let y=this.min_y; y<this.max_y; y+=offSet_y){	// y marks
            if(y===0){
                continue;
            }
            this.drawLine({x:0,y:y},{x:-0.015*(this.max_x-this.min_x),y:y});
            if(numbers){
                let pos = this.convert({x:-0.015*(this.max_x-this.min_x),y:y})
                this.context.fillText(y.toString(), pos.x-2, pos.y+5);
            }
        }
    }
    drawLabels(name){
        this.context.textAlign = "start";
        this.context.font = "15px New Times Roman";
        let pos = this.convert({x:0.01*(this.max_y-this.min_y), y:0});
        this.context.fillText(name, pos.x, 10);
        let pos2 = this.convert({x:this.max_x, y:0});
        this.context.textAlign = "end";
        this.context.fillText("x", pos2.x-3, pos2.y-15);
    }
    plot(f, accuracy, color="black"){
        this.context.strokeStyle=color;
        this.context.lineWidth=2;
        let from = {x:0, y:0};
        let to = {x:this.min_x, y:f(this.min_x)};
        for(let i=1; i<=(this.max_x-this.min_x)/accuracy; i++){
            from = {...to};
            to.x += accuracy;
            to.y = f(to.x);
            this.drawLine(from, to);
        }
    }
}