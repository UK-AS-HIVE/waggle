(function($) {
  $(document).ready(function() {
    $('#waggle-story-sidebar-save-help-expand').click(function() {
      $('#waggle-story-sidebar-save-help-container').slideToggle();
    });

    $('#waggle-story-sidebar-save-expand').click(function() {
      $(this).toggle();
      $('#edit-saved-searches-container').slideToggle();
    });

    // For newer webkit browsers, we need to manually submit if the button is hidden.
    $('#waggle-story-sidebar #edit-search').keypress(function(e) {
      if (e.which == 13) {
        $(this).parents('form').submit();
      }
    });

    // Delete existing saved searches
    $('#waggle-story-sidebar .saved-search-delete').click(function(e) {
      var div = $(this).parent();
      var savedSearchName = div.find('a').first().text();
      $.ajax({
        url: 'waggle/api/remove-saved-search',
        type: 'POST',
        data: { name: savedSearchName },
        success: function() {
          div.remove();
        }
      });
      return false;
    });
  });
}(jQuery));
