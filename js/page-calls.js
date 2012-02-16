function WaggleStoriesPage() {
	LoadUsers();
	LoadCurrentUser();
	GetTickets();
	PrepareInterface(); 
}

var users = null;
function LoadUsers() {
    (function ($,undefined){
        $.getJSON("/waggle/api/load-all-users", function(json) {
            users = json;
        });
    }(jQuery));
}

var loggedInUser = null;
function LoadCurrentUser() {
    (function ($,undefined){
        $.getJSON("/waggle/api/load-user", function(json) {
            loggedInUser = json;
        });
    }(jQuery));
}

function GetTickets(nids) {
    (function ($,undefined){
		var url = (nids === undefined) ? '/waggle/api/get-stories' : ('/waggle/api/get-stories/' + nids.join('+'));
        $.getJSON(url, function (json) {
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


