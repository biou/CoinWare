function showScreen(id) {
	$('#screens>div').hide();
	$('#'+id).show();
}


$(document).ready(function() {
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
		showScreen('credits');
        return false;
    });           

});