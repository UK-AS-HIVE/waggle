//Generalized Function

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
		$(input).keyup(function(e){
			var ec = e.keyCode;
			console.log(ec);
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



// Specific field callbacks (determine if autocomplete should run, candidates, etc.)

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