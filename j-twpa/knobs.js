const debug_mode = true;//set to false to send data over socket
let socket = null;

if (!debug_mode) {
  socket = new WebSocket('ws://localhost:8080');
}

knobs = [];
knobPayload = {};

f0 = 12.5e9;//Hz
fmin = 10e9;
fmax = 15e9;

p0 = 0;
pmax = 13;
pmin = -20;
pump_frequency = f0;
pump_power = 0;//dBm

fetch('load-file.php?filename=knobs.json')
  .then(response => response.text())
  .then(data => {
    knobs = JSON.parse(data.trim());
    for(let index = 0;index < knobs.length;index++){
        knobPayload[knobs[index].variable] = knobs[index].value;
    }
     
});

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
    textFont('Courier New');
    textSize(32);
    
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
        
        line(x0 + unit*knobs[index].x,y0 - unit*knobs[index].y,x0 + unit*knobs[index].x + knobs[index].r*unit*Math.sin(knobs[index].value*2*Math.PI/knobs[index].N),y0 - unit*knobs[index].y - knobs[index].r*unit*Math.cos(knobs[index].value*2*Math.PI/knobs[index].N));
        fill(0);
        strokeWeight(1);
        textString = knobs[index].variable + " = " + knobs[index].value.toString();

        text(textString,x0 + unit*knobs[index].x - 32*0.295*textString.length,y0 - unit*knobs[index].y - knobs[index].r*unit - 10);
        if(knobIndex >= 0){
            cursor(HAND);
        } else{
            cursor(ARROW);
        }
    }    
    text("f = " + (pump_frequency/1e9).toFixed(3) + " GHz",10,40);
    text("p = " + (pump_power).toFixed(3) + " dBm",10,0.5*height);
    textFont('Arial');
    textSize(50);
    text("J-TWPA Pump Control",0.5*width-250,40);
    
}

function mouseWheel(event) {
    if(knobIndex >= 0){
        if(event.delta > 0){ 
            knobs[knobIndex].value++;
        }
        else{
            knobs[knobIndex].value--;
        }
        pump_frequency = f0 + 100e6*knobs[0].value + 10e6*knobs[1].value + 1e6*knobs[2].value;
        pump_power = p0 + knobs[3].value + 0.1*knobs[4].value + 0.01*knobs[5].value;
        if(pump_frequency > fmax){
            pump_frequency = fmax;
        }        
        if(pump_frequency < fmin){
            pump_frequency = fmin;
        }        
        if(pump_power > pmax){
            pump_power = pmax;
        }        
        if(pump_power < pmin){
            pump_power = pmin;
        }        

        knobPayload.pump_frequency = pump_frequency;
        knobPayload.pump_power = pump_power;
        knobPayload[knobs[knobIndex].variable] = knobs[knobIndex].value;
        console.log(JSON.stringify(knobPayload));
        sendData(knobPayload);
    }
}

function sendData(instrumentData) {
  if (!debug_mode && socket) {
    socket.send(JSON.stringify(instrumentData));
  } else {
    console.log("Debug Mode (No Socket Connection):", instrumentData);
  }
}