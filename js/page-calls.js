function WagglePage(page) {
	LoadUsers();
	LoadCurrentUser();
	switch(page){
		case 'accordion':
			GetAccordion();
			break;
		case 'calendar':
			GetCalendar();
			break;
	}
	
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

function GetAccordion(nids) {
    (function ($,undefined){
		var url = (nids === undefined) ? '/waggle/api/get-stories/stories' : ('/waggle/api/get-stories/stories/' + nids.join('+'));
		console.log(url);
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

function GetCalendar(nids) {
    (function ($,undefined){
		var url = (nids === undefined) ? '/waggle/api/get-stories/calendar' : ('/waggle/api/get-stories/calendar/' + nids.join('+'));
		console.log(url);
        $.getJSON(url, function (json) {
			$('#block-system-main').html(json);
			/*
			SetUpStoryInterface();
        
			CollapseAllStories();
			
			var areas = document.querySelectorAll('.expandingArea');
			var l = areas.length;

			while (l--) {
				  makeExpandingArea(areas[l]);
			}
			*/
		});
	}(jQuery));
}

