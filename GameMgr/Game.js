function Game(id) {
	this.id = id;
	this.startCB = null;
	this.readyCB = null;
	this.endCB = null;
};

// methods to use in your game

// Game.onStart(function(difficulty) {}): pass a callback function with one parameter, the difficulty. 
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
    console.log('end called');
    this.endCB(wonGame, score);  
}

Game.prototype.ready = function()
{
	this.readyCB();
}

Game.prototype.onReady = function(callback)
{
	this.readyCB = callback;
}

Game.prototype.start = function(difficulty)
{
	this.startCB(difficulty);
}

Game.prototype.onEnd = function(callback)
{
	this.endCB = callback;
}



