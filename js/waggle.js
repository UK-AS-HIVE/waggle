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

    	});
})(jQuery);
