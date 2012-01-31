var loggedInUser = null;

function LoadUser() {
(function ($,undefined){
  $.getJSON("/waggle/api/load-user", function(json) {
        loggedInUser = json;
  });
}(jQuery));
}

function GetTickets() {
(function ($,undefined){
$.getJSON("/waggle/api/get-stories", function (json) {
$.each(json, CreateStory);
          $('.story').click(function () {
                if(!$(this).hasClass('expanded'))
                    ExpandStory($(this), 600);
          });
          
          $('.note-submit').click(function(event){
                var sub = $(event.target),
                    hid = sub.attr('id').substring(12),
                        tex = $('#note-text-' + hid);
                        
                        sub.attr('disabled', 'disabled');
                        tex.attr('disabled', 'disabled');
                
                if($('#note-text-' + hid).val());
                        $.post('api/AddNote.ashx?ticket_id=' + hid + '&note=' + encodeURIComponent(tex.val()),
                                function(data) {
                                        console.log('successfully added a note.');
                                        sub.attr('disabled', '');
                                        text.attr('disabled', '');
                                }
                        );
                return false;
          });
          
          CollapseAllStories();
          
          var areas = document.querySelectorAll('.expandingArea');
          var l = areas.length;

          while (l--) {
                makeExpandingArea(areas[l]);
          }
    });
}(jQuery));
}


function PrepareInterface(){
(function ($,undefined){
  $('#sidebar-search-form').submit(function(){
    console.log($(this).children('.search-box').val());
    return false;
  });
}(jQuery));
}


