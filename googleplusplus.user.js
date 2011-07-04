// ==UserScript==
// @name           googleplusplus
// @author		   Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus
// @include        *plus.google.com*
// @description	   Changes appearance of Google Plus by hiding left and right side bars and widening main content containers.

// @version		   0.1.3
// ==/UserScript==

var logging = false;

function log(txt) {
  if(logging) {
    console.log(txt);
  }
}

//sets the item in the localstorage
function setItem(key, value) {
  try {
    log("Inside setItem:" + key + ":" + value);
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e) {
    log("Error inside setItem");
    log(e);
  }
  log("Return from setItem" + key + ":" +  value);
}
//Gets the item from local storage with the specified
//key
function getItem(key) {
  var value;
  log('Get Item:' + key);
  try {
    value = window.localStorage.getItem(key);
  }catch(e) {
    log("Error inside getItem() for key:" + key);
	  log(e);
	  value = "null";
  }
  log("Returning value: " + value);
  return value;
}
//Clears all the key value pairs in the local storage
function clearStrg() {
  log('about to clear local storage');
  window.localStorage.clear();
  log('cleared');
}

function GM_setValue(name, value){
	setItem(name);
	//if( !name ) { return; }
	//localStorage[name] = value;
}

function GM_getValue(name, oDefault){
	var v = getItem(name);
	if(v == null){
		return oDefault;
	}else{
		return v;
	}
	//return localStorage[name];
}

function GM_listValues(){
	return localStorage;
}

function GM_deleteValue(name){
	window.localStorage.removeItem(name);
}

function hideComments(){
	//clearStrg(); return;
	var i = 0;
	$("[id^='update']").find(":contains('Add a comment...')").each(function(){
		var comments = $(this).prev();
		var each_comment = comments.find('a.a-f-i-do');
		if(each_comment.length > 0){
			var post = comments.parent().parent();
			var postID = post.attr('id');
			comments.addClass('gpp__comments_' + i).addClass('gpp__comments');
			comments.before('<a style="line-height: 2em" class="gpp__comment_show_hide_' + i + '">Hide Comments</a>');
			//comments.hide(); //.css('background-color','red');
			var show_hide = $('.gpp__comment_show_hide_' + i);
			show_hide.click(function(){
				var t = $(this);
				if( t.text() == 'Hide Comments' ){
					comments.hide();
					GM_setValue('gpp__hidden_post_id_' + postID, postID);
					t.text('Show Comments');
				}else{
					comments.show();
					t.text('Hide Comments');
				}
			});
			var hiddenPostID = GM_getValue('gpp__hidden_post_id_' + postID, '');
			if(hiddenPostID != ''){
				comments.hide();
				show_hide.text('Show Comments');
			}
			i++;
		}
	});
}

function isPageNotification(){
	return (window.location.href.indexOf('/notifications/') > -1);
}

function isPagePhotos(){
	return (window.location.href.indexOf('/photos') > -1);
}

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

function requestScript(){
	//Request Script
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
    script.setAttribute("language", "javascript");
    script.setAttribute("src", 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
    head.appendChild(script);
}

function requestScriptWait(){
	if(typeof $ == 'undefined'){
		window.setTimeout(requestScriptWait, 50);
	}else{
		googlePlusPlus();
		hideComments();
    }
}

function addMain(callback){
	var script = document.createElement("script");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

function googlePlusPlusWait(){
	setTimeout(googlePlusPlus, 1000);
}

function run(){
	requestScript();
	requestScriptWait();
}

//Main function
function googlePlusPlus(){
	function toInt(n){ return Math.round(Number(n)); };
	
	var cpane = $('#contentPane');
	var wfactor = 0.8;
	var wfactorPost = 0.83;	
	var i = 0;
	
	i++;
	if(	cpane.width() == 800 ){
		//return;
	}
	if (cpane.length > 0) {
		cpane.width(800);
		var leftbar = cpane.prev();
		var rightbar = cpane.next();

		leftbar.hide();
		if( isPageNotification() ){
			rightbar.hide();
		}

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
	googlePlusPlusWait();
}

// Load jQuery and execute the main function
if( !isPagePhotos() ){ //Doesn't work on Notifications page right now.
	addJQuery(hideComments);
	//addMain(googlePlusPlus);
	//run();
}