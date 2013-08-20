CoinWare
========

A mini-game framework aiming at game jams.


The main idea behind this framework is to be able to aggregate mini-games, like in WarioWare. Each mini-game can be developed independently, and then integrated into the game through this framework and a simple API. We only deal with Web-based games here, but you should be able to use plugin-based Web technologies like flash or Unity3D as well.

The framework handles the global state of the game, with lifes, level and the score.

The current stylesheet of the framework is quite ugly, it is up to you to customise it to your needs ;)

How to use?
-----------

Your mini-game must be in a folder with the following structure:

* *YourMiniGame* folder
	* index.html: the main page that will be loaded by the framework
	* manifest.json: a manifest describing your game (more on that later)
	* thumbnail.jpg: (optional) a thumbnail of your game, 800x480

There is no other restriction in the content of the folder. When it's done, you can put this folder in the CoinWare folder and modify the config.js file to include your mini-game name in the *gamesId* array.

Screen Size
-----------
To simplify the development of your mini-game during a game jam, we assume that it will have a fixed size of 800x480.


manifest.json
-------------
The manifest.json file should have the following structure:

	{
	    "id": "YourMiniGame",
	    "name": "My Mini-Game",
	    "description": "My elevator pitch goes here",
	    "teamName": "MyTeam",
	    "credits": [{
	        "name": "Bob",
	        "job": "Graphism",
	        "url": "http://your-homepage-here.org"
	    }, {
	        "name": "Jack",
	        "job": "Music",
	        "url": "http://your-homepage-here.org"
	    }
	    }, {
	        "name": "Paul",
	        "job": "Code",
	        "url": "http://your-homepage-here.org"
	    }
	    ]
	}

* id: it should correspond to the folder name
* name: it is obviously the name of your mini-game
* description: describe in a few words what it is, what it does
* teamName: the name of your team if you have one
* credits: an array in which you can put an object describing each member of the team.

This information is only useful for the generation of the Credits screen in the game.


Game API
--------

Then, you have to integrate your mini-game with the Game API provided by the framework. Basically it provides a mean to load, start and stop your mini-game, but also to know the difficulty level and to report the score.

This API is really simple:
* the *gameLoad* function: when the framework loads your game it will search for a function named gameLoad and then execute it. Think of it as a DOM ready function but for mini-games. When you are in this function, the Game object is available as a parameter.
* the Game object: 
	* *Game.ready()*: call this when your game finished loading all the assets and is ready to run.
	* *Game.onStart(function(params) {  })*: pass a callback function with one parameter, an object with parameters. This callback function will be called by the framework when your mini-game should start (in fact your mini-game will be loaded by the framework but it should do nothing at first. Your callback function will start the game). *params.difficulty* is the difficulty level of the game.
	* *Game.end(wonGame, score)*: you must call this when the mini-game is over. It has two parameters: wonGame (boolean), score (integer)
	
You can find in the *Game1* folder a very simple game example.

Test your mini-game
--------------------

When coding your game, you can easily test it by appending a parameter to the end of the url with the name of your game, e.g. *index.html?Game1* will call only Game1.
Please note that your game should be mentioned in config.js.


Is my technology supported?
---------------------------
CoinWare currently supports the integration with the following technologies:
* Unity: see GameUnitySample folder
* CraftStudio: see [this article on the CraftStudio blog](http://sparklinlabs.com/2013/08/monkeypatching-the-craftstudio-web-player/)


Credits
=======

* Alain Vagner: code
* Vincent Lark: architecture & code review
* Aymeric Girault: Unity sample
* Thomas Altenburger: html5 sample