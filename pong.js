$(document).ready(function(){
    console.log('hello world');
    game = new Game(true);
    game.setup();
    game.run();
})

var GameObject = Class.extend({
    posx: null,
    posy: null,
    draw: function(){console.log('drawing');},
    init: function(game){
	this.game = game},
});

var Paddle = GameObject.extend({
    height: 5,
    move: function(diffy){},
    });

var Ball = GameObject.extend({
    posx: 50,
    posy: 50,
    radius: 5,
    
    draw: function(){
	console.log(this.posx, this.posy, this.radius);
	this.game.context.beginPath();
	this.game.context.arc(this.posx, this.posy, this.radius, 0, 2*Math.PI, false);
	this.game.context.lineWidth=0;
	this.game.context.strokeStyle = 'green';
	this.game.context.stroke();
	this.game.context.fill();
	console.log('ball goes here');
	}
});

var Game = Class.extend({
    active: true, // is game in progress?
    setup: function(){
	this.board = $('#board_outer');
	this.canvas = $('<canvas>', {
	    'id': 'board_inner',
	    'height': "500",
	    'width': "700",});
	this.board.append(this.canvas);
	this.context = $('#board_inner')[0].getContext("2d");
	this.leftPaddle = new Paddle(this);
	this.rightPaddle = new Paddle(this);
	this.ball = new Ball(this);
	this.gameObjects = [this.ball, this.leftPaddle, this.rightPaddle];
      console.log(this.board.html());},
    draw: function(){
	this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
	for(item in this.gameObjects){
	    this.gameObjects[item].draw();
	    }
	},
    run: function(){
	while(this.active){
	    this.active = false;
	    this.draw();
	    console.log('gameloop');
	    }
	console.log('game over');
	},
});
