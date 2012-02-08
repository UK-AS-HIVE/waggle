//var CollapseAllStories;
var PreviousStory;
var NextStory;
var QuickPrevious;
var QuickNext;
var InstantExpand;
var ExpandStory;
var ExpandQuickviews;
var ScrollToStory;
var CollapseExpandedStories;

var currentStory = null;
var UpdateSidebar;

(function ($, undefined) {

CollapseAllStories = function(){
  $('.story').switchClass('unaltered', 'mini', 0);
}

PreviousStory = function(){
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('.view-waggle-stories .views-row-first .story').attr('id')) {
    ExpandStory($('.view-waggle-stories .views-row-last .story'), 0);
  }	
  else {
    ExpandStory($('.story.expanded').parent().prev().children('.story'), 0);
  }
}

NextStory = function(){
  console.log('next');
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('.view-waggle-stories .views-row-last .story').attr('id')) {
    ExpandStory($('.view-waggle-stories .views-row-first .story'), 0);
  }	
  else {
    ExpandStory($('.story.expanded').parent().next().children('.story'), 0);
  }
}

ExpandStory = function(story, speed){
  console.log('expand');
  if(story.length != 1) {
    return;
  }
  CheckNewNoteColor(story);
  var oldId = $('.story.expanded').attr('id'),
      offset = CollapseExpandedStories(speed); 
  
  //Don't worry about vertical offset if going *up* the list
  //if(story.nextAll('#' + oldId).length == 1) 
    offset = 0;
  
  story.switchClass('mini', 'expanded', speed);
  
  ScrollToStory(story, offset, speed);
  
  var sidebar = $('#block-waggle-waggle-sidebar');
  sidebar.css('top', (story.offset().top - $('#sidebar-second').offset().top) + 'px');
  sidebar.css('position', 'absolute')
}

ScrollToStory = function(story, offset, speed){
  $('html, body').stop().animate({
	scrollTop: story.offset().top -offset -90
  }, speed);
}

CollapseExpandedStories = function(speed){
  var st = $('.story.expanded'),
      currentHeight = st.height();
  st.switchClass('expanded', 'mini', 0);
  var newHeight = st.height();
  st.switchClass('mini', 'expanded', 0);
  st.switchClass('expanded', 'mini', speed);
  return currentHeight - newHeight;

}

CheckNewNoteColor = function(story){
    var cu = story.children('.story-notes').children('.new-note').hasClass('odd') ? 'odd' : (story.children('.story-notes').children('.new-note').hasClass('even') ? 'even' : '');
    var nex = story.children('.story-notes').children('.current-notes').children().length % 2 == 0 ? 'odd' : 'even';
	if(cu != nex){
	  story.children('.story-notes').children('.new-note').addClass(nex);
	  story.children('.story-notes').children('.new-note').removeClass(cu);
	}
}

//$(document).ready(function(){setInterval('UpdateSidebar()',1000)});



UpdateSidebar = function(){
	var newStory = $('.story.expanded').attr('id').substr(6);
	if (newStory == currentStory)
		return;

	currentStory = newStory;

	console.log('now looking at story ' + currentStory);

	$('#sidebar #more-like-this').children().fadeOut(200,
		function(){
			$(this).remove();
		}
	);

	$.getJSON('api/GetMoreLikeThis.ashx?ticket_id=' + currentStory,
		function(json) { $.each(json, CreateSidebarStory); }
	);
}


}(jQuery));

/** 
  * Expanding Text Area
  * From http://www.alistapart.com/articles/expanding-text-areas-made-elegant/
  */
function makeExpandingArea(container) {
 var area = container.querySelector('textarea');
 var span = container.querySelector('span');
 if (area.addEventListener) {
   area.addEventListener('input', function() {
     span.textContent = area.value;
   }, false);
   span.textContent = area.value;
 } else if (area.attachEvent) {
   // IE8 compatibility
   area.attachEvent('onpropertychange', function() {
     span.innerText = area.value;
   });
   span.innerText = area.value;
 }
 // Enable extra CSS
 container.className += ' active';
}

/**
  * Extension to find inputs in focus
  */
jQuery.expr[':'].focus = function( elem ) {
  return elem === document.activeElement && ( elem.type || elem.href );
};

