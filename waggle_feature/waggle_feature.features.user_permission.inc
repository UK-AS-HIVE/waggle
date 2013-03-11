<?php
/**
 * @file
 * waggle_feature.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function waggle_feature_user_default_permissions() {
  $permissions = array();

  // Exported permission: access all stories.
  $permissions['access all stories'] = array(
    'name' => 'access all stories',
    'roles' => array(
      'staff' => 'staff',
    ),
    'module' => 'waggle',
  );

  return $permissions;
}
