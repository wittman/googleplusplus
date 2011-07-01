// ==UserScript==
// @name           googleplusplus
// @author		   Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus
// @include        *plus.google.com*
// @description	   Changes appearance of Google Plus by hiding left and right side bars and widening main content containers.
// @version		   0.1
// ==/UserScript==

// Function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

//Main function
function googlePlusPlus(){
	function toInt(n){ return Math.round(Number(n)); };
	var cpane = $('#contentPane');
	var wfactor = 0.8;
	var wfactorPost = 0.83;
	if (cpane.length > 0) {
		cpane.width(800);
		var leftbar = cpane.prev();
		var rightbar = cpane.next();
		
		leftbar.hide();
		rightbar.hide();
		
		var cpaneKid = cpane.children(':first');
		var cpaneKidKids = cpaneKid.children();
		var newPeople = cpaneKid.children().eq(2);
		var posts = $('.a-b-f-i');
		var topbar = $('#gbx4');
		
		var postWidth = toInt(topbar.width() * wfactorPost);
		if(postWidth > 1306){
			postWidth = 1306;
		}
		var newPeopleWidth = toInt(topbar.width() * wfactor);
		if(newPeopleWidth > 1265){
			newPeopleWidth = 1265;
		}

		newPeople.width(newPeopleWidth);
		posts.width(postWidth);
	}
}

// Load jQuery and execute the main function
addJQuery(googlePlusPlus);
