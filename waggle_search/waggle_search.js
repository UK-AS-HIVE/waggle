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
  });
}(jQuery));
