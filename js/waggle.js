/**
 * This file is meant to be used on various Waggle pages for common needs.
 */

// Globally needed variables
var users = new Array(); // For staff autocomplete
var tags = new Array();
var tagsByName = new Array();

(function($){
	// Use window load for autocomplete and other non-display calls that can be done lazily.
	$(window).load(function(){
		// Load users for staff autocomplete
		$.post('/waggle/api/staff-autocomplete-list', function(json){
			users = json;
		});
		// Load tags for staff autocomplete
		$.post('/waggle/api/tags-autocomplete-list', function(json){
			tags = json['by_tid'];
			tagsByName = json['by_name'];
		});
	});

	$(document).ready(function(){
		// New Story button in header
		$('.new-story-link').click(function(){
			$('#block-waggle-waggle-add-story').toggle();
			$('#block-waggle-waggle-add-story .field-name-body textarea').focus();
		})

		// New Story Autocomplete
		WaggleAutocomplete('#block-waggle-waggle-add-story .suggestions', $('#block-waggle-waggle-add-story .field-name-body textarea'), 'SidebarAutocompleteHandler', 'SidebarAutocompleteBindings');

		// Waggle story status <select>s
		$('select.change-status').change(function(){
			var select = $(this);
			select.parents('ul').append('<li class="change-status-ajax"><em>saving...</em></li>');
			select.parents('li').hide();
			$.post('/waggle/api/story/status/' + select.parents('.node').attr('id').substring(5), 
			  {'status': $(this).children('option:selected').val()}, function(json){
			  	if (!json) {
			  	  select.parents('li').find('.change-status-ajax em').text('error');
			  	  return;
			  	}
				select.parents('ul').find('.change-status-ajax').remove();
				select.parents('li').show();
				select.blur();

				if (select.children('option:selected').val() == 2) {
					select.parents('li').removeClass('waggle-secondary');
				}
				else {
					select.parents('li').addClass('waggle-secondary');
				}
			});
		});
		$('select.change-status').focus(function(){
			$(this).parents('.waggle-secondary').addClass('waggle-secondary-disabled').removeClass('waggle-secondary');
		}).blur(function(){
			$(this).parents('.waggle-secondary-disabled').addClass('waggle-secondary').removeClass('waggle-secondary-disabled');
		});

	});
})(jQuery);
