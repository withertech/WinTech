/* 
	tapHold mini library

****** Usage *****

	taphold({
	    time: 400,
	    element: document.getElementById('start'),
	    action: function(element){
	    	alert('you held on this element for 400ms ' + element);
	    }
	});

	https://junesiphone.com
*/

(function(){
	var taphold = function (t) {
        	var tapTimer = null;
        	if(!t){console.log("This method takes an object"); return;}
        	t.element.addEventListener('touchstart', function(e){
        		tapTimer = setTimeout(function(){
        			if(t.passTarget){
        				t.action(e.target);
        			}else{
        				t.action();
        			}
        		}, t.time);
        	});
        	t.element.addEventListener('touchend', function(){
        		clearTimeout(tapTimer);
        	});
        	t.element.addEventListener('touchcancel', function(){
        		clearTimeout(tapTimer);
        	});
        };
    window.taphold = taphold;
}());

