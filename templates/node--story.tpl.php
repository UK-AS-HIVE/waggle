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

$content['comments'] = comment_node_page_additions($node);

?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
  <div class="story-head clearfix">
    <div class="top-right-corner">
      <div class="story-number"><?php print '#' . $node->nid;//print l('#' . $node->nid, 'node/' . $node->nid); 
      ?></div>

      <?php if ($node->comment_count) : ?>
        <div class="comment-count">
          <a class="comments"><?php print $node->comment_count . (($node->comment_count - 1) ? ' notes' : ' note'); ?></a>
        </div>
      <?php endif; ?>
    </div>
    <div class="meta submitted">
      <?php print $user_picture; ?>
      <?php print $submitted; ?>
      <div class="time-ago"><?php print ago($created); ?></div>
      <div class="details waggle-secondary"><a>story details</a></div>
    </div>
  </div>

  <div class="content clearfix"<?php print $content_attributes; ?>>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      hide($content['field_associated_users']);
      hide($content['field_status']);
      hide($content['body']);
    ?>
    <div class="story-extra-info" style="display: none;">
      <div class="clearfix"><div class="field field-label-inline">
        <div class="field-label">Submit time:</div>
        <div class="field-items"><div class="field-item">
          <?php print date('n/j/Y g:ia', $created); ?>
        </div></div>
      </div></div>
      <?php print render($content); ?>
    </div>

    <?php print render($content['body']); ?>
    
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
      print render($content['comments']); 
    ?>
  </div>

  <div class="story-info-footer clearfix">
      <div class="add-user-wrapper">
        <div class="add-user">
          <a class="add-user-link" title="Associate a user to this ticket">+</a>
          <div class="add-user-popup" >
            <input type="textfield" id="add-user-node-<?php print $node->nid;?>"/>
            <div class="suggestions"></div>
          </div>
        </div>
      </div>
      <?php print render($content['field_associated_users']); ?>
      <div class="waggle-links">
        <?php 
          // If the story is closed we don't want to hide the status
          $status_class = 'waggle-secondary';
          if (!empty($node->field_status) && $node->field_status['und'][0]['tid'] == 2) {
            $status_class = '';
          }
        ?>
        <ul>
          <li class="waggle-secondary"><a class="add-note">add a note</a></li>
          <li class="change-status-wrapper <?php print $status_class; ?>">
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
