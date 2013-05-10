/**
 * Defines the keyboard controls for an autocomplete input
 * 	Vars:
 *		container 			- The css selector that defines the autocomplete option container.
 *		input 				- The jQuery object for the input [already put through $()].
 *		autocompleteHandler	- The function called when the input changes.
 *		bindingsFunction	- The function that should be called when autocomplete options are put into the container
 *	Ex: 
 *		WaggleAutocomplete('#input-wrapper .autocomplete-options', $('#input-wrapper input'), 'MyOptionGenerator')
 *
 */
var waggleAutocompleteOngoing = false;
function WaggleAutocomplete(container, input, autocompleteHandler, bindingsFunction){
	(function($){
		$(container).hide();
		input.attr('autocomplete', 'off');

		input.blur(function(){
			// Placed inside short timout in case user is clicking on an autocomplete option.
			setTimeout(function(){
				$(container).html('');
				$(container).hide();
			}, 200);
		});

		// If autocompleting and selecting an object, don't allow enter to submit the form
		input.keydown(function(e){
			var ec = e.keyCode;
			if(ec == 13 && ($(container + ' a.highlighted').length || $(container + ' a').length == 1)) {  // Enter
				e.preventDefault();
				var current = $(container + ' a.highlighted');
				if(current.length){
					current.click();
					waggleAutocompleteOngoing = false;
				}
				else{
					$(container + ' a').click();
				}
				return false;
			}
		});

		input.keyup(function(e){
			var ec = e.keyCode;
			//console.log(ec);
			if(ec == 27) { // Escape
				waggleAutocompleteOngoing = false;
				$(container).hide();
			}
			else if(ec == 40){ // Up
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
			}
			else{
				var fn = window[autocompleteHandler];
				if(typeof fn === 'function'){
					if ( input.val().length > 0 || input.is('textarea')) {
						waggleAutocompleteOngoing = true;
						// Pass variables to  
						waggleAutocompleteOngoing = fn(this, container, bindingsFunction);
					}
					else {
						waggleAutocompleteOngoing = false;
						$(container).html('');
						$(container).hide();
					}
				}
			}
		});
	}(jQuery));
}


function WaggleSetBindings(container, input, bindingsFunction) {
	(function($){
		$(container).show();
		AutocompleteHover(container);
		var fn = window[bindingsFunction];
		if(typeof fn === 'function') {
			fn(container, input);
		}
		else {
			console.log(bindingsFunction + ' does not appear to be a valid function in this scope.');
		}
	}(jQuery));
}

function WaggleNoResults(container) {
	(function($){
		$(container).hide();
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
					// Can match the Users name, mail, or linkblue.
					matched.push((pattern.test(candidates[uid]['name']) || pattern.test(candidates[uid]['mail']) || pattern.test(candidates[uid]['linkblue'])) ? 'yes' : 'no');
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


/**
 * Uses cached users variable to generate autocomplete candidates
 * 	Vars:
 *		parts 	 			- An array of search strings that must be satisfied (AND only).
 *		limit 				- The amount of candidates that should be returned.
 *		currentTags 		- (Optional) An array of users that should be excluded.	
 */
(function($){
TagCandidates = function(parts, limit, currentTags){
		// This check and declaration may be unnecessary.  Variable is needed to exclude certain users from autocomplete.
		if(currentTags === undefined){
			currentTags = new Array();
		}

		// Need to copy object instead of its pointer
		var candidates = $.extend({}, tags),
		    count = 0;
		// @TODO This would be the place to run some fancy sorting.  
		//	I would like it to already be cached client-side, but that may not be feasible.
		for(var tid in candidates) {
			var removed = false;
			if(count >= limit){
				delete candidates[tid];
			}
			else if($.inArray(tid, currentTags) != -1) {
				delete candidates[tid];
				removed = true;
			}
			else{
				var matched = new Array();
				for (var i=0; i<parts.length; i++){
					var pattern = new RegExp(parts[i], 'i');
					matched.push((pattern.test(candidates[tid]['name'])) ? 'yes' : 'no');
				}
				if ($.inArray('no', matched) != -1){
					delete candidates[tid];
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
 *	    container			- The identifier for the suggestion container
 */
function AddUserAutocompleteHandler(myInput, container, bindingsFunction){
	(function($){
	    var nid = $(myInput).parents('.node').attr('id').substring(5),
			currentUsers = new Array();
		$('#node-' + nid + ' .field-name-field-associated-users .user-picture').each(function(i, item){
			var classes = $(item).attr('class').split(' ');
			currentUsers.push(classes[1].substring(13));
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
			$(container).html(newHTML);
			if(newHTML == ''){
				WaggleNoResults(container);
				return false;
			}
			else {
				WaggleSetBindings(container, myInput, bindingsFunction);
				return true;
			}
		}
		else{
			return false;
		}
	}(jQuery));
}

/**
 * Handler for the add associated user field on stories
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 *	    container			- The identifier for the suggestion container
 */
function AddTagAutocompleteHandler(myInput, container, bindingsFunction){
	(function($){
	    var nid = $(myInput).parents('.node').attr('id').substring(5),
			currentTags = new Array();
		$('#node-' + nid + ' .story-tags-wrapper li a:first').each(function(i, item){
			currentTags.push(tagsByName[$(item).text()]['tid']);
		});
		if($(myInput).val().length > 0){
			parts = $(myInput).val().split(' ');
			var candidates = TagCandidates(parts, 6, currentTags);
			var newHTML = '';
			for (var i in candidates) {
				newHTML += '' +
				  '<a class="tag-candidate tag-' + i + ' node-' + nid + '">' +
					candidates[i]['name'] + 
				  '</a>';
			}
			$(container).html(newHTML);
			if(newHTML == ''){
				WaggleNoResults(container);
				return false;
			}
			else {
				WaggleSetBindings(container, myInput, bindingsFunction);
				return true;
			}
		}
		else{
			return false;
		}
	}(jQuery));
}

/**
 * Handler for the sidebar search box
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 *	    container			- The identifier for the suggestion container
 */
function SidebarAutocompleteHandler(input, container, bindingsFunction){
	(function($){
		var value = $(input).val();
		if(value != ''){
			var parts = value.split(' '),
			    last = parts[parts.length - 1];

			// @ User searching
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
				$(container).html(newHTML);
				if(newHTML == ''){
					WaggleNoResults(container);
					return false;
				}
				else {
					WaggleSetBindings(container, input, bindingsFunction);
					return true;
				}
			}

			// # Tag searching
			else if (last.charAt(0) == '#' && last.length > 1) {
				var search_string = last.substring(1),
				    candidates = TagCandidates([search_string], 8, []);
				var newHTML = '';
				for (var i in candidates) {
					newHTML += '' +
					  '<a class="tag-candidate tag-' + i + '">' +
						'<span class="name">' + candidates[i]['name'] + '</span>' + 
					  '</a>';
				}
				$(container).html(newHTML);
				if(newHTML == ''){
					WaggleNoResults(container);
					return false;
				}
				else {
					WaggleSetBindings(container, input, bindingsFunction);
					return true;
				}
			}
		}
		else {
			sideSearchAutocomplete = false;
		}
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


/**
 * Handler for the submitted by field on new stories
 * 	Vars:
 *		myInput 	 		- The jQuery variable for the textfield/textarea
 */
function StartStorySubmittedByHandler(myInput){
	(function($){
		if($(myInput).val() != ''){
			parts = $(myInput).val().split(' ');
			var candidates = UserCandidates(parts, 5, []);
			var newHTML = '';
			for (var i in candidates) {
				newHTML += '' +
				  '<a class="user-candidate user-' + i + '">' +
					'<span class="picture">' + candidates[i]['picture'] + '</span>' +
					'<span class="name">' + candidates[i]['name'] + '</span>' + 
					'<span class="linkblue">' + candidates[i]['linkblue'] + '</span>' + 
				  '</a>';
			}
			$('#start-story-submitted-by-wrapper .autocomplete').html(newHTML);
			if(newHTML == ''){
				waggleAutocompleteOngoing = false;
				return;
			}
			StartStorySubmittedByBindings('#start-story-submitted-by-wrapper .autocomplete a');
			AutocompleteHover('#start-story-submitted-by-wrapper .autocomplete'); 
		}
		else{
			waggleAutocompleteOngoing = false;
			$('#start-story-submitted-by-wrapper .autocomplete').html('');
		}
	}(jQuery));
}

function StartStorySubmittedByBindings(selector){
	(function($){
		$(selector).click(function(){
			console.log(this);
			var classes = $(this).attr('class').split(' '),
				uid = classes[1].substring(5),
				container = $(this);
		    
		    $('#start-story-submitting-user').html($(this).html());
		    $('#start-story-submitting-user').toggle();
			$('#start-story-submitted-by-wrapper .change-wrapper').toggle();
			$('#start-story-submitted-by-wrapper .change-wrapper input').val(users[uid]['linkblue']);

			$('#start-story-submitted-by-wrapper .autocomplete').html('');
		    return false;
		});
	}(jQuery));
}
