var CollapseAllStories;
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
  $('.story').switchClass('unaltered', 'mini', '0');
}

PreviousStory = function(){
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('#content div.story:first-child').attr('id')) {
    ExpandStory($('#content div.story:last-child'), 400);
  }	
  else {
    ExpandStory($('.story.expanded').prev(), 400);
  }
}

NextStory = function(){
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('#content div.story:last-child').attr('id')) {
    ExpandStory($('#content div.story:first-child'), 400);
  }	
  else {
    ExpandStory($('.story.expanded').next(), 400);
  }
}

QuickPrevious = function(){
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('#content div.story:first-child').attr('id')) {
    ExpandStory($('#content div.story:last-child'), 0);
  }	
  else {
    ExpandStory($('.story.expanded').prev(), 0);
  }
}

QuickNext = function(){
  if($('.story.expanded').length == 0 || $('.story.expanded').attr('id') == $('#content div.story:last-child').attr('id')) {
    InstantExpand($('#content div.story:first-child'));
  }	
  else {
    InstantExpand($('.story.expanded').next());
  }
}

InstantExpand = function(story){
  if(story.length != 1) {
    return;
  }
  CheckNewNoteColor(story);
  var oldId = $('.story.expanded').attr('id');
  $('.story.expanded').switchClass('expanded', 'mini');
  
  
  story.switchClass('mini', 'expanded');
}

ExpandQuickviews = function(){
  $('.story.expanded .story-notes').slideToggle(400);
}

ExpandStory = function(story, speed){
  if(story.length != 1) {
    return;
  }
  CheckNewNoteColor(story);
  var oldId = $('.story.expanded').attr('id'),
      offset = CollapseExpandedStories(speed); 
  
  //Don't worry about vertical offset if going *up* the list
  if(story.nextAll('#' + oldId).length == 1) 
    offset = 0;
  
  story.switchClass('mini', 'expanded', speed);
  
  ScrollToStory(story, offset, speed);
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
/*
  $('.story div').stop();
  
  $('.story.expanded .story-cover').fadeIn(speed);
 
  var st = $('.story.expanded'),
      de = $('.story.expanded .story-description'),
      currentHeight = st.height(),
	  deCurrent = de.height();
  st.css('margin-left', '80px');
  $('.story.expanded .story-description .summary-ellipsis').css('display', 'inline');
  $('.story.expanded .story-description .story-othertext').css('display', 'none');
  $('.story.expanded .story-notes').toggle();
  $('.story.expanded .story-author img').css('width', '43px');
  $('.story.expanded .story-description').css('padding-left', '34px');
  var newHeight = st.height(),
      deNew = de.height();
  st.css('margin-left', '10px');
  $('.story.expanded .story-description .story-othertext').css('display', 'inline');
  $('.story.expanded .story-notes').toggle();
  $('.story.expanded .story-description .summary-ellipsis').css('display', 'none');
  $('.story.expanded .story-author img').css('width', '60px');
  $('.story.expanded .story-description').css('padding-left', '0px');
  $('.story.expanded .story-description .story-othertext').delay(2).slideToggle(speed);
  $('.story.expanded .story-notes').delay(2).slideToggle(speed);
  de.css('height', deCurrent);
  var old = $('.story.expanded .story-description .summary-ellipsis');
  de.delay(10).animate({
    height: deNew,
	paddingLeft : 34,
    }, speed, function(){
    de.css('height', 'auto');
	old.css('display', 'inline');
  }); 
  $('.story.expanded .story-author img').delay(10).animate({
    width: 43
	}, speed);
  st.delay(2).animate({
    marginLeft: 80
  }, speed);
  
  $('.story.expanded').removeClass('expanded');
  return currentHeight - newHeight;
  */
}

CheckNewNoteColor = function(story){
    var cu = story.children('.story-notes').children('.new-note').hasClass('odd') ? 'odd' : (story.children('.story-notes').children('.new-note').hasClass('even') ? 'even' : '');
    var nex = story.children('.story-notes').children('.current-notes').children().length % 2 == 0 ? 'odd' : 'even';
	if(cu != nex){
	  story.children('.story-notes').children('.new-note').addClass(nex);
	  story.children('.story-notes').children('.new-note').removeClass(cu);
	}
}

$(document).ready(function(){setInterval('UpdateSidebar()',1000)});



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

