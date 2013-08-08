gamesLoaded = 0;
gameIndex = -1;
games = [];

function loading() {
    gamesLoaded++;
    $('#gameCounter').empty();
    $('#gameCounter').append(''+gamesLoaded+'/'+gamesId.length);
    if (gamesLoaded == gamesId.length) {
        nextGame(); 
    }
}

function injectGameIntoIframe(iframe, game) {
        setTimeout(function() {
            try
            { 
                var doc = iframe.contentWindow || iframe.contentDocument;
                // FIXME: pê checker ici en plus si le dom est ready...
                if (doc.gameReady) {
                    iframe.opener = iframe;                
                    doc.parent = null;
                    doc.Game = game; 
                    doc.gameReady(); 
                    game.ready();                                     
                } else {
                    injectGameIntoIframe(iframe, game);
                }
            }
            catch (e)
            {
                console.log('Unable to access iframe DOM.' + iframe.id);
                console.log(e.toString());
                injectGameIntoIframe(iframe, game);
            } 
        }, 500); 
}

function nextGame() {
    gameIndex++;
    var g = games[gameIndex];
    showScreen('iframeContainer_'+g.id);
    g.start(1);
}

function gameTransition() {
    if (gameIndex != (games.length-1)) {
    showScreen('transition');
    setTimeout(function() {
        nextGame();
    }, 1000);
    } else {
        // gérer cas gagné / perdu
        showScreen('youwin');         
    }
}

gamesManifests = [];

function loadGames() {

	// loading game manifests

	for (i = 0; i< gamesId.length; i++) {
		$.getJSON(gamesId[i]+'/manifest.json')
			.done(function(data) {
				gamesManifests.push(data);
			})
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ', ' + error;
				console.log( "Request Failed: " + err);
			});
	}

	// iframes creation
	for (i = 0; i< gamesId.length; i++) {
		var id = gamesId[i];

        var g = new Game(id);
        g.onReady(loading);
        g.onEnd(gameTransition);
        games.push(g);

        // iframe container
        var iframeContainer = document.createElement('div');
        iframeContainer.id = 'iframeContainer_'+id;
        iframeContainer.className = 'iframe_container';
        iframeContainer.game = g;

        // iframe document
        var iframe = document.createElement('iframe');
        iframe.id = 'iframe_'+id;
        iframe.name = 'iframe_'+id;
        iframe.frameBorder = 0;
        iframe.setAttribute('scrolling', 'no');
        iframe.src = id + '/index.html';
        iframeContainer.appendChild(iframe);
        $('#screens').append(iframeContainer);
         // widget object injection management
         // it seems like there  is no reliable way to know when an iframe is completely loaded
         //Warning gruik hack: I used setTimeout...
        injectGameIntoIframe(iframe, g);

    }
};

