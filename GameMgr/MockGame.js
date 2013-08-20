if (window==window.top) { 
	// we are not in a frame so we can load the simulator

	var g = new Game('mock');
	function mockLoading() {
		g.start({difficulty: 1});
	}

	function mockGameTransition(wonGame, score) {
		var res = wonGame?"won":"lost";
		console.log('end game: won='+res+' score='+score);
		var result = document.getElementById('result');
		result.innerHTML = res;
	}

	g.onReady(mockLoading);
	g.onEnd(mockGameTransition);

	document.addEventListener('DOMContentLoaded',function(){
		gameLoad(g); 
		var div = document.createElement('div');
		div.id = "result";
		div.style = "display: none";
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(div);	
	});

}