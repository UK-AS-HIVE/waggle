<?php

/**
 *  Implement hook_permission().
 */
function waggle_permission() {
  return array(
    'access all stories' => array(
      'title' => t('Access all stories'),
    ),
    'access departmental user stories' => array(
      'title' => t('Access departmental user stories'),
      'description' => t('Grants access to any story submitted by a user in the same department'),
    ),
  );
}

/**
 *  Implement hook_node_access().
 */
function waggle_node_access($node, $op, $account) {
  if ($op != 'view' && $op != 'update')
    return;

  if ($node->uid == $account->uid
    || user_access('access all stories', $account)) {
    return NODE_ACCESS_IGNORE;
  }


  // Grant access to departmental managers.
  if (user_access('access departmental user stories', $account)) {
    //watchdog('waggle', 'node: <pre>' . print_r($node,TRUE) . '</pre>');
    //watchdog('waggle', 'account: <pre>' . print_r($account,TRUE) . '</pre>');
    $owner = user_load($node->uid);
    $a = array_map(function($i) { return $i['value']; }, array_pop($owner->field_department));
    $account = user_load($account->uid);
    $b = array_map(function($i) { return $i['value']; }, array_pop($account->field_department));
    /*watchdog('waggle', 'nid: ' . $node->nid . '   $a: ' . print_r($a,TRUE));
    watchdog('waggle', 'nid: ' . $node->nid . '   $b: ' . print_r($b,TRUE));*/
    $intersection = array_intersect($a, $b);
    if (!empty($intersection)) {
      return NODE_ACCESS_ALLOW;
    }
  }

  // Grant access only to associated users.
  foreach ($node->field_associated_users as $lang => $user_map) {
    foreach ($user_map as $associated_user) {
      if ($associated_user['uid'] == $account->uid)
        return NODE_ACCESS_ALLOW;
    }
  }

  // Grant also to associated roles.
  foreach ($node->field_role_visibility as $lang => $roles_granted) {
    foreach ($roles_granted as $rgk => $role) {
      foreach ($account->roles as $rid => $user_role) {
        if ($rid == $role['value']) {
          return NODE_ACCESS_ALLOW;
        }
      }
    }
  }

  return NODE_ACCESS_DENY;
}

/**
 *  Implement hook_node_grants().
 */
function waggle_node_grants($account, $op) {
  $grants = array();
  if ($op == 'view' || $op == 'update') {
    if (user_access('access all stories', $account)) {
      $grants['waggle_all_stories'] = array(0);
    } else {
      $grants['waggle_story'] = array($account->uid);
      $grants['waggle_own_story'] = array($account->uid);
      $grants['waggle_role_story'] = array();
      $account = user_load($account->uid);
      foreach ($account->roles as $rid => $role) {
        $grants['waggle_role_story'][] = $rid;
      }
      if (user_access('access departmental user stories', $account)) {
        $grants['waggle_department'] = array();
        foreach ($account->field_department_term['und'] as $dep_tid) {
          $grants['waggle_department'][] = $dep_tid['tid'];
        }
      }
    }
  }
  return $grants;
}

/**
 *  Implement hook_node_access_records().
 */
function waggle_node_access_records($node) {
  if ($node->type == 'story') {
    if (isset($node->field_associated_users['und'])) {
      foreach ($node->field_associated_users['und'] as $delta => $account) {
        if (isset($account['uid'])) {
          $grants[] = array(
            'realm' => 'waggle_story',
            'gid' => $account['uid'],
            'grant_view' => $node->status,
            'grant_update' => 1,
            'grant_delete' => 0,
            'priority' => 1,
          );
        }
      }
    }
    if (isset($node->field_role_visibility['und'])) {
      foreach ($node->field_role_visibility['und'] as $delta => $role) {
        if (isset($role)) {
          $grants[] = array(
            'realm' => 'waggle_role_story',
            'gid' => $role,
            'grant_view' => $node->status,
            'grant_update' => 1,
            'grant_delete' => 0,
            'priority' => 1,
          );
        }
      }
    }

    if ($node->uid != 0) {
      $grants[] = array(
        'realm' => 'waggle_own_story',
        'gid' => $node->uid,
        'grant_view' => $node->status,
        'grant_update' => 1,
        'grant_delete' => 0,
        'priority' => 1,
      );

      $owner_account = user_load($node->uid);
      if (isset($owner_account->field_department_term['und'])) {
        foreach ($owner_account->field_department_term['und'] as $delta => $department_term) {
          if (isset($department_term)) {
            $grants[] = array(
              'realm' => 'waggle_department',
              'gid' => $department_term['tid'],
              'grant_view' => $node->status,
              'grant_update' => 1,
              'grant_delete' => 0,
              'priority' => 1,
            );
          }
        }
      }
    }

    $grants[] = array(
      'realm' => 'waggle_all_stories',
      'gid' => 0,
      'grant_view' => 1,
      'grant_update' => 1,
      'grant_delete' => 0,
      'priority' => 1,
    );
 
    return $grants;
  }
}

