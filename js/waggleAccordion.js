(function($){
$(document).ready(function(){

  /**
   * Story controls (sliding effects mainly).
   */ 
  $(".views-row .comments").click(function(){
    $(this).parents('.node-story').find('.story-comments').slideToggle('200');  
  });
  $(".views-row .add-note").click(function(){
    $(this).parents('.node-story').find('.story-comments').show();
    $(this).parents('.node-story').find('.field-name-comment-body textarea').focus();
  });
  $(".views-row .details").click(function(){
    $(this).parents('.node-story').find('.story-extra-info').slideToggle('200');  
  });
  $(".views-row .add-user-link").click(function(){
    $(this).parents('.add-user').toggleClass('visible');
    $(this).parents('.add-user').find('input').focus();
  });
  $(".views-row").hover(function(){
    $(this).addClass('waggle-secondary-visible');  
  }, function() {
    $(this).removeClass('waggle-secondary-visible');  
  });


  $("#block-waggle-waggle-add-story .details").click(function(){
    $(this).parents('#block-waggle-waggle-add-story').find('.story-extra-info').slideToggle('200');  
  });
  $("#block-waggle-waggle-add-story.add-user-link").click(function(){
    $(this).parents('#block-waggle-waggle-add-story').toggleClass('visible');
    $(this).parents('#block-waggle-waggle-add-story').find('input').focus();
  });
  $("#block-waggle-waggle-add-story").hover(function(){
    $(this).addClass('waggle-secondary-visible');  
  }, function() {
    $(this).removeClass('waggle-secondary-visible');  
  });

  /**
   * Story Autocomplete inputs
   */
  var stories = $('.view-accordion-view .node-story').each(function(i, story){
    var id = '#' + $(story).attr('id');
    WaggleAutocomplete(id + ' .add-user-wrapper .suggestions', $(id + ' .add-user-wrapper input'), 'AddUserAutocompleteHandler');
  });

  /**
   * Sidebar Autocomplete
   */
   $('#edit-search-api-views-fulltext').parent().append('<div class="suggestions"></div>');
   WaggleAutocomplete('#edit-search-api-views-fulltext-wrapper .suggestions', $('#edit-search-api-views-fulltext'), 'SidebarAutcompleteHandler');

  /**
   * Story associated user controls
   */
  StoryCurrentUserBindings('.field-name-field-associated-users .profile');

  /**
   * Story Comment Autoexpanding textarea
   */
  var txt = $('.comment-form textarea'),
      hiddenDiv = $('<div class="hiddendiv"></div>'),
      content = null,
      defaultVal = 'Add a new note...';

  hiddenDiv.html(defaultVal);
  txt.addClass('noscroll');
  txt.val(defaultVal);

  $('body').append(hiddenDiv);

  txt.keyup(function(){
      
      content = $(this).val();
      content = content.replace("\n", '<br/>');
      hiddenDiv.html(content);
      var height =  hiddenDiv.height();
      if (height < 21) {
        height = 21;
      }

      $(this).css('height', height + 'px');

  })
  .focus(function(){
    if ($(this).val() === defaultVal) {
      $(this).val('');
    }
  })
  .blur(function(){
    if ($(this).val() === '') {
      $(this).val(defaultVal);
    }
  });

  /**
   * Story Comment Autoexpanding textarea
   */
  var newBody = $('#block-waggle-waggle-add-story .field-name-body textarea'),
    ASHiddenDiv = $('<div class="add-story-hiddendiv"></div>');

  ASHiddenDiv.html(defaultVal);
  newBody.addClass('noscroll');
  newBody.val(defaultVal);

  $('body').append(ASHiddenDiv);

  newBody.keyup(function(){
      content = $(this).val();
      content = content.replace("\n", '<br/>');
      ASHiddenDiv.html(content);
      var height =  ASHiddenDiv.innerHeight();
      if (height < 50) {
        height = 50;
      }

      $(this).css('height', height + 'px');

  })
  .focus(function(){
    if ($(this).val() === defaultVal) {
      $(this).val('');
    }
  })
  .blur(function(){
    if ($(this).val() === '') {
      $(this).val(defaultVal);
    }
  });

});
}(jQuery))
