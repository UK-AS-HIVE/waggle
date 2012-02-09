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
					  console.log('successfully added a note.');
					  sub.attr('disabled', '');
					  tex.attr('disabled', '');
					  tex.val('');
					  $('#story-' + nid + ' .current-notes').html(json);
					  console.log(json);
				});
			}
			return false;
		});
		
		AssociatedUsersSetup('.associated-user');
		UserListSetup('.add-associated-user');
		
		// User searching for association
		var getAutocomplete;
		$('.add-user-search input').keyup(function(e){
		    var nid = $(this).attr('class').substring(5),
			    myInput = this;
			window.clearTimeout(getAutocomplete);
			if($(myInput).val().length > 0){
				getAutocomplete = window.setTimeout(function(){
					$.getJSON('waggle/api/autocomplete/user/' + nid + '/' + $(myInput).val(), function(json) {
						console.log(json);
						var newHTML = '';
						for (delta in json) {
							var account = json[delta];
							console.log(delta);
							console.log(account);
							newHTML += '' +
							  '<a class="user-candidate user-' + delta + ' node-' + nid + '">' +
							    '<span class="picture">' + account['picture'] + '</span>' +
								'<span class="name"></span>' + 
								'<span class="linkblue">' + account['name'] + '</span>' + 
							  '</a>';
						}
						$(myInput).parents('.associated-user-rollover').find('.user-list').html(newHTML);
						UserListSetup('.add-associated-user');
					});
				}, 500)
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