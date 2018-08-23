
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
                case 'path':
                    this.drawPath();
                    break;
                        
            default:
              //  alert('Please choose a shape');
                break;
            }
            ctx.save();
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
        },

        //Draw path
        drawPath: function(){
            ctx.strokeStyle = this.randColor();
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(x, y);
            ctx.stroke();
        },

        //Draw line
        drawLine: function(){
            ctx.strokeStyle = this.randColor();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        },

        //Draw a rectangle
        drawRect: function(){

            ctx.fillStyle = this.randColor();
            ctx.fillRect(x1, y1, (x2-x1), (y2-y1));
            ctx.strokeStyle = this.randColor();
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, (x2-x1), (y2-y1));

            // ctx.fillStyle = 'rgb(200, 0, 0)';
            // ctx.fillRect(10, 10, 55, 50);

            // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
            // ctx.fillRect(30, 30, 55, 50);

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

draw.drawRect();

//     //Calculate x, y
    
//     var x = evt.clientX - rect.left;
//     var y = evt.clientY - rect.top;

//     //Write the coords back to the UI
//     document.getElementById('trackX').innerHTML = 'X: ' + x;
//     document.getElementById('trackY').innerHTML = 'Y: ' + y;
// });
