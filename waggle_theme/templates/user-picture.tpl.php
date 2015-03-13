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

$departments = $office = $mail = '';

if (!empty($account->field_department)) {
  foreach ($account->field_department['und'] as $values) {
    if (!empty($values['safe_value'])) {
      $departments .= (empty($departments) ? '' : ', ') . $values['safe_value'];
    }
  }
}
if (!empty($account->field_office)) {
  if (!empty($account->field_office['und'][0]['safe_value'])) {
    $office = $account->field_office['und'][0]['safe_value'];
  }
}
if (!empty($account->field_mail)) {
  if (!empty($account->field_mail['und'][0]['safe_value'])) {
    $mail = $account->field_mail['und'][0]['safe_value'];
  }
}
?>

<div class="user-picture user-picture-<?php print $account->uid; ?>">
  <div class="user-picture-hover">
    <div class="name"><?php print $name; ?></div>
    <div class="email"><?php print $mail; ?></div>
    <div class="departments"><?php print $departments; ?></div>
    <div class="office"><?php print $office; ?></div>
  </div>
  <img src="<?php print $url; ?>" alt="<?php print $name; ?>'s photo" title="<?php print $name; ?>"/>
</div>