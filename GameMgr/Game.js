function Game(id) {
	this.id = id;
	this.startCB = null;
	this.readyCB = null;
	this.endCB = null;
	this.status = "stopped";
};

// methods to use in your game

// Game.onStart(function(params) {}): pass a callback function with one parameter, the difficulty. 
// This callback function will be called when your game must start
Game.prototype.onStart = function(callback)
{
	this.startCB = callback;
}

// Game.end(wonGame, score): call this when the game is over. wonGame (boolean), score (integer)
Game.prototype.end = function(wonGame, score)
{
    if ((typeof wonGame)!='boolean' && (typeof score) !='integer') {
    	throw "Game.end: invalid data";
    }
    if (this.status != "stopped") {
	this.status = "stopped";
	console.log('end called');
	this.endCB(wonGame, score); 
    }	else {
	console.log('game  '+this.id+' already stopped');
    }
}

Game.prototype.ready = function()
{
	if (this.status != "ready") {
		this.status = "ready";
		this.readyCB();
	} else {
		console.log('game  '+this.id+' already ready');		
	}
}

Game.prototype.onReady = function(callback)
{
	this.readyCB = callback;
}

Game.prototype.start = function(params)
{
	if (this.status != "running") {
		this.status = "running";
		if (this.startCB != null) {
			this.startCB(params);
		} else {
			console.log('Game.onStart is not set!');
		}
	} else {
		console.log('game '+this.id+' already started');
	}
}

Game.prototype.onEnd = function(callback)
{
	this.endCB = callback;
}



