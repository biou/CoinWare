function GameStatus() {
    this.gamesLoaded = 0;
    this.gameIndex = -1;
    this.games = [];
    this.level = 1;
    this.lifes = startLifes;
    this.score = 0;
    this.shuffle = [];
    this.forceGame = false;
}

gameStatus = null;


function nextGame() {
    gameStatus.gameIndex++;
	console.log(gameStatus.shuffle);
	console.log(gameStatus.gameIndex);
    var g = gameStatus.games[gameStatus.shuffle[gameStatus.gameIndex]];
    $('.lifes').empty();
    $('.lifes').append(displayHearts(gameStatus.lifes));
    $('#hud').show();
    $('#gameName').empty().append(g.id);
    showScreen('iframeContainer_'+g.id);
    g.start({difficulty: gameStatus.level});
}



function gameTransition(wonGame, score) {
    incrementScore(score);
    if (!wonGame) {
        gameStatus.lifes--;
        if (gameStatus.lifes == 0) {
            $('.lifes').empty();
            $('#result').empty().append('lost');
            showScreen('youlose');
            resetGames();            
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
            showScreen('levelup');
            setTimeout(function() {
                nextGame();
            }, 1500);            
        } else {
	    $('#result').empty().append('won');		
            showScreen('youwin'); 
            resetGames();            
        }        
    }
}

function renderCredits() {
    // loading game manifests

    $('#creditsList').empty();
    for (i = 0; i< gamesId.length; i++) {
        $.getJSON(gamesId[i]+'/manifest.json')
            .done(function(data) {
                $('#creditsList').append('<div class="creditElem"><img width="200" src="'+data.id+'/thumbnail.jpg" alt="'+data.name+'" /><p><b>'+data.name+'</b> by '+data.teamName+'<br />'+ data.description+'<br /></p><ul>');
                for (i=0; i<data.credits.length; i++) {
                    var e = data.credits[i];
                    $('#creditsList').append('<li>'+e.job+': <a href="'+e.url+'">'+e.name+'</a></li>');
                }
                $('#creditsList').append('</ul></div>');
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ', ' + error;
                console.log( "Request Failed: " + err);
            });
    }      
}


function loadGames(forceGame) {
    gameStatus = new GameStatus();	
	if (forceGame !== undefined) {
		gamesId = [forceGame];
		maxLevels = 1;
		startLifes = 1;
		gameStatus.lifes = 1;
		gameStatus.forceGame = true;
	}

    for (i=0; i<gamesId.length; i++) {
        gameStatus.shuffle[i] = i;
    }
    gameStatus.shuffle.shuffle();   

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
                if (doc.gameLoad && iframe.contentDocument.readyState == 'complete') {
                    iframe.opener = iframe;                
                    doc.parent = null;
                    //doc.Game = game; 
                    doc.gameLoad(game); 
                    //game.ready();                                     
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
    $('#gameCounter').attr('value', gameStatus.gamesLoaded/gamesId.length*100);
    if (gameStatus.gamesLoaded == gamesId.length) {
            $('#hud').show();
	    if (gameStatus.forceGame) {
			nextGame();
	    } else {
		    showScreen('levelup');
		    setTimeout(function() {
			nextGame();
		    }, 1500);
	    }
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
    var str = "";
    for (i=0; i<n; i++) {
        str+= '&hearts; ';
    }
    return str;
}

function incrementScore(score) {
    gameStatus.score += score;
    $('span.score').empty().append(gameStatus.score);   
}

function incrementLevel() {
    gameStatus.level += 1;
    $('.level').empty().append(gameStatus.level);    
}

function resetGames() {
    $('.iframe_container').remove();
}