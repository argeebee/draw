
var draw = (function(){
    //Get height and width of the main element, we will
    //use this to size the canvas
    var main = document.querySelector('main');
    var mWidth = main.offsetWidth;
    var mHeight = main.offsetHeight;

    //Create the canvas
    var canvas = document.createElement('canvas');
    
    //Create a drawing context
    var ctx = canvas.getContext('2d');

    //Create the initial bounding box
    var rect = canvas.getBoundingClientRect();

    //Current x,y 
    var x = 0;
    var y = 0;

    //start x,y
    var x1 = 0;
    var y1 = 0;

    //end x,y
    var x2 = 0;
    var y2 = 0;

    //end x,y
    var lx = false;
    var ly = false;

    //what shape are we drawing?
    var shape = '';


    var isDrawing = false;


//TRACKING
var stack = [];




    return{

        setIsDrawing: function(bool){
            isDrawing = bool;
        },

        getIsDrawing: function(){
            return isDrawing;
        },

        getShape: function(){
            return shape;
        },

        //sets shape to be drawn
        setShape: function(shp){
            shape = shp;
        },


        //set a random color
        randColor: function(){
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        },

        //set starting x,y (mousedown)
        setStart: function(){
            x1=x;
            y1=y;
        },

        //set ending x,y (mouseup)
        setEnd: function(){
            x2 = x;
            y2 = y;
        },

        //Set x,y coords based on event data
        setXY: function(evt){
            //set the last x,y coords
            lx = x;
            ly = y;

            //set the current x,y coords
            x = (evt.clientX - rect.left) - canvas.offsetLeft;
            y = (evt.clientY - rect.top) - canvas.offsetTop;
        },
        
        //Write x, y coords back to the UI
        writeXY: function(){
            document.getElementById('trackX').innerHTML = 'X: ' + x;
            document.getElementById('trackY').innerHTML = 'Y: ' + y;
        },

        //draw a shape
        draw: function(){
            ctx.restore();
            switch(shape){
                case 'rectangle':
                    this.drawRect();
                    break;
                case 'line':
                    this.drawLine();
                    break;
                case 'circle':
                    this.drawCircle();
                    break;
                case 'triangle':
                    this.drawTriangle();
                    break;
                case 'path':
                    this.drawPath();
                    break;
                        
            default:
              //  alert('Please choose a shape');
                break;
            }
            ctx.save();
           // console.log(stack);
        },

        //Draw Circle
        drawCircle: function(){
            ctx.strokeStyle = this.randColor();
            ctx.fillStyle = this.randColor();

            var a = (x1-x2);
            var b = (y1-y2);
            var radius = Math.sqrt(a*a + b*b);

            ctx.beginPath();
            ctx.arc(x1, y1, radius, 0, 2*Math.PI);
            ctx.stroke();
            ctx.fill();


            stack.push({
                shape: 'circle',
                coords: {
                    x1:x1,
                    y1:y1,
                    x2:x2,
                    y2:y2
                },
                styles: {
                    stroke: ctx.strokeStyle,
                    fill: ctx.fillStyle
                }
            });

        },

        
        
        // //draw three point triangle
        // draw3Point: function (){

            // stack.push({
            //     shape: '3-point',
            //     coords: {
            //         points: points
            //     },
            //     styles: {
            //         stroke: ctx.strokeStyle,
            //         fill: ctx.fillStyle
            //     }
            // });


        // },
        
        //Draw Triangle
        drawTriangle: function(){

            var a = (x1-x2);
            var b = (y1-y2);
            var c = Math.sqrt(a*a + b*b);

            var d = x1+c;
            var e = y1+c;

            //Drag left to right
            if(x1>x2){
                d=x1-c;
            }

            //Drag up
            if(y1>y2){
                e=y1-c;
         }
        
            ctx.fillStyle = this.randColor();
            ctx.strokeStyle = this.randColor();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(d,e);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.fill();

            stack.push({
                shape: 'triangle',
                coords: {
    
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2
                },
                
                styles: {
                    stroke: ctx.strokeStyle,
                    fill: ctx.fillStyle
                }
            });

            
        },

        //Draw path
        drawPath: function(){
            ctx.strokeStyle = this.randColor();
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(x, y);
            ctx.stroke();

            stack.push({
                shape: 'path',
                coords: {
                    lx: lx,
                    ly: ly,
                    x: x,
                    y: y
                },
                styles: {
                    stroke: ctx.strokestyle,
                }
            });


        },

        //Draw line
        drawLine: function(){
            ctx.strokeStyle = this.randColor();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            stack.push({
                shape: 'line',
                coords: {
                    x1:x1,
                    y1:x1,
                    x2:x2,
                    y2:y2            
                },
                styles: {
                    stroke: ctx.strokestyle
                }
            });


        },

        //Draw a rectangle
        drawRect: function(){

            ctx.fillStyle = this.randColor();
            ctx.fillRect(x1, y1, (x2-x1), (y2-y1));
            ctx.strokeStyle = this.randColor();
            //ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, (x2-x1), (y2-y1));
           
            stack.push({
                shape: 'rectangle',
                coords: {
                    x1:x1,
                    y1:y1,
                    x2:x2,
                    y2:y2            
                },
                styles: {
                    stroke: ctx.randColor,
                    fill: ctx.randColor
                }
            });

        },
      

        clear: function(){
            canvas.width = canvas.width;
        },

        redraw: function(){
            
            for (item in stack){
                
                switch(shape){

                    case 'path':
                        shape=stack[item].shape;
                        lx= stack[item].coords.lx;
                        ly= stack[item].coords.ly;
                        x = stack[item].coords.x;
                        y = stack[item].coords.y;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        break;

                    case 'circle':
                        shape=stack[item].shape;
                        x1=stack[item].coords.x1;
                        y1=stack[item].coords.y1;
                        x2=stack[item].coords.x2;
                        y2=stack[item].coords.y2;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        ctx.fillStyle = stack[item].styles.fill;
                        break;


                    case 'line':
                        shape=stack[item].shape;
                        x1=stack[item].coords.x1;
                        y1=stack[item].coords.y1;
                        x2=stack[item].coords.x2;
                        y2=stack[item].coords.y2;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        break;

                    case 'rectangle':
                        shape=stack[item].shape;
                        x1=stack[item].coords.x1;
                        y1=stack[item].coords.y1;
                        x2=stack[item].coords.x2;
                        y2=stack[item].coords.y2;
                        //ctx.lineWidth = stack[item].
                        ctx.strokeStyle = stack[item].styles.stroke;
                        ctx.fillStyle = stack[item].styles.fill;
                        break;

                    case 'triangle':
                        shape=stack[item].shape;
                        x1= stack[item].coords.x1;
                        y1= stack[item].coords.y1;
                        x2 = stack[item].coords.x2;
                        y2 = stack[item].coords.y2;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        ctx.fillStyle = stack[item].styles.fill;
                        break;
                }

                this.draw();

            }
        },


        //Implementation details
        getCanvas: function(){
            return canvas;
        },

        init: function(){
            canvas.width = mWidth;
            canvas.height = mHeight;
            main.appendChild(canvas);
        }
    }

})();

draw.init();


//draw a rectangle
document.getElementById('btnRect').addEventListener('click', function(){
    draw.setShape('rectangle');
});

//draw a triangle
document.getElementById('btnTri').addEventListener('click', function(){
    draw.setShape('triangle');
});

//draw a line
document.getElementById('btnLine').addEventListener('click', function(){
    draw.setShape('line');
});

//draw a circle
document.getElementById('btnCircle').addEventListener('click', function(){
    draw.setShape('circle');
});

//draw a path
document.getElementById('btnPath').addEventListener('click', function(){
    draw.setShape('path');
});


//clear canvas 
document.getElementById('btnClear').addEventListener('click', function(){
    if(confirm('Are you sure you want to clear the canvas?')){
        //place clear logic here
        draw.clear();
    }
});

//redraw canvas
document.getElementById('btnRedraw').addEventListener('click', function(){
    if(confirm('Are you sure you want to redraw the canvas?')){
        //place clear logic here
        draw.redraw();
    }
});


//listener get the starting position
draw.getCanvas().addEventListener('mousedown', function(){
    draw.setStart();
    draw.setIsDrawing(true);
});

//get the ending position
draw.getCanvas().addEventListener('mouseup', function(){
    draw.setEnd();
    draw.draw();
    draw.setIsDrawing(false);
});

//track the xy position
draw.getCanvas().addEventListener('mousemove', function(evt){
    draw.setXY(evt);
    draw.writeXY();

    if(draw.getShape() === 'path' && draw.getIsDrawing() === true){
    draw.draw();
    }
});


//draw.drawRect();

//     //Calculate x, y
    
//     var x = evt.clientX - rect.left;
//     var y = evt.clientY - rect.top;

//     //Write the coords back to the UI
//     document.getElementById('trackX').innerHTML = 'X: ' + x;
//     document.getElementById('trackY').innerHTML = 'Y: ' + y;
// });
