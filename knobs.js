knobs = [
    {
        "x":-0.9,
        "y":0,
        "r":0.3,
        "variable":"a",
        "value":0
    },{
        "x":0,
        "y":0,
        "r":0.3,
        "variable":"b",
        "value":0
    },{
        "x":0.9,
        "y":0,
        "r":0.3,
        "variable":"c",
        "value":0
    }
];

knobPayload = {};
for(let index = 0;index < knobs.length;index++){
    knobPayload[knobs[index].variable] = knobs[index].value;
}

knobIndex = -1;

function setup() {
     
    let container = document.getElementById('p5-canvas-container');
    let w = container.clientWidth;
    let h = container.clientHeight;
    let canvas = createCanvas(w, h);
    canvas.parent('p5-canvas-container');
    unit =  0.5*Math.min(innerWidth, innerHeight);
    x0 = 0.5*width;
    y0 = 0.5*height;
    
}

function draw() {
    clear();
    stroke(0);
    noFill();
    knobIndex = -1;
    for(let index = 0;index < knobs.length;index++){
        strokeWeight(6);

        d = Math.sqrt((mouseX - (x0 + unit*knobs[index].x))**2+ (mouseY - (y0 - unit*knobs[index].y))**2);
        if(d < unit*knobs[index].r){
            fill("#00000080");
            knobIndex = index;
        } else{
            noFill();
        }
        circle(x0 + unit*knobs[index].x,y0 - unit*knobs[index].y,2*unit*knobs[index].r);
        
        line(x0 + unit*knobs[index].x,y0 - unit*knobs[index].y,x0 + unit*knobs[index].x + knobs[index].r*unit*Math.sin(knobs[index].value*Math.PI/12),y0 - unit*knobs[index].y - knobs[index].r*unit*Math.cos(knobs[index].value*Math.PI/12));
        fill(0);
        strokeWeight(1);
        textSize(32);
        text(knobs[index].variable + " = " + knobs[index].value.toString(),x0 + unit*knobs[index].x - 0.2*unit*knobs[index].r,y0 - unit*knobs[index].y - knobs[index].r*unit - 10);
        if(knobIndex >= 0){
            cursor(HAND);
        } else{
            cursor(ARROW);
        }
    }    
}

function mouseWheel(event) {
    if(knobIndex >= 0){
        if(event.delta > 0){ 
            knobs[knobIndex].value++;
        }
        else{
            knobs[knobIndex].value--;
        }
        if(knobs[knobIndex].value < 0){
            knobs[knobIndex].value = 23;
        }
        knobs[knobIndex].value = knobs[knobIndex].value%24;
        knobPayload[knobs[knobIndex].variable] = knobs[knobIndex].value;
        console.log(JSON.stringify(knobPayload));
    }
}