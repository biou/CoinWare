function Game(id) {
	this.id = id;
	this.startCB = null;
	this.readyCB = null;
	this.endCB = null;
	this.readyStatus = false;
};

// methods to use in your game

// Game.ready(): call this when you finished loading your game
Game.prototype.ready = function()
{
	this.readyStatus = true;
	this.readyCB();
	console.log('game '+this.id+' is ready!!');
}

// Game.onStart(function(difficulty) {}): pass a callback function with one parameter, the difficulty. 
// This callback function will be called when your game must start
Game.prototype.onStart = function(callback)
{
	this.startCB = callback;
}

// Game.end(wonGame, score): call this when the game is over. lostGame (boolean), score (integer)
Game.prototype.end = function(lostGame, score)
{
    console.log('end:'+ lostGame + ' '+ score);
    this.endCB(lostGame, score);  
}


// all the code after this line should not be used directly in your game!
/////////////////////////////////////////////////////////////////////////

Game.prototype.onReady = function(callback)
{
	this.readyCB = callback;
}

Game.prototype.start = function(difficulty)
{
	console.log('start game '+this.id+' difficulty '+ difficulty);
	this.startCB(difficulty);
}

Game.prototype.onEnd = function(callback)
{
	this.endCB = callback;
}



