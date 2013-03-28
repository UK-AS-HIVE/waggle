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

  // Exported permission: create field_groups.
  $permissions['create field_groups'] = array(
    'name' => 'create field_groups',
    'roles' => array(
      'administrator' => 'administrator',
      'anonymous user' => 'anonymous user',
    ),
    'module' => 'field_permissions',
  );

  // Exported permission: edit field_groups.
  $permissions['edit field_groups'] = array(
    'name' => 'edit field_groups',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'field_permissions',
  );

  // Exported permission: edit own field_groups.
  $permissions['edit own field_groups'] = array(
    'name' => 'edit own field_groups',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'field_permissions',
  );

  // Exported permission: view field_groups.
  $permissions['view field_groups'] = array(
    'name' => 'view field_groups',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'field_permissions',
  );

  // Exported permission: view own field_groups.
  $permissions['view own field_groups'] = array(
    'name' => 'view own field_groups',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'field_permissions',
  );

  return $permissions;
}
