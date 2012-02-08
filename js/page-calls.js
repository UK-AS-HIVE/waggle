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
			SetUpStoryInterface();
        
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


