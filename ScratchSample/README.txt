 ScratchSample
 =============

 Warning: this component is highly experimental!

 Install
 -------


First of all, you have to install node.js (see nodejs.org)
Then in the ScratchSample folder, type the following command in a terminal window: 

	npm install

This will install all the dependencies for the server component.

On the scratch part, log in to scratch as usual. When in your project, shift-click on the File menu and select "Import Experimental Extension". You can now select the extension.json file. This will add new blocks in the "Add blocks" section.
You can import the sample project named *CoinWareSample.sb2*.

Configuration
-------------

Click "Share to" on the grey bar below the project. Copy the embed code from the text box that opens up and paste it in the index.html file, in the #scratch_container div.



Usage
-----

Several blocks are available : 

* Game Ready: call it when your game starts
* start: a boolean, you should wait for start being true.
* difficulty: an integer containing the difficulty level
* Game End: ends the game with two parameters, haswon ("true" or "false") and score, an integer.

You should start the server as an administrator. On UNIX-like systems:

	sudo node extension.js