(function($,undefined) {

$(document).ready(function () {
	var quickAnimate = false,
	    wantsQuickAnimate = false,
		moveAgain = false;

	/****************************************************
					Keyboard Controls
	*****************************************************/
	$(document).keydown(function (e) {
		var ec = e.keyCode;
		if ((ec == 32 || ec == 83) && ($('textarea:focus').length == 0) && ($('input:focus').length == 0)) {
		  WantsNext(); 
		  return false;
		}
		if (ec == 87 && $('textarea:focus').length == 0) {
		  WantsPrevious();
		  return false;
		}
		if (ec == 73 && $('textarea:focus').length == 0 && ($('input:focus').length == 0) && $('.story.expanded').length == 1){
		  $('.story.expanded textarea').focus();
		  return false;
		}
		
		//console.log(e.keyCode);
		
	}).keyup(function (e) {
		var ec = e.keyCode;
		if((ec ==32 || ec == 83 || ec == 87) && quickAnimate){
		    quickAnimate = false;
		    wantsQuickAnimate = false;
			setTimeout(function(){
			  if(!moveAgain && !quickAnimate && !wantsQuickAnimate)
		        ExpandQuickviews();
			}, 200);
		}
	});
	
	
	/****************************************************
						  Buttons
	*****************************************************/
	$('#navigate-up').click(function(){
	  WantsPrevious();
	});
	$('#navigate-down').click(function(){
	  WantsNext();
	});
	
	
	
	
	
	/****************************************************
						  Function calls
	*****************************************************/
	function WantsNext(){
	  if(!$('.story div').is(":animated") && !wantsQuickAnimate)
			NextStory();
	  else if(!$('.story div').is(":animated") && wantsQuickAnimate && !quickAnimate){
		QuickNext();
		quickAnimate = true;
		moveAgain = false;
		setTimeout(function(){quickAnimate = false;}, 2000);
	  }
	  else {
		wantsQuickAnimate = true;
	  }
	}

	function WantsPrevious(){
	  if(!$('.story div').is(":animated") && !wantsQuickAnimate)
			PreviousStory();
	  else if(!$('.story div').is(":animated") && wantsQuickAnimate && !quickAnimate){
		QuickPrevious();
		quickAnimate = true;
		moveAgain = false;
		setTimeout(function(){quickAnimate = false;}, 500);
	  }
	  else {
		wantsQuickAnimate = true;
		moveAgain = true;
	  }
	}  
	
	
	
	/****************************************************
					Sidebar Scrolling
	*****************************************************/
	var $sidebar   = $("#sidebar"),
        $window    = $(window),
        topPadding = 10;

    $window.scroll(function() {
		var currentScroll = $window.scrollTop();
		var newPosition = currentScroll > 100 ? 10 : 110 - currentScroll;
        $sidebar.css('top', newPosition);
        
    });
	
});

}(jQuery));
