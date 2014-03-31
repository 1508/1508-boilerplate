requirejs([
		'jquery',
        'analytics'
		],
	function($) {

		var onReady, onLoad, onResize, afterResize, timer;

		/* Hookups
		----------------------------*/
		onReady = function() {




		};

		onLoad = function() {
		};

		onResize = function(){
		}

		afterResize = function(){
		}


		  /* Attach events
        ----------------------------*/
        $(onReady);//Document ready
        $(window).load(onLoad); //Window load
        $(window).resize(function(e){
        	onResize();
        	clearTimeout(timer);
        	timer = setTimeout(afterResize, 50);

        });

	}
);