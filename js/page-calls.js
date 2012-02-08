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
			$('#block-system-main').html(json);
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
                
				if($('#note-text-' + nid).val())
					$.getJSON('waggle/api/add-note?nid=' + nid + '&note=' + encodeURIComponent(tex.val()),function(json) {
						  console.log('successfully added a note.');
						  sub.attr('disabled', '');
						  tex.attr('disabled', '');
						  tex.val('');
						  $('#story-' + nid + ' .current-notes').html(json);
						  console.log(json);
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


