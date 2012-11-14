(function($) {
  $(document).ready(function() {
    $('#waggle-story-sidebar-save-expand').click(function() {
      $(this).toggle();
      $('#edit-saved-searches-container').slideToggle();
    });
  });
}(jQuery));
