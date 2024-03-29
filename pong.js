

mainloop = function(){
   game.mainloop();
        };


$(document).ready(function(){
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
    automove_speed: 0, // 0 implies don't automate

    init: function(game, posx, size){
	this.size = size;
	this.posx = posx;
	this.game = game;
	this.posy = Math.floor(this.game.boardheight / 2);
	},
    top: function(){ return this.posy - (this.size / 2)},
    bottom: function(){ return this.posy + (this.size / 2)},
    draw: function(){
	context = this.game.context;
	context.beginPath();
	context.moveTo(this.posx, this.top());
	context.lineTo(this.posx, this.bottom());
	context.stroke();
        },
    update: function(){
	this.automove();
	},
    automove: function(){
	if(this.automove_speed == 0) return;
	if(this.posy > this.game.ball.posy) this.move(0 - this.automove_speed);
	else if(this.posy < this.game.ball.posy) this.move(this.automove_speed);
	},

    move: function(diffy){
	this.posy += diffy;
	if (this.bottom() >= this.game.boardheight) this.posy = this.game.boardheight - this.size;
	if (this.posy < 0) this.posy = 0;
        },
    });

var Ball = GameObject.extend({
    posx: 350,
    posy: 250,
    velocity_x: 6,
    velocity_y: 2,
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
    bouncePaddle: function(paddle){
	// check vertical
	var tolerance = 10;
	if(this.posy < paddle.bottom() && this.posy > paddle.top()){
	    if(this.velocity_x > 0){ // moving right
		if ((paddle.posx >= this.posx) && (paddle.posx - this.posx < tolerance)){
		    this.velocity_x = -this.velocity_x
		}
	    }
	    else { // moving left
		if ((paddle.posx <= this.posx) && (this.posx - paddle.posx < tolerance)){
		    this.velocity_x = -this.velocity_x
		}

		}
	}
    },
    

    update: function(){
	this.posx += this.velocity_x;
	this.posy += this.velocity_y;
	// XXX : here goes bounce-handling codeq
	//var xmin, var xmax, var ymin, var ymax = this.bounds();
	var xmin = this.posx - this.radius;
	var xmax = this.posx + this.radius;
	var ymin = this.posy - this.radius;
	var ymax = this.posy + this.radius;
	this.bouncey(ymin, ymax);
	this.bouncePaddle(this.game.rightPaddle);
	this.bouncePaddle(this.game.leftPaddle);
	},
    draw: function(){
	this.game.context.beginPath();
	this.game.context.arc(this.posx, this.posy, this.radius, 0, 2*Math.PI, false);
	this.game.context.lineWidth=0;
	this.game.context.strokeStyle = 'green';
	this.game.context.stroke();
	this.game.context.fill();
	},
    out_of_bounds: function(){
	if(this.posx < 0 || this.posx > this.game.boardwidth) return true;
	return false;
	},
});

var Game = Class.extend({
    active: true, // is game in progress?
    setup: function(){
	this.boardheight = 500;
	this.boardwidth = 700; // XXX; DRYify these
	this.movespeed = 5; // how fast the paddle moves
	this.board = $('#board_outer');
	this.canvas = $('<canvas>', {
	    'id': 'board_inner'});
	this.canvas.attr('width', this.boardwidth);
        this.canvas.attr('height', this.boardheight);
	this.board.append(this.canvas);
	this.context = $('#board_inner')[0].getContext("2d");
	this.leftPaddle = new Paddle(this, 40, 100);
	this.leftPaddle.automove_speed = 4;
	this.rightPaddle = new Paddle(this, 660, 160);
	this.ball = new Ball(this);
	this.gameObjects = [this.ball, this.leftPaddle, this.rightPaddle];
	this.refreshRate = 1000 / 30;
	var that = this;
	$('html').keydown(function(e){
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
	    if(this.ball.out_of_bounds()) this.stoprunning();
    },
    run: function(){
	this._loopid = setInterval(mainloop, this.refreshRate);
	
	},
    stoprunning: function(){
	clearInterval(this._loopid);
	console.log('Game Over')
	}
});


