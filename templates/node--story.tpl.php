<?php

/**
 * @file
 * Bartik's theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined, e.g. $node->body becomes $body. When needing to access
 * a field's raw values, developers/themers are strongly encouraged to use these
 * variables. Otherwise they will have to explicitly specify the desired field
 * language, e.g. $node->body['en'], thus overriding any language negotiation
 * rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 */

global $user;
//$content['comments'] = comment_node_page_additions($node);
$content['comments'] = waggle_tracker_comment_node_page_additions($node);
//$content['waggle_tracker'] = waggle_tracker_node_page_additions($node);

?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <div class="story-head clearfix">
    <div class="top-right-corner">
      <?php if (isset($node->field_attachments['und']) && count($node->field_attachments['und']) > 0): ?>
        <span>
	  <i class="icon-paper-clip"></i><?php echo count($node->field_attachments['und']); ?>
        </span>
      <?php endif; ?>

      <?php
        if (!empty($node->field_role_visibility)):
          $roles = user_roles();
      ?>
        <span title="This story is only visible to the listed roles.  Expand story details to edit the role visibility settings.">
          <i class="icon-lock"></i> 
      <?php
          //print_r($node->field_role_visibility);

          $rv = array();
          foreach ($node->field_role_visibility['und'] as $r) {
            $rid = $r['value'];
            if (isset($roles[$rid])) {
              $rv[] = $roles[$rid];
            }
          }
          print implode(', ', $rv); ?>
      </span>
      <?php endif; ?>
      <div class="story-number">

        <?php print l('#' . $node->nid, '', array('query' => array('ws' => 'status:any id:' . $node->nid), 'attributes' => array('target' => '_blank'))); ?>
      </div>

      <div class="details waggle-secondary"><a>story details</a></div>


    </div>
    <div class="meta submitted">
      <?php print $user_picture; ?>
      <?php print $submitted; ?>
      <div class="time-ago"><?php print date('n/j/Y g:ia', $created) . '<br/>(' . date('n/j/Y g:ia', $created) . ')'; ?></div>
    </div>
  </div>

  <div class="content clearfix"<?php print $content_attributes; ?>>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      //hide($content['waggle_tracker']);
      hide($content['links']);
      hide($content['field_associated_users']);
      hide($content['field_status']);
      hide($content['body']);
      hide($content['field_tags']);
      if (isset($content['field_due_date'])) {
        hide($content['field_due_date']);
      }
    ?>
    <div class="story-extra-info" style="display: none;">
      <div class="clearfix"><div class="field field-label-inline">
        <div class="field-label">Submit time:</div>
        <div class="field-items"><div class="field-item">
          <?php print date('n/j/Y g:ia', $created); ?>
        </div></div>
      </div></div>
      <?php print render($content); ?>
      <div class="clearfix waggle-editable">
        <div class="waggle-editable-field">
        <?php if (!isset($content['field_due_date'])): ?>
          <div class="field field-name-field-due-date field-label-inline clearfix">
            <div class="field-label">Due date:</div>
            <div class="field-items"><div class="field-item">none</div></div>
          </div>
        <?php else: ?>
          <?php print render($content['field_due_date']); ?>
        <?php endif; ?>
        </div>
        <a class="waggle-edit-link edit-due-date-link">edit</a>
      </div>
    </div>

    <?php print render($content['body']); ?>
    <div class="story-tags-wrapper">
      <?php /*<div class="tags-label">Tags:</div>*/ ?>
      <?php print render($content['field_tags']); ?>
      <div class="add-tag-wrapper">
        <div class="add-tag">
          <a class="add-tag-link" title="Add a tag to this story.">+add a tag</a>
          <div class="add-tag-popup" >
            <input type="textfield" id="add-tag-node-<?php print $node->nid;?>"/>
            <div class="suggestions" style="display:none;"></div>
          </div>
        </div>
      </div>
    </div>
    
  </div>

  <?php
    // Remove the "Add new comment" link on the teaser page or if the comment
    // form is being displayed on the same page.
    if ($teaser || !empty($content['comments']['comment_form'])) {
      unset($content['links']['comment']['#links']['comment-add']);
    }
    // Only display the wrapper div if there are links.
    $links = render($content['links']);
    if ($links):
  ?>
    <div class="link-wrapper">
      <?php print $links; ?>
    </div>
  <?php endif; ?>

  <div class="story-comments" style="display: none;">
    <?php 
      //dpm($content['comments']);
      unset($content['comments']['comment_form']);
      print render($content['comments']); 
      //print render($content['waggle_tracker']);
    ?>
    <div class="story-new-comment-form">
      <?php print theme('user_picture', array('account' => $user)); ?>
      <div class="comment-arrow"></div>
      <textarea class="add-comment" id="add-comment-node-<?php print $node->nid;?>"></textarea>
      <div class="clearfix suggestions-wrapper"><div class="suggestions"></div></div>
      <div class="cc-comment-options" title="If checked, the story author will be sent an email update including the comment.  If unchecked, only associated users will be contacted."><input type="checkbox" checked="true" class="cc-author-checkbox" />CC Author</div>
      <div class="submit-comment-buttons">

        <input type="submit" value="Submit" class="submit-comment" id="submit-comment-node-<?php print $node->nid;?>">
      </div>
    </div>
  </div>

  <div class="story-info-footer clearfix">
      <div class="add-user-wrapper">
        <div class="add-user">
          <a class="add-user-link" title="Associate a user to this ticket">+</a>
          <div class="add-user-popup" >
            <input type="textfield" id="add-user-node-<?php print $node->nid;?>"/>
            <div class="suggestions" style="display:none;"></div>
          </div>
        </div>
      </div>
      <?php print render($content['field_associated_users']); ?>
      <div class="waggle-links">
        <ul>
          <?php if ($node->comment_count) : ?>
            <li>
              <div class="comment-count">
                <a class="comments"><?php print $node->comment_count . (($node->comment_count - 1) ? ' notes' : ' note'); ?></a>
              </div>
            </li>
          <?php else: ?>
            <li class="waggle-secondary">
              <a class="comments">add a note</a>
            </li>
          <?php endif; ?>

          <li class="change-status-wrapper">
            <?php 
              $terms = taxonomy_get_tree(3);
              $options = array();
              foreach ($terms as $term) {
                $options[$term->tid] = strtolower($term->name);
              }
              $default = '_none';
              if (!empty($node->field_status) && isset($options[$node->field_status['und'][0]['tid']])) {
                $default = $node->field_status['und'][0]['tid'];
              }
            ?>
            <select class="change-status">
              <?php 
                foreach ($options as $value => $label) {
                  print "<option value=\"$value\"";
                  if ($value == $default) {
                    print ' SELECTED';
                  }
                  print ">$label</option>";
                }
              ?>
            </select>
          </li>
        </ul>
      </div>
    </div>

</div>
