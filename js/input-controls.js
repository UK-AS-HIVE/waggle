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
	$('#waggle-sidebar-search input').keyup(function(e){
		var input = this,
		    value = $(this).val();
		if(value != ''){
			var parts = value.split(' '),
			    last = parts[parts.length - 1];
			if(last.charAt(0) == '@' && last.length > 1){
				var search_string = last.substring(1),
				    candidates = userAutocomplete([search_string]);
				console.log(candidates);
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
			}
		}
		else {
			sideSearchAutocomplete = false;
		}
	});
	
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
		$('.add-user-search input').keyup(function(e){
		    var nid = $(this).attr('class').substring(5),
			    myInput = this,
				currentUsers = new Array();
			$('#story-' + nid + ' .associated-user').each(function(i, item){
				var classes = $(item).attr('class').split(' ');
				currentUsers.push(classes[1].substring(5));
			});
			if($(myInput).val().length > 0){
				parts = $(myInput).val().split(' ');
				var candidates = userAutocomplete(parts, currentUsers);
				
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
			}
		});
		
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