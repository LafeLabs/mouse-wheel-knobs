
const debug_mode = true;//set to false to send data over socket
let socket = null;

if (!debug_mode) {
  socket = new WebSocket('ws://localhost:8080');
}

knobs = [];

knobPayload = {};

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
        textSize(32);
        textString = knobs[index].variable + " = " + knobs[index].value.toString();
          textFont('Courier New');

        text(textString,x0 + unit*knobs[index].x - 32*0.295*textString.length,y0 - unit*knobs[index].y - knobs[index].r*unit - 10);
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