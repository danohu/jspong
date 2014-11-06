

// XXX there is NO WAY this needs to be here, but I am shit at JS
mainloop = function(){
   game.mainloop();
        };


$(document).ready(function(){
    console.log('hello world');
    game = new Game(true);
    game.setup();
    game.run();



})

var GameObject = Class.extend({
    posx: null,
    posy: null,
    update: function(){console.log('updating');},
    draw: function(){console.log('drawing');},
    init: function(game){
	this.game = game},
});

var Paddle = GameObject.extend({
    height: 5,
    move: function(diffy){},
    });

var Ball = GameObject.extend({
    posx: 350,
    posy: 250,
    velocity_x: 2,
    velocity_y: 1,
    radius: 5,
    
    update: function(){
	this.posx += this.velocity_x;
	this.posy += this.velocity_y;
	// XXX: here goes bounce-handling code
	},
    draw: function(){
	console.log(this.posx, this.posy, this.radius);
	this.game.context.beginPath();
	this.game.context.arc(this.posx, this.posy, this.radius, 0, 2*Math.PI, false);
	this.game.context.lineWidth=0;
	this.game.context.strokeStyle = 'green';
	this.game.context.stroke();
	this.game.context.fill();
	}
});

var Game = Class.extend({
    active: true, // is game in progress?
    setup: function(){
	this.board = $('#board_outer');
	this.canvas = $('<canvas>', {
	    'id': 'board_inner'});
	// XXX not sure why specifying these on creation turns them into just style attributes
	this.canvas.attr('width', '700');
	this.canvas.attr('height', '500');
	this.board.append(this.canvas);
	this.context = $('#board_inner')[0].getContext("2d");
	this.leftPaddle = new Paddle(this);
	this.rightPaddle = new Paddle(this);
	this.ball = new Ball(this);
	this.gameObjects = [this.ball, this.leftPaddle, this.rightPaddle];
	this.refreshRate = 1000 / 60;
      console.log(this.board.html());},
    draw: function(){
	this.context.clearRect(0,0,this.canvas.width(), this.canvas.height());
	for(item in this.gameObjects){
	    this.gameObjects[item].draw();
	    }
	},
    update: function(){
	for(item in this.gameObjects){
	    this.gameObjects[item].update();
	    }
	},

    mainloop: function(){
	    game = this; //XXX debug
	    game.active = false;
	    game.update();
	    game.draw();	    
	    // just for testing
	    /*game._numloops = game._numloops || 0
	    game._numloops += 1;
	    console.log('gameloop' + game._numloops);
	    if(game._numloops > 10) game.stoprunning();*/
    },
    run: function(){
	var foo = function(){console.log('fauxloop');}
	this._loopid = setInterval(mainloop, this.refreshRate);
	
	},
    stoprunning: function(){
	clearInterval(this._loopid);
	}
});


