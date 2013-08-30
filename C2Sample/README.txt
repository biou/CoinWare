Construct2 Sample
==============

Installation
----------

Copy the coinware plugin from plugin/coinware to the following folder on your harddrive:
C:\Program Files\Construct 2\exporters\html5\plugins

Restart Construct2.

Use
----

Construct2 does not support external preloading, so in your manifest file, you should mention  preload: "false".

You can find a sample project in the "Sample Project" folder.

You can use in your event sheet the following items:

* conditions:
	* CoinWare | isStarted: when this is triggered, you should start the game

* actions: 
	* CoinWare | ready : notify the framework that the game is ready (launch with System | time = 1s)
	* CoinWare | end : notify the framework that the game is over (2 string parameters : hasWon == "true" || "false", score)

* expressions:
	* CoinWare.difficulty: the difficulty level