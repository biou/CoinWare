function showScreen(id) {
	$('#screens>div').hide();
	$('#'+id).show();
}


$(document).ready(function() {
	if (window.location.search != "") {
		var str = window.location.search.substr(1);
		var found = false;
		for (i = 0; i< gamesId.length; i++) {
			if (gamesId[i] == str) {
				found = true;
			}
		}
		if (found) {
			$('.backHome').remove();
			showScreen('loading');
			loadGames(str);
		} else {
			console.log('Game not found: '+str);
		}
	}
	
	$('#gameTitle').append(gameName);
	showScreen('welcome');

	$('#lstart').click(function() {
		showScreen('loading');
		loadGames();
        return false;
    });

	$('.backHome').click(function() {
		$('#hud').hide();
		showScreen('welcome');
        return false;
    }); 
	$('#lleaderboard').click(function() {
		showScreen('leaderboard');
        return false;
    });
	$('#lcredits').click(function() {
		renderCredits();
		showScreen('credits');
        return false;
    });           

});