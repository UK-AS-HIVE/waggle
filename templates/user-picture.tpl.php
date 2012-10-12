<?php

/**
 * @file
 * Default theme implementation to present a picture configured for the
 * user's account.
 *
 * Available variables:
 * - $user_picture: Image set by the user or the site's default. Will be linked
 *   depending on the viewer's permission to view the user's profile page.
 * - $account: Array of account information. Potentially unsafe. Be sure to
 *   check_plain() before use.
 *
 * @see template_preprocess_user_picture()
 */
?>
<?php 
$name = $account->name;
if (!isset($account->field_name)) {
  $account = user_load($account->uid);
}
if (!empty($account->field_name)) {
  $name = implode(' ', array_filter($account->field_name['und'][0])) . ' (' . $name . ')';
}

if ($account->picture) {
  $url = file_create_url(file_load($account->picture->fid)->uri);
}
else {
  $url = drupal_get_path('module', 'waggle') . '/default_user.png';
}
?>

<div class="user-picture user-picture-<?php print $account->uid; ?>">
  <img src="<?php print $url; ?>" alt="<?php print $name; ?>'s photo" title="<?php print $name; ?>"/>
</div>