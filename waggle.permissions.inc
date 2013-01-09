<?php

/**
 *  Implement hook_permission().
 */
function waggle_permission() {
  return array(
    'access all stories' => array(
      'title' => t('Access all stories'),
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

  // grant access only to associated users
  foreach ($node->field_associated_users as $lang => $user_map) {
    foreach ($user_map as $associated_user) {
      if ($associated_user['uid'] == $account->uid)
        return NODE_ACCESS_ALLOW;
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
    }
  }
  return $grants;
}

/**
 *  Implement hook_node_access_records().
 */
function waggle_node_access_records($node) {
  if ($node->type == 'story') {
    if (isset($node->field_associated_users)) {
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
    $grants[] = array(
      'realm' => 'waggle_own_story',
      'gid' => $node->uid,
      'grant_view' => $node->status,
      'grant_update' => 1,
      'grant_delete' => 0,
      'priority' => 1,
    );
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

