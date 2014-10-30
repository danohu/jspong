$(document).ready(function(){
    console.log('hello world');
    game = new Game(true);
    game.setup();
    game.run();
})

var GameObject = Class.extend({
    posx: null,
    posy: null,
    draw: function(){}
});

var Paddle = GameObject.extend({
    height: 5,
    move: function(diffy){},
    });

var Ball = GameObject.extend({});

var Game = Class.extend({
    active: true, // is game in progress?
    setup: function(){
	this.board = $('#board_outer');
	this.board.append($('<canvas>', {
	    'id': 'board_inner',
	    'height': "500",
	    'width': "700",})
	);
      console.log(this.board.html());},
    run: function(){
	while(this.active){
	    this.active = false;
	    console.log('gameloop');
	    }
	console.log('game over');
	},
});
