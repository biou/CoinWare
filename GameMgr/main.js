if (!window.console) console = {log: function() {}};

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
leaderboard = [];


function nextGame() {
    gameStatus.gameIndex++;
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
                var str = "";
                str += '<div class="creditElem"><a href="?'+data.id+'"><img class="thumb" width="200" src="'+data.id+'/thumbnail.jpg" alt="'+data.name+'" /></a><p><b>'+data.name+'</b>';
                if (data.teamName) {
                    str += ' by '+data.teamName;
                }
                str += '<br />';
                if (data.description) {
                    str += data.description+'<br />';
                } 
                str += '</p><ul>';
                
                for (i=0; i<data.credits.length; i++) {
                    var e = data.credits[i];
                    str += '<li>'+e.job+': <a href="'+e.url+'">'+e.name+'</a></li>';
                }
                str += '</ul><div class="clear"></div></div>';
                $('#creditsList').append(str);
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ', ' + error;
                console.log( "Request Failed: " + err);
            });
    }      
}


function loadGames(forceGame) {
    $('#gameCounter').attr('value', 0);
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

        var g = new CWGame(id);
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
                    doc.gameLoad(game);                                    
                } else {
                    injectGameIntoIframe(iframe, game);
                }
            }
            catch (e)
            {
                console.log('['+game.id+ '] Error initializing game !');
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
    $('.inputScore').show();
    $('.highscoresList').hide();
    $('.iframe_container').remove();
}

function addToLeaderboard(winner) {
    var nameSuffix = "";
    if (winner) {
        nameSuffix = "Winner";
    } else {
        nameSuffix = "Loser";
    }
    var formId = "#inputScore"+nameSuffix;
    var inputId = "#"+nameSuffix;
    var playerName = $(inputId).val().trim();
    var playerScore = $('span.score').text();
    if (playerName != "") {
        var score = { score: playerScore, name: playerName}; 
        leaderboard.push(score);
        leaderboard.sort(function(a,b) { return (b.score - a.score);});
        updateLeaderboard();
        $(formId).hide();
        $(inputId).val("");
        $('.highscoresList').show();
    }
    return false;
}

function updateLeaderboard() {
    $('.highscoresList').empty();
    for (var i=0; i<Math.min(leaderboard.length,10); i++) {
        var it = leaderboard[i];
        console.log(i);
        console.log(leaderboard[i]);
        console.log(leaderboard[i].name);  
        $('.highscoresList').append('<li>'+it.name+': '+it.score+'</li>');
    }
}