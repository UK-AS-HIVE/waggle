/**
 * Defines the keyboard controls for an autocomplete input
 * 	Vars:
 *		container 			- The css selector that defines the autocomplete option container.
 *		input 				- The jQuery object for the input [already put through $()].
 *		autocompleteHandler	- The function called when the input changes.
 *	Ex: 
 *		WaggleAutocomplete('#input-wrapper .autocomplete-options', $('#input-wrapper input'), 'MyOptionGenerator')
 */
var waggleAutocompleteOngoing = false;
function WaggleAutocomplete(container, input, autocompleteHandler){
	(function($){
		$(input).keyup(function(e){
			var ec = e.keyCode;
			//console.log(ec);
			if(ec == 40){ // Up
			    e.preventDefault();
				var current = $(container + ' a.highlighted');
				if(current.length){
				    var siblings = current.siblings();
					if(siblings.length == 0){
						return;
					}
					
					var next = current.next();
					if(next.length != 0){
						current.removeClass('highlighted');
						next.addClass('highlighted');
						return;
					}
				}
				var first = $(container + ' a:first-child');
				if(first.length != 0){
					current.removeClass('highlighted');
					first.addClass('highlighted');
					return ;
				}
			}
			else if(ec == 38){ // Down
				e.preventDefault();
				var current = $(container + ' a.highlighted');
				if(current.length){
				    var siblings = current.siblings();
					if(siblings.length == 0){
						return;
					}
					
					var previous = current.prev();
					if(previous.length != 0){
						current.removeClass('highlighted');
						previous.addClass('highlighted');
						return;
					}
				}
				var last = $(container + ' a:last-child');
				if(last.length != 0){
					current.removeClass('highlighted');
					last.addClass('highlighted');
					return;
				}
			}
			else if(ec == 13) {  // Enter
				e.preventDefault();
				var current = $(container + ' a.highlighted');
				if(current.length){
					current.click();
					waggleAutocompleteOngoing = false;
				}
				return false;
			}
			else{
				var fn = window[autocompleteHandler];
				if(typeof fn === 'function'){
					waggleAutocompleteOngoing = true;
					fn(this);
				}
			}
		});
	}(jQuery));
}

/**
 * Uses a css class to control which option is currently selected
 * 	Vars:
 *		container 	- The css selector that defines the autocomplete option container
 */
function AutocompleteHover(container){
	(function($){
		$(container + ' a').hover(function(){
		    $(this).siblings().removeClass('highlighted');
			$(this).addClass('highlighted');
		}, function(){
			$(this).removeClass('highlighted');
		});		
	}(jQuery));
}


/************************************************************************************

								Candidate Functions
						(Generate the appropriate candidates)

************************************************************************************/

/**
 * Uses cached users variable to generate autocomplete candidates
 * 	Vars:
 *		parts 	 			- An array of search strings that must be satisfied (AND only).
 *		limit 				- The amount of candidates that should be returned.
 *		currentUsers 		- (Optional) An array of users that should be excluded.	
 */
(function($){
UserCandidates = function(parts, limit, currentUsers){
		// This check and declaration may be unnecessary.  Variable is needed to exclude certain users from autocomplete.
		if(currentUsers === undefined){
			currentUsers = new Array();
		}

		// Need to copy object instead of its pointer
		var candidates = $.extend({}, users),
		    count = 0;
		// @TODO This would be the place to run some fancy sorting.  
		//	I would like it to already be cached client-side, but that may not be feasible.
		for(var uid in candidates) {
			var removed = false;
			if(count >= limit){
				delete candidates[uid];
			}
			else if($.inArray(uid, currentUsers) != -1) {
				delete candidates[uid];
				removed = true;
			}
			else{
				var matched = new Array();
				for (var i=0; i<parts.length; i++){
					var pattern = new RegExp(parts[i], 'i');
					matched.push((pattern.test(candidates[uid]['name']) || pattern.test(candidates[uid]['mail'])) ? 'yes' : 'no');
				}
				if ($.inArray('no', matched) != -1){
					delete candidates[uid];
					removed = true;
				}
			}
			if(!removed){
				count++;
			}
		}
		return candidates;
}
}(jQuery));


/************************************************************************************

								Specific field callbacks
(Determines if autocomplete should run, calls candidate function and renders new users)

@TODO... 	These are weird.  They call functions from other js files, and maybe should
			be either reworked or moved.  Not sure.

************************************************************************************/

/**
 * Handler for the add associated user field on stories
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 */
function AddUserAutocompleteHandler(myInput){
	(function($){
	    var nid = $(myInput).attr('class').substring(5),
			currentUsers = new Array();
		$('#story-' + nid + ' .associated-user').each(function(i, item){
			var classes = $(item).attr('class').split(' ');
			currentUsers.push(classes[1].substring(5));
		});
		if($(myInput).val().length > 0){
			parts = $(myInput).val().split(' ');
			var candidates = UserCandidates(parts, 6, currentUsers);
			var newHTML = '';
			for (var i in candidates) {
				newHTML += '' +
				  '<a class="user-candidate user-' + i + ' node-' + nid + '">' +
					'<span class="picture">' + candidates[i]['picture'] + '</span>' +
					'<span class="name">' + candidates[i]['name'] + '</span>' + 
					'<span class="linkblue">' + candidates[i]['linkblue'] + '</span>' + 
				  '</a>';
			}
			$(myInput).parents('.associated-user-rollover').find('.user-list').html(newHTML);
			if(newHTML == ''){
				waggleAutocompleteOngoing = false;
				return;
			}
			StoryAddUserBindings('#story-' + nid + ' .add-associated-user');
			AutocompleteHover('#story-' + nid + ' .add-associated-user'); 
		}
		else{
			waggleAutocompleteOngoing = false;
		}
	}(jQuery));
}

/**
 * Handler for the sidebar search box
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 */
function SidebarAutcompleteHandler(input){
	(function($){
		var value = $(input).val();
		if(value != ''){
			var parts = value.split(' '),
			    last = parts[parts.length - 1];
			if(last.charAt(0) == '@' && last.length > 1){
				var search_string = last.substring(1),
				    candidates = UserCandidates([search_string], 8, []);
				var newHTML = '';
				for (var i in candidates) {
					newHTML += '' +
					  '<a class="user-candidate user-' + i + '">' +
						'<span class="picture">' + candidates[i]['picture'] + '</span>' +
						'<span class="name">' + candidates[i]['name'] + '</span>' + 
						'<span class="linkblue">' + candidates[i]['linkblue'] + '</span>' + 
					  '</a>';
				}
				$('#waggle-sidebar-search .autocomplete').html(newHTML);
				if(newHTML == ''){
					waggleAutocompleteOngoing = false;
					return;
				}
				AutocompleteHover('#waggle-sidebar-search .autocomplete');
				SidebarAutocompleteBindings('#waggle-sidebar-search .autocomplete a');
			}
		}
		else {
			sideSearchAutocomplete = false;
		}
	}(jQuery));
}

function SidebarAutocompleteBindings(selector){
	(function($){
		$(selector).click(function(){
			var classes = $(this).attr('class').split(' '),
				uid = classes[1].substring(5),
				container = $(this);
		    
		    var value = $('#waggle-sidebar-search input').val(),
		    	parts = value.split(' ');

		    parts[parts.length - 1] = '@' + users[uid]['linkblue'] + ' ';
		    $('#waggle-sidebar-search input').val(parts.join(' '));
		    $('#waggle-sidebar-search input').focus();

			$('#waggle-sidebar-search .autocomplete').html('');
		    return false;
		});
	}(jQuery));
}

/**
 * Handler for the add note textareas on each story
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 */
function NoteAutcompleteHandler(input){
	(function($){
		var value = $(input).val();
		if(value != ''){
			var parts = value.split(' '),
			    last = parts[parts.length - 1],
			    story = $(input).parents('.story'),
			    storyID = $(story).attr('id');
			if(last.charAt(0) == '@' && last.length > 1){
				var search_string = last.substring(1),
				    candidates = UserCandidates([search_string], 5, []);
				var newHTML = '';
				for (var i in candidates) {
					newHTML += '' +
					  '<a class="user-candidate user-' + i + '">' +
						'<span class="picture">' + candidates[i]['picture'] + '</span>' +
						'<span class="name">' + candidates[i]['name'] + '</span>' + 
						'<span class="linkblue">' + candidates[i]['linkblue'] + '</span>' + 
					  '</a>';
				}
				story.find('.autocomplete').html(newHTML);
				if(newHTML == ''){
					waggleAutocompleteOngoing = false;
					return;
				}
				AutocompleteHover('#' + storyID + ' .autocomplete');
				NoteAutocompleteBindings('#' + storyID + ' .autocomplete a');
			}
		}
	}(jQuery));
}

function NoteAutocompleteBindings(selector){
	(function($){
		$(selector).click(function(){
			var classes = $(this).attr('class').split(' '),
				uid = classes[1].substring(5),
				container = $(this),
				story = $(this).parents('.story'),
				storyID = $(story).attr('id');
		    
		    var value = $('#' + storyID + ' .new-note-form textarea').val(),
		    	parts = value.split(' ');

		    parts[parts.length - 1] = '@' + users[uid]['linkblue'];
		    $('#' + storyID + ' .new-note-form textarea').val($.trim(parts.join(' ')) + ' ');
		    $('#' + storyID + ' .new-note-form textarea').focus();

			$('#' + storyID + ' .new-note-form .autocomplete').html('');
			$('#' + storyID + ' .new-note-form textarea').keypress();
		    return false;
		});
	}(jQuery));
}