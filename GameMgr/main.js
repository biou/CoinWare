function GameStatus() {
    this.gamesLoaded = 0;
    this.gameIndex = -1;
    this.games = [];
    this.gamesManifests = [];
    this.level = 1;
    this.lifes = startLifes;
    this.score = 0;
    this.shuffle = [];
    console.log('lifes:'+this.lifes);
}

gameStatus = null;


function nextGame() {
    gameStatus.gameIndex++;
    var g = gameStatus.games[gameStatus.shuffle[gameStatus.gameIndex]];
    $('#iframeContainer_'+g.id+' .lifes').empty();
    $('#iframeContainer_'+g.id+' .lifes').append(displayHearts(gameStatus.lifes));
    showScreen('iframeContainer_'+g.id);
    g.start(gameStatus.level);
}



function gameTransition(wonGame, score) {
    incrementScore(score);
    if (!wonGame) {
        gameStatus.lifes--;
        if (gameStatus.lifes == 0) {
            showScreen('youlose');
            return;
        }
    }
    if (gameStatus.gameIndex != (gameStatus.games.length-1)) {
        showScreen('transition');
        setTimeout(function() {
            nextGame();
        }, 500);
    } else {
        if (gameStatus.level != maxLevels) {
            incrementLevel();
            gameStatus.gameIndex = -1;
            gameStatus.shuffle.shuffle();
            console.log(gameStatus.shuffle.toString());
            showScreen('levelup');
            setTimeout(function() {
                nextGame();
            }, 1500);            
        } else {
            showScreen('youwin');             
        }        
    }
}



function loadGames() {
    $('.iframe_container').remove();
    gameStatus = new GameStatus();

    for (i=0; i<gamesId.length; i++) {
        gameStatus.shuffle[i] = i;
    }
    gameStatus.shuffle.shuffle();
    console.log(gameStatus.shuffle.toString());    

	// loading game manifests

	for (i = 0; i< gamesId.length; i++) {
		$.getJSON(gamesId[i]+'/manifest.json')
			.done(function(data) {
				gameStatus.gamesManifests.push(data);
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
        gameStatus.games.push(g);

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
        iframe.width = 800;
        iframe.height = 480;
        iframe.setAttribute('scrolling', 'no');
        iframe.src = id + '/index.html';
        
        $(iframeContainer).append('<div class="hud">Lifes: <span class="lifes"></span> Level: <span class="level">1</span> Score: <span class="score">0</span></div>');
        iframeContainer.appendChild(iframe);

        $('#screens').append(iframeContainer);
         // widget object injection management
         // it seems like there  is no reliable way to know when an iframe is completely loaded
         // Warning gruik hack: I used setTimeout...
        injectGameIntoIframe(iframe, g);

    }
};

function injectGameIntoIframe(iframe, game) {
        setTimeout(function() {
            try
            { 
                var doc = iframe.contentWindow || iframe.contentDocument;
                // FIXME: perhaps check here if the dom is ready ?
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

function loading() {
    gameStatus.gamesLoaded++;
    $('#gameCounter').empty();
    $('#gameCounter').append(''+gameStatus.gamesLoaded+'/'+gamesId.length);
    if (gameStatus.gamesLoaded == gamesId.length) {
        nextGame(); 
    }
}

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

function displayHearts(n) {
    console.log('hearts '+n);
    var str = "";
    for (i=0; i<n; i++) {
        str+= '&hearts; ';
    }
    return str;
}

function incrementScore(score) {
    gameStatus.score += score;
    $('span.score').empty();
    $('span.score').append(gameStatus.score);    
}

function incrementLevel() {
    gameStatus.level += 1;
    $('.level').empty();
    $('.level').append(gameStatus.level);    
}