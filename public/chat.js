
App = {

    initCanvas : function(){

        var canvas = document.getElementById('canvas');
        // Set canvas to screen size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Add mouse move event listener to the canvas
        canvas.addEventListener( 'mousemove', App.mouseListener );

        // User's pointer circle object
        Pointer = canvas.getContext("2d");
        Pointer.fillStyle = App.randomRGB();

        // Object to container all foreign cursors
        App.cursors = {};

    },

    drawCursor : function(params){
        console.log(params);
        
        App.cursors[params.colour].clearRect(0,0,canvas.width,canvas.height);
        cursor = canvas.getContext("2d");
        cursor.fillStyle = "rgb(200,0,0)";
        cursor.beginPath();
        cursor.arc( params.clientX , params.clientY , 10, 0 , Math.PI*2 ,true );
        cursor.fill();

        App.cursors[params.colour]

    },

    Connection : {

        events : function(){

            App.socket.on('userID', function(data){
                App.ID = data.ID;
                App.colour = App.randomColour();
            });

            App.socket.on('moveCursor', function(data){
                App.drawCursor(data);
            });

        },

        init : function(){
            App.socket = io.connect('http://'+location.hostname+':3700');
            App.Connection.events();
        }

    },

    randomRGB : function() {
        
        function randomColor(num) {          
            return Math.floor(Math.random() * num);
        };  

        var col =  "rgb("
            + randomColor(255) + ","
            + randomColor(255) + ","
            + randomColor(255) + ")";
        
        return col;
    },



    reposition : function(x, y){

        App.socket.emit('reposition', {
            'colour' : App.colour,
            'clientX' : x,
            'clientY' : y
        });

    },

    mouseListener : function(e){

        // Draw a circle at the Pointer's location
        Pointer.clearRect(0,0,canvas.width,canvas.height);
        Pointer.beginPath();
        Pointer.arc(e.clientX,e.clientY,10,0,Math.PI*2,true);
        Pointer.fill();

        // Send new position to server
        App.reposition(e.clientX, e.clientY)

    },

    init : function(){

        App.initCanvas();
        App.Connection.init()

    }

}

window.onload = function() {
    App.init();
}