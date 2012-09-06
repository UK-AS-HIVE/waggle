(function($,undefined) {

$(document).ready(function () {
	var quickAnimate = false,
	    wantsQuickAnimate = false,
		moveAgain = false;

	/****************************************************
					Keyboard Controls
	*****************************************************/
	$(document).keydown(function (e) {
		var ec = e.keyCode;
		if ((ec == 32 || ec == 83) && ($('textarea:focus').length == 0) && ($('input:focus').length == 0)) {
		  NextStory();
		  return false;
		}
		if (ec == 87 && $('textarea:focus').length == 0 && $('input:focus').length == 0) {
		  PreviousStory();
		  return false;
		}
		if (ec == 73 && $('textarea:focus').length == 0 && ($('input:focus').length == 0) && $('.story.expanded').length == 1){
		  $('.story.expanded textarea').focus();
		  return false;
		}
		
		//console.log(e.keyCode);
		
	})
	
	/****************************************************
						  Buttons
	*****************************************************/
	$('#navigate-up').click(function(){
		PreviousStory();
	});
	$('#navigate-down').click(function(){
		NextStory();
	});

	/****************************************************
						  Waggle Top Menu
	*****************************************************/
	
	// Start Story button
	$('#waggle-top-menu a.start-story').click(function(){
		$('#waggle-top-add').toggle();
		if($('#waggle-top-add').is(':visible')){
			$('#start-story-textarea-wrapper textarea').focus();
			var offset = $('#waggle-top-add').offset().top;
			CollapseAllStories();
			$('html, body').stop().animate({
				scrollTop: offset -90
			}, 0);
			var sidebar = $('#block-waggle-waggle-sidebar');
			sidebar.css('top', (offset - $('#sidebar-second').offset().top) + 'px');
			sidebar.css('position', 'absolute')
		}
	});
	// Change submitted by user button
	$('#start-story-submitted-by-wrapper .controls a').click(function(){
		$('#start-story-submitted-by-wrapper .change-wrapper').toggle();
		$('#start-story-submitted-by-wrapper .change-wrapper input').focus();
		$('#start-story-submitting-user').toggle();
	});
	// More Options button
	$('#start-story-expander a').click(function(){
		$('#start-story-secondary-fields').toggle();
		$('#start-story-expander a').html($('#start-story-expander a').html() == 'more options' ? 'fewer options' : 'more options')
	});
	// Cancel button
	$('#start-story-buttons-wrapper a').click(function(){
		$('#waggle-top-add').toggle();
	});

	// Change submitting user input
	$('#start-story-submitted-by-wrapper input').blur(function(){
		// Short timeout in case the blur is when the user clicks on an autocomplete <a> option.
		setTimeout(function(){
		    $('#start-story-submitting-user').show();
			$('#start-story-submitted-by-wrapper .change-wrapper').hide();
		}, 200);
	});

	WaggleAutocomplete('#start-story-submitted-by-wrapper .autocomplete', $('#start-story-submitted-by-wrapper input'), 'StartStorySubmittedByHandler'); 

	// Submit
	$('#waggle-top-add-form').submit(function(){
		var form = $('#waggle-top-add-form'),
		    note = form.find('textarea'),
		    submitFor = form.find('.change-wrapper input'),
		    dueDate = form.find('#start-story-due-date-wrapper input'),
		    submitButton = form.find('#start-story-buttons-wrapper input');
		if(note.val() != ''){
			submitButton.attr('disabled', 'disabled');
			var args = ['note=' + encodeURIComponent(note.val())];
			if(submitFor.val() != ''){
				args.push('behalfof=' + encodeURIComponent(submitFor.val()));
			}
			if(dueDate.val() != ''){
				//@TODO validate date before submission?
				args.push('due=' + encodeURIComponent(dueDate.val()));
			}
console.log('waggle/api/start-story?' + args.join('&'));
			$.getJSON('waggle/api/start-story?' + args.join('&'),function(json) {
				console.log(json);
				if(json){
					console.log('success');
					$('#block-system-main').html(json);
				}
				else{
					console.log('Problem saving new story.')
				}
				submitButton.attr('disabled', '');
			});
		}
		return false;
	});


	

	/****************************************************
					Sidebar Scrolling
	*****************************************************/
	var $sidebar   = $("#sidebar"),
        $window    = $(window),
        topPadding = 10;

    $window.scroll(function() {
		var currentScroll = $window.scrollTop();
		var newPosition = currentScroll > 100 ? 10 : 110 - currentScroll;
        $sidebar.css('top', newPosition);
        
    });
	
	/****************************************************
					Sidebar Search
	*****************************************************/

	var sidebarAutocompleting = false;
	$('#waggle-sidebar-search').submit(function(){
		if($(this).find('a.highlighted').length > 0){
			sidebarAutocompleting = false;
			return false;
		}
		var form = $('#waggle-sidebar-search'),
		    input = form.children('input');
		if(input.val() != ''){
			input.attr('disabled', 'disabled');
			console.log('waggle/api/search?s=' + encodeURIComponent(input.val()));
			$.getJSON('waggle/api/search?s=' + encodeURIComponent(input.val()),function(json) {
				if(json.length){
					//GetAccordion(json);
					$(document).trigger('waggleSearchReturned', [json]);
					$('#waggle-sidebar .waggle-search-messages').html('');
				}
				else{
					$('#waggle-sidebar .waggle-search-messages').html('<div class="alert">No results returned.</div>');
				}
				input.attr('disabled', '');
			});
		}
		return false;
	});

	$('#waggle-sidebar-search input').blur(function(){
		// Placed inside short timout in case user is clicking on an autocomplete option.
		setTimeout(function(){
			$('#waggle-sidebar-search .autocomplete').html('');
		}, 200);
	});
	

	WaggleAutocomplete('#waggle-sidebar-search .autocomplete', $('#waggle-sidebar-search input'), 'SidebarAutcompleteHandler'); 
	
	
});

}(jQuery));



// These calls are put into a functions so that when new items are added, they can be given these bindings easily.


/* Story Interface */
function SetUpStoryInterface(){
    (function($){
		$('.story').click(function () {
			if(!$(this).hasClass('expanded'))
				ExpandStory($(this), 0);
		});
	  
		$('.note-submit').click(function(event){
			var sub = $(event.target),
				nid = sub.attr('id').substring(12),
				tex = $('#note-text-' + nid);
					
			sub.attr('disabled', 'disabled');
			tex.attr('disabled', 'disabled');
			
			if($('#note-text-' + nid).val()){
				$.getJSON('waggle/api/add-note?nid=' + nid + '&note=' + encodeURIComponent(tex.val()),function(json) {
					  sub.attr('disabled', '');
					  tex.attr('disabled', '');
					  console.log('waggle/api/add-note?nid=' + nid + '&note=' + encodeURIComponent(tex.val()));
					  tex.val('');
					  $('#story-' + nid + ' .current-notes').html(json);
				});
			}
			return false;
		});

		$('.story .new-note-form textarea').blur(function(){
			// Placed inside short timout in case user is clicking on an autocomplete option.
			setTimeout(function(){
				$('#.story .new-note-form .autocomplete').html('');
			}, 200);
		});
		
		var stories = $('.story').each(function(i, story){
			var id = $(story).attr('id');
			WaggleAutocomplete('#' + id + ' .new-note-form .autocomplete', $('#' + id + ' .new-note-form textarea'), 'NoteAutcompleteHandler'); 
		});
		
		StoryCurrentUserBindings('.associated-user');
		StoryAddUserBindings('.add-associated-user');
		
		// User searching for association
		WaggleAutocomplete('.add-associated-user', $('.add-user-search input'), 'AddUserAutocompleteHandler'); 
		
	}(jQuery));
}

function StoryCurrentUserBindings(selector){
    (function($){
		$(selector).hover(function(){
			$(this).children('.associated-user-rollover').css('display', 'block');
		}, function(){
			$(this).children('.associated-user-rollover').css('display', 'none');
		});
		
		$(selector + ' a.remove-user').click(function(){
			var classes = $(this).attr('class').split(' '),
				nid = classes[2].substring(5),
				uid = classes[1].substring(5),
				container = $(this).parents('.associated-user-rollover');
			$.getJSON('waggle/api/remove-user/' + nid + '/' + uid, function(json) {
			  container.remove();
			});
			$(this).parents('.associated-user').remove();
			return false;
		});
	}(jQuery));
}

function StoryAddUserBindings(selector){
	(function($){
		$(selector).hover(function(){
			$(this).children('.associated-user-rollover').css('display', 'block');
			$(this).find('input').focus();
		}, function(){
			$(this).children('.associated-user-rollover').css('display', 'none');
			$(this).find('input').blur();
		});
		$(selector + ' a').click(function(){
			var classes = $(this).attr('class').split(' '),
			    nid = classes[2].substring(5),
				uid = classes[1].substring(5),
				container = $(this);
		    $.getJSON('waggle/api/add-user/' + nid + '/' + uid, function(json) {
			    container.remove();
			    $('#story-' + nid + ' .current-associated-users').append(json);
				StoryCurrentUserBindings('#story-' + nid + ' .associated-user');
			});
			$(this).parents('.associated-user-rollover').css('display', 'none');
		    return false;
		});
	}(jQuery));
}

