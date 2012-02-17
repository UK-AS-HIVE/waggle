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
	$('#waggle-sidebar-search').submit(function(){
		var form = $('#waggle-sidebar-search'),
		    input = form.children('input');
		if(input.val() != ''){
			input.attr('disabled', 'disabled');
			$.getJSON('waggle/api/search?s=' + encodeURIComponent(input.val()),function(json) {
				if(json.length){
					GetTickets(json);
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
	
	var sideSearchAutocomplete = false;
	AutocompleteKeyboard('#waggle-sidebar-search .autocomplete', $('#waggle-sidebar-search input'), 'SidebarAutcompleteHandler'); 
	
	
});

}(jQuery));

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
					  tex.val('');
					  $('#story-' + nid + ' .current-notes').html(json);
				});
			}
			return false;
		});
		
		AssociatedUsersSetup('.associated-user');
		UserListSetup('.add-associated-user');
		
		// User searching for association
		AutocompleteKeyboard('.add-associated-user', $('.add-user-search input'), 'UserAutocompleteHandler'); 
		
	}(jQuery));
}

// These calls are put into a functions so that when new items are added, they can be given these bindings easily.
function AssociatedUsersSetup(selector){
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

function UserListSetup(selector){
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
				AssociatedUsersSetup('#story-' + nid + ' .associated-user');
			});
			$(this).parents('.associated-user-rollover').css('display', 'none');
		    return false;
		});
	}(jQuery));
}

function UserAutocompleteHandler(myInput){
	(function($){
	    var nid = $(myInput).attr('class').substring(5),
			currentUsers = new Array();
		$('#story-' + nid + ' .associated-user').each(function(i, item){
			var classes = $(item).attr('class').split(' ');
			currentUsers.push(classes[1].substring(5));
		});
		if($(myInput).val().length > 0){
			parts = $(myInput).val().split(' ');
			var candidates = userAutocomplete(parts, 6, currentUsers);
			
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
			UserListSetup('.add-associated-user');
			AutocompleteHover('.add-associated-user', myInput); 
		}
	}(jQuery));
}

function SidebarAutcompleteHandler(input){
	(function($){
		var value = $(input).val();
		if(value != ''){
			var parts = value.split(' '),
			    last = parts[parts.length - 1];
			if(last.charAt(0) == '@' && last.length > 1){
				var search_string = last.substring(1),
				    candidates = userAutocomplete([search_string], 8);
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
				AutocompleteHover('#waggle-sidebar-search .autocomplete', input);
			}
		}
		else {
			sideSearchAutocomplete = false;
		}
	}(jQuery));
}

function AutocompleteHover(container, input){
	(function($){
		$(container + ' a').hover(function(){
		    $(this).siblings().removeClass('highlighted');
			$(this).addClass('highlighted');
		}, function(){
			$(this).removeClass('highlighted');
		});		
	}(jQuery));
}

function AutocompleteKeyboard(container, input, autocompleteHandler){
	(function($){
		$(input).keydown(function(e){
			var ec = e.keyCode;
			//console.log(ec);
			// Down 40
			// Up 38
			if(ec == 40){
			    e.preventDefault();
				var current = $(container + ' a.highlighted');
				console.log(current);
				if(current.length){
				    var siblings = current.siblings();
					console.log(siblings);
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
				console.log(first);
				if(first.length != 0){
					current.removeClass('highlighted');
					first.addClass('highlighted');
					return ;
				}
			}
			else if(ec == 38){
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
			else{
				var fn = window[autocompleteHandler];
				if(typeof fn === 'function'){
					fn(this)
				}
			}
		});
	}(jQuery));
}