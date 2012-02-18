<?php
/**
 * @file views-view-fields.tpl.php
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->content: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->wrapper_prefix: A complete wrapper containing the inline_html to use.
 *   - $field->wrapper_suffix: The closing tag for the wrapper.
 *   - $field->separator: an optional separator that may appear before a field.
 *   - $field->label: The wrap label text to use.
 *   - $field->label_html: The full HTML of the label to use including
 *     configured element type.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
//Description
$content = strip_tags($fields['body']->content);
$summary = explode(' ', substr($content, 0, 150));
array_pop($summary);
$summary = implode(' ', $summary);
$othertext = substr($content, strlen($summary));
$description = '<span class="story-summary">' . $summary . '</span><span class="summary-ellipsis">...</span><span class="story-othertext"> ' . $othertext . '</span>';

// Tagged Users
$uids = array();
preg_match_all('/\d+/', $fields['field_associated_users']->content, $uids);
$uids = reset($uids);
$associated_users = '';
$included = array();

global $user;
$account = user_load($user->uid);
$user_picture = '<img src="' . (!empty($account->picture) ? file_create_url($account->picture->uri) : drupal_get_path('module', 'waggle') . '/default_user.png') . '"/>';

foreach($uids as $uid) {
  if(!in_array($uid, $included)){
    $included[] = $uid;
	$account = user_load($uid);
	if(!$account){
	  continue;
	}
	$picture = '<img src="' . (empty($account->picture) ? drupal_get_path('module', 'waggle') . '/default_user.png' : file_create_url($account->picture->uri)) . '" alt="' . $account->name . '"/>';
	$name = array();
	if(!empty($account->field_name)){
	  foreach($account->field_name['und']['0'] as $part){
	    if(!empty($part)){
		  $name[] = $part;
		}
	  }
	}
	$name = implode(' ', $name);
	$roll_over = 
	  '<div class="associated-user-rollover">' .
	    '<div class="picture">' . $picture . '</div>' . 
		'<div class="name">' . $name . '</div>' . 
		'<div class="linkblue">' . $account->name . '</div>' . 
		'<a class="remove-user user-' . $uid . ' node-' . $fields['nid']->content . '" href="">Unassociate</a>' .
	  '</div>';
	$associated_users .= '<div class="associated-user user-' . $uid . '"><div class="small-picture">' . $picture . '</div>' . $roll_over . '</div>';
  }
}

//Add users
$add_users = '<div class="associated-user-rollover"><div class="user-list">';
$new_uids = db_select('users', 'u');
if(!empty($uids))
  $new_uids->condition('u.uid', $uids, 'NOT IN');
$new_uids = $new_uids->condition('u.uid', 1, '<>')
  ->condition('u.uid', 0, '<>')
  ->fields('u', array('uid'))
  ->range(0, 3)
  ->orderRandom()
  ->execute()
  ->fetchCol();
foreach($new_uids as $uid){
  $account = user_load($uid);
  if(!$account){
    continue;
  }
  $picture = '<img src="' . (empty($account->picture) ? drupal_get_path('module', 'waggle') . '/default_user.png' : file_create_url($account->picture->uri)) . '" alt="' . $account->name . '"/>';
  $name = array();
  if(!empty($account->field_name)){
	foreach($account->field_name['und']['0'] as $part){
	  if(!empty($part)){
	    $name[] = $part;
	  }
	}
  }
  $name = implode(' ', $name);
  $add_users .= 
    '<a class="user-candidate user-' . $uid . ' node-' . $fields['nid']->content . '">' .
	  '<span class="picture">' . $picture . '</span>' .
	  '<span class="name">' . $name . '</span>' . 
	  '<span class="linkblue">' . $account->name . '</span>' .
	'</a>';
}
$add_users .= '</div><div class="add-user-search"><input type="text" class="node-' . $fields['nid']->content . '"/></div></div>'


?>
<div class="story unaltered" id="story-<?php print $fields['nid']->content;?>">
  <div class="story-cover"></div>
  <div class="story-header">
    <div class="date"><?php print $fields['created']->content;?></div>
    <div class="story-hives"></div>
  </div>
  <div class="story-author">
    <div class="user-image"><?php print $fields['picture']->content;?></div>
    <div class="user-name"><?php print $fields['field_name']->content . ' ' . $fields['name']->content;?></div>
  </div>
  <div class="story-description clearfix"><?php print $description;?></div>
  <div class="story-notes">
    <div class="current-notes">
      <?php print views_embed_view('waggle_story_actions', 'block', $fields['nid']->content);?>
    </div>
    <div class="new-note clearfix">
      <div class="story-current-user"><?php print $user_picture;?></div>
      <div class="new-note-form-wrapper">
        <form name="new-note-form-<?php print $fields['nid']->content;?>" class="new-note-form">
          <div class="autocomplete"></div>
          <div class="expandingArea new-note-text">
            <pre><span></span><br/></pre>
            <textarea id="note-text-<?php print $fields['nid']->content;?>" onkeypress="microsyntaxCheck(event);"></textarea>
          </div>
          <input class="note-submit" type="submit" name="submit" value="Add Note" id="note-submit-<?php print $fields['nid']->content;?>"/>
        </form>
      </div>
    </div>
  </div>
  <div class="story-footer">
    <div class="story-attachments"></div>
    <div class="associated-users">
	  <div class="add-associated-user">
	    <a class="add-button">+</a>
		<?php print $add_users; ?>
	  </div>
	  <div class="current-associated-users"><?php print $associated_users; ?></div>
	</div>
    <div class="story-number"><?php print $fields['nid']->content;?></div>
  </div>
</div>
