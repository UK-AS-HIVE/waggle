(function($){
$(document).ready(function(){
  /**
   * Story controls (sliding effects mainly).
   */ 
  $(".views-row .comments").live('click', function(){
    $(this).parents('.node-story').find('.story-comments').slideToggle('200');  
  });
  $(".views-row .add-note").live('click', function(){
    $(this).parents('.node-story').find('.story-comments').show();
    $(this).parents('.node-story').find('.field-name-comment-body textarea').focus();
  });
  $(".views-row .details").live('click', function(){
    $(this).parents('.node-story').find('.story-extra-info').slideToggle('200');  
  });
  $(".views-row .add-user-link").live('click', function(){
    $(this).parents('.add-user').toggleClass('visible');
    $(this).parents('.add-user').find('input').focus();
  });
  $(".story-tags-wrapper input").live('blur', function(){
    // Placed inside short timout in case user is clicking on an autocomplete option.
    tagWrapper = $(this).parents('.story-tags-wrapper');
    setTimeout(function(){
      tagWrapper.find('.add-tag-link').css('display', 'inline');
      tagWrapper.removeClass('visible');
    }, 200);
  });
  $(".views-row").live('mouseenter', function(){
    $(this).addClass('waggle-secondary-visible');  
  }).live('mouseleave', function() {
    $(this).removeClass('waggle-secondary-visible');  
  });
  $(".views-row .add-tag-link").live('click', function(){
    $(this).parents('.story-tags-wrapper').toggleClass('visible');
    $(this).parents('.story-tags-wrapper').find('input').focus();
    $(this).css('display', 'none');
  });

  // Add tags with textbox (autocomplete handled separately below)
  $(".views-row .add-tag-popup input").live('keyup', function(e){
    var ec = e.keyCode,
        id = $(this).attr('id'),
        nid = id.substring(13);
    if(ec == 13) {  // Enter
      // If the tag exists, send the tid.  Otherwise send the user input.
      var post = {};
      if (typeof(tagsByName[$(this).val()]) != "undefined" && tagsByName[$(this).val()] != null) {
        post['tid'] = tagsByName[$(this).val()]['tid'];
      }
      else {
        post['term'] = $(this).val();
      }
      console.log(post);

      $.post('waggle/api/story/add-tag/' + nid, post, function(json) {
        if (json != 0) {
          $('#node-' + nid + ' .field-name-field-tags').children(':first').append(json);
          $('#node-' + nid + ' .field-name-field-tags .waiting').remove();
          StoryCurrentTagBindings('#node-' + nid + ' .field-name-field-tags li');
        }
      });

      $(this).val('');
      $(this).blur();
    }
  });

  // editable due dates
  $(".waggle-editable").live('mouseenter', function(){
    $(this).addClass('waggle-visible');
  }).live('mouseleave', function() {
    $(this).removeClass('waggle-visible');
  });
  $(".waggle-editable a.edit-due-date-link").live('click', function(){
    $(this).parent().find('.field-items').html('<input type="text" />');
    $(this).parent().find('input').datepicker({
      onClose: function(dateText, inst) {
        console.log("Chose date as " + dateText);
        var nid = $(this).parents('.node-story').attr('id').substring(5);
        $(this).parents('.field-name-field-due-date').find('.field-items').html('<div class="field-item">' + dateText + '</div>');
        $.post('waggle/api/story/due-date/' + nid, {duedate: dateText});
      }
    });
    $(this).parent().find('input').focus();
  });

  $("#block-waggle-waggle-add-story .details").live('click', function(){
    $(this).parents('#block-waggle-waggle-add-story').find('.story-extra-info').slideToggle('200');  
  });
  $("#block-waggle-waggle-add-story.add-user-link").live('click', function(){
    $(this).parents('#block-waggle-waggle-add-story').toggleClass('visible');
    $(this).parents('#block-waggle-waggle-add-story').find('input').focus();
  });
  $("#block-waggle-waggle-add-story").live('mouseenter', function(){
    $(this).addClass('waggle-secondary-visible');  
  }).live('mouseleave', function() {
    $(this).removeClass('waggle-secondary-visible');  
  });

  /**
   * Story Comment Autoexpanding textarea
   */
  var txt = $('.story-new-comment-form textarea'),
      hiddenDiv = $('<div class="hiddendiv"></div>'),
      content = null,
      defaultVal = 'Add a new note...',
      defaultCommentHeight = 42;

  hiddenDiv.html(defaultVal);
  hiddenDiv.width(txt.width());
  txt.addClass('noscroll');
  txt.val(defaultVal);

  $('body').append(hiddenDiv);

  txt.live('keydown', function(){
    content = $(this).val();
    content = content.replace("\n", '<br/>');
    hiddenDiv.html(content);
    var height =  hiddenDiv.height();
    if (height < defaultCommentHeight) {
      height = defaultCommentHeight;
    }

    $(this).css('height', height + 'px');
  })
  .live('focus', function(){
    if ($(this).val() === defaultVal) {
      $(this).val('');
    }
  })
  .live('blur', function(){
    if ($(this).val() === '') {
      $(this).val(defaultVal);
    }
  })
  .live('change', function(){
    
  });

  /**
   * Story Comment Submitting
   */
  $('.story-new-comment-form .submit-comment').live('click', function(){
    var element_id = $(this).attr('id'),
      nid = element_id.substring(20),
      container = $(this),
      textarea = container.parents('.story-new-comment-form').find('textarea');

    // Don't do it if the textarea is empty or equal to the default val, or the submit is disabled.
    if (textarea.val() == '' || textarea.val() == defaultVal || container.attr('disabled') == 'disabled') {
      return false;
    }

    container.attr('disabled', 'disabled');
    $.post('waggle/api/story/note/' + nid,{'note' : textarea.val()}, function(json) {
      if (json != 0) {
        $('#node-' + nid + ' .current-comments').append(json);
        container.removeAttr('disabled');
        textarea.val(defaultVal);
        textarea.css('height', defaultCommentHeight + 'px');
      }
    });
    return false;
  });


  // Binders that need to be added individually are wrapped in a function to be called on the infinite scroll trigger.
  var WaggleBindStories = function() {
    /**
     * Story Autocomplete inputs
     */
    var stories = $('.view-accordion-view .node-story').not('.waggle-bound').each(function(i, story){
      var id = '#' + $(story).attr('id');
      WaggleAutocomplete(id + ' .add-user-wrapper .suggestions', $(id + ' .add-user-wrapper input'), 'AddUserAutocompleteHandler', 'StoryAddUserBindings');
      WaggleAutocomplete(id + ' .add-tag-wrapper .suggestions', $(id + ' .add-tag-wrapper input'), 'AddTagAutocompleteHandler', 'StoryAddTagBindings');
      if ($(id + ' .comment-form .suggestions').length === 0) {
        $(id + ' .comment-form textarea').parent().append('<div class="suggestions" style="display:none;"></div>');
      }
      WaggleAutocomplete(id + ' .story-new-comment-form .suggestions', $(id + ' .story-new-comment-form textarea'), 'SidebarAutocompleteHandler', 'SidebarAutocompleteBindings');
      StoryAddStatusBindings(id);
      $(story).addClass('waggle-bound');
    });

    /**
     * Sidebar Autocomplete
     */
     if ($('#block-waggle-search-waggle-story-sidebar .suggestions').length === 0) {
       $('#block-waggle-search-waggle-story-sidebar input#edit-search').parent().append('<div class="suggestions" style="display:none;"></div>');
     }
     WaggleAutocomplete('#block-waggle-search-waggle-story-sidebar .suggestions', $('#block-waggle-search-waggle-story-sidebar input#edit-search'), 'SidebarAutocompleteHandler', 'SidebarAutocompleteBindings');


    /**
     * Story associated user controls
     */
    StoryCurrentUserBindings('.field-name-field-associated-users .profile');

    /**
     * Story tag controls
     */
    StoryCurrentTagBindings('.field-name-field-tags li');
  }
  // First call on load for the initial stories.
  WaggleBindStories();
  $(document).bind('views_infinite_scroll_loaded', function(){
    WaggleBindStories();
    Drupal.attachBehaviors();
  });

  /**
   * Story Add Story Autoexpanding textarea
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
}(jQuery));

function StoryAddStatusBindings(id) {
  (function($) {
    // Waggle story status <select>s
    $(id + ' select.change-status').bind('change', function(){
      var select = $(this);
      select.parents('ul').append('<li class="change-status-ajax"><em>saving...</em></li>');
      select.parents('li').hide();
      $.post('/waggle/api/story/status/' + select.parents('.node').attr('id').substring(5), 
        {'status': $(this).children('option:selected').val()},
        function(json){
          if (!json) {
            select.parents('li').find('.change-status-ajax em').text('error');
            return;
          }
          select.parents('ul').find('.change-status-ajax').remove();
          select.parents('li').show();
          select.blur();

          if (select.children('option:selected').val() == 2) {
            select.parents('li').removeClass('waggle-secondary');
          }
          else {
            select.parents('li').addClass('waggle-secondary');
          }
        }
      );
    });
    $(id + 'select.change-status').focus(function(){
      $(this).parents('.waggle-secondary').addClass('waggle-secondary-disabled').removeClass('waggle-secondary');
    }).blur(function(){
      $(this).parents('.waggle-secondary-disabled').addClass('waggle-secondary').removeClass('waggle-secondary-disabled');
    });
  }(jQuery));
}

function StoryAddUserBindings(selector, input){
  (function($){
    $(selector + ' a').click(function(){
      var classes = $(this).attr('class').split(' '),
          nid = classes[2].substring(5),
        uid = classes[1].substring(5),
        container = $(this);

      // If there are no current associated users, need to add the container.
      if ($('#node-' + nid + ' .field-name-field-associated-users').length == 0) {
        $('#node-' + nid + ' .add-user-wrapper').after('<div class="field field-name-field-associated-users field-type-user-reference field-label-hidden"><div class="field-items"></div></div>');
      }

      $('#node-' + nid + ' .field-name-field-associated-users').children(':first').append('<span class="waiting">saving...</span>');
        $.post('waggle/api/story/add-user/' + nid,{'uid' : uid}, function(json) {
          if (json != 0) {
            $('#node-' + nid + ' .field-name-field-associated-users').children(':first').append(json);
            $('#node-' + nid + ' .field-name-field-associated-users .waiting').remove();
          StoryCurrentUserBindings('#node-' + nid + ' .field-name-field-associated-users .profile');
        }
      });
      $(this).parents('.add-user-wrapper').find('a.add-user-link').click();
      $(this).parents('.add-user-wrapper').find('input').val('');
        return false;
    });
  }(jQuery));
}

function StoryCurrentUserBindings(selector){
  (function($){
    $(selector).hover(function(){
      $(this).find('.associated-user-info').css('display', 'block');
    }, function(){
      $(this).find('.associated-user-info').css('display', 'none');
    });
    
    $(selector + ' a.remove-user').click(function(){
      var classes = $(this).attr('class').split(' '),
        nid = $(this).parents('.node').attr('id').substring(5),
        uid = classes[1].substring(5),
        container = $(this).parents('.profile');
      $.post('waggle/api/story/remove-user/' + nid,{'uid' : uid}, function(json) {
        container.remove();
      });
      $(this).parents('.associated-user-info').remove();
    });
  }(jQuery));
}

function StoryAddTagBindings(selector, input){
  (function($){
    $(selector + ' a').click(function(){
      var classes = $(this).attr('class').split(' '),
        nid = classes[2].substring(5),
        tid = classes[1].substring(4),
        container = $(this);

      // If there are no current associated users, need to add the container.
      if ($('#node-' + nid + ' .field-name-field-tags').length == 0) {
        $('#node-' + nid + ' .story-tags-wrapper').prepend('<div class="field field-name-field-tags field-type-taxonomy-term-reference field-label-hidden"><ul class="links"></ul></div>');
      }

      $('#node-' + nid + ' .field-name-field-tags').children(':first').append('<li class="waiting">saving...</li>');
        $.post('waggle/api/story/add-tag/' + nid,{'tid' : tid}, function(json) {
          if (json != 0) {
            container.remove();
            $('#node-' + nid + ' .field-name-field-tags').children(':first').append(json);
            $('#node-' + nid + ' .field-name-field-tags .waiting').remove();
            StoryCurrentTagBindings('#node-' + nid + ' .field-name-field-tags li');
        }
      });
      $(this).html('');
      $(this).parents('.story-tags-wrapper').find('input').val('').blur();
        return false;
    });
  }(jQuery));
}

function StoryCurrentTagBindings(selector){
  (function($){
    $(selector).hover(function(){
      $(this).find('.tag-term-info').css('display', 'block');
    }, function(){
      $(this).find('.tag-term-info').css('display', 'none');
    });
    
    $(selector + ' a.remove-tag').click(function(){
      var nid = $(this).parents('.node').attr('id').substring(5),
        tid = $(this).parents('.tag-term-info').data('tid'),
        container = $(this).parents('li');
      $.post('waggle/api/story/remove-tag/' + nid,{'tid' : tid}, function(json) {
        container.remove();
      });
      $(this).parents('.tag-term-info').remove();
      return false;
    });
  }(jQuery));
}

function SidebarAutocompleteBindings(container, input){
  (function($){
    // Users
    $(container + ' a.user-candidate').click(function(){
      var classes = $(this).attr('class').split(' '),
        uid = classes[1].substring(5);
        
      var value = $(input).val(),
        parts = value.split(' ');

      parts[parts.length - 1] = '@' + users[uid]['linkblue'] + ' ';
      $(input).val(parts.join(' '));
      $(input).focus();

      $(container).html('');
        return false;
    });

    // Tags
    $(container + ' a.tag-candidate').click(function(){
      var classes = $(this).attr('class').split(' '),
        tid = classes[1].substring(4);
        
      var value = $(input).val(),
        parts = value.split(' ');

      parts[parts.length - 1] = '#' + tags[tid]['name'] + ' ';
      $(input).val(parts.join(' '));
      $(input).focus();

      $(container).html('');
        return false;
    });
  }(jQuery));
}
