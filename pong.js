

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
    update: function(){},
    draw: function(){},
    init: function(game){
	this.game = game},
});

var Paddle = GameObject.extend({
    height: 5,
    init: function(game, xpos, size){
	this.size = size;
	this.xpos = xpos;
	this.game = game;
	this.ypos = Math.floor(this.game.boardheight / 2);
	},
    draw: function(){
	context = this.game.context;
	context.beginPath();
	var top = this.ypos - (this.size / 2);
	var bottom = this.ypos + (this.size / 2);
	context.moveTo(this.xpos, top);
	context.lineTo(this.xpos, bottom);
	context.stroke();
        },
    move: function(diffy){
	// 'depth' seems clearer than height, considering the direction of the coords
	// XXX: I'm letting paddles go slightly offscreen here
	this.ypos += diffy;
	if (this.ypos > this.game.boardheight) this.ypos = this.game.boardheight;
	if (this.ypos < 0) this.ypos = 0;
        },
    });

var Ball = GameObject.extend({
    posx: 350,
    posy: 250,
    velocity_x: 0,
    velocity_y: 4,
    radius: 5,

    bounds: function(){
       var xmin = this.posx - this.radius;
       var xmax = this.posx + this.radius;
       var ymin = this.posy - this.radius;
       var ymax = this.posy + this.radius;
       return (xmin, xmax, ymin, ymax);
        },

    bouncey: function(ymin, ymax){
       var bh = 400;
       if(ymin <= 0){
           this.posy = (0 - ymin) + this.radius;
	   this.velocity_y = 0 - this.velocity_y;
        }
       if(ymax >= bh){
           this.posy = (this.game.boardheight - (ymin - this.game.boardheight)) - this.radius;
	   this.velocity_y = 0 - this.velocity_y;
         }
        },

    update: function(){
	this.posx += this.velocity_x;
	this.posy += this.velocity_y;
	// XXX: here goes bounce-handling codeq
	//var xmin, var xmax, var ymin, var ymax = this.bounds();
	var xmin = this.posx - this.radius;
	var xmax = this.posx + this.radius;
	var ymin = this.posy - this.radius;
	var ymax = this.posy + this.radius;
	this.bouncey(ymin, ymax);
	},
    draw: function(){
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
	this.boardheight = 500;
	this.boardwidth = 700; // XXX; DRYify these
	this.movespeed = 3; // how fast the paddle moves
	this.board = $('#board_outer');
	this.canvas = $('<canvas>', {
	    'id': 'board_inner'});
	// XXX not sure why specifying these on creation turns them into just style attributes
	this.canvas.attr('width', '700');
	this.canvas.attr('height', '500');
	this.board.append(this.canvas);
	this.context = $('#board_inner')[0].getContext("2d");
	this.leftPaddle = new Paddle(this, 40, 35);
	this.rightPaddle = new Paddle(this, 660, 35);
	this.ball = new Ball(this);
	this.gameObjects = [this.ball, this.leftPaddle, this.rightPaddle];
	this.refreshRate = 1000 / 30;
	var that = this;
	$('html').keydown(function(e){
	    console.log(e.which);
	    if(e.which == 38) that.rightPaddle.move(-that.movespeed); // up
	    if(e.which == 40) that.rightPaddle.move(+that.movespeed); //down
	    });
	},
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
	this._loopid = setInterval(mainloop, this.refreshRate);
	
	},
    stoprunning: function(){
	clearInterval(this._loopid);
	}
});


