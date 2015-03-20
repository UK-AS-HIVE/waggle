<?php
/**
 * @file
 * waggle_feature.features.fe_block_settings.inc
 */

/**
 * Implements hook_default_fe_block_settings().
 */
function waggle_feature_default_fe_block_settings() {
  $export = array();

  $export['version'] = '2.0';

  $export['facetapi-2EHMX1BF7ZvtCpml0F5RsDt7rdRmYuOG'] = array(
    'cache' => -1,
    'delta' => '2EHMX1BF7ZvtCpml0F5RsDt7rdRmYuOG',
    'module' => 'facetapi',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => 'sidebar_second',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
  );

  $export['facetapi-EWMrfXzc0aclsb9zLp1pxZ6iIw8T1PZg'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'EWMrfXzc0aclsb9zLp1pxZ6iIw8T1PZg',
    'module' => 'facetapi',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => 'sidebar_second',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['facetapi-T0oz9cDw4tn4UqW3tpwJOYHVjq5ezBAI'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'T0oz9cDw4tn4UqW3tpwJOYHVjq5ezBAI',
    'module' => 'facetapi',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => 'sidebar_second',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['facetapi-oVFY400V10Veh547A69ZXh0DD16pxzT9'] = array(
    'cache' => -1,
    'delta' => 'oVFY400V10Veh547A69ZXh0DD16pxzT9',
    'module' => 'facetapi',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => 'sidebar_second',
        'status' => 0,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['search-form'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'form',
    'module' => 'search',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => 'sidebar_first',
        'status' => 1,
        'theme' => 'bartik',
        'weight' => -1,
      ),
      'seven' => array(
        'region' => 'dashboard_sidebar',
        'status' => 1,
        'theme' => 'seven',
        'weight' => -10,
      ),
      'waggle_theme' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['system-navigation'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'navigation',
    'module' => 'system',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => 'sidebar_first',
        'status' => 1,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['user-login'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'login',
    'module' => 'user',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => 'sidebar_first',
        'status' => 1,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => 'content',
        'status' => 1,
        'theme' => 'seven',
        'weight' => 10,
      ),
      'waggle_theme' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['views--exp-story_search_test-page'] = array(
    'cache' => -1,
    'custom' => 2,
    'delta' => '-exp-story_search_test-page',
    'module' => 'views',
    'node_types' => array(),
    'pages' => 'story-search',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'waggle_theme',
        'weight' => 0,
      ),
    ),
    'title' => 'Sort options',
    'visibility' => 1,
  );

  $export['waggle-waggle_add_story'] = array(
    'cache' => 1,
    'custom' => 0,
    'delta' => 'waggle_add_story',
    'module' => 'waggle',
    'node_types' => array(),
    'pages' => '',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => 'content',
        'status' => 1,
        'theme' => 'bartik',
        'weight' => -1,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => -1,
      ),
      'waggle_theme' => array(
        'region' => 'content',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => -1,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  $export['waggle_search-waggle_story_sidebar'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'waggle_story_sidebar',
    'module' => 'waggle_search',
    'node_types' => array(),
    'pages' => '<front>
story-search
dashboard',
    'roles' => array(
      'authenticated user' => 2,
    ),
    'themes' => array(
      'bartik' => array(
        'region' => 'sidebar_second',
        'status' => 1,
        'theme' => 'bartik',
        'weight' => -1,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => -1,
      ),
      'waggle_theme' => array(
        'region' => 'sidebar_second',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => -1,
      ),
    ),
    'title' => '',
    'visibility' => 1,
  );

  $export['waggle_vis-waggle_vis_timeline'] = array(
    'cache' => -1,
    'custom' => 0,
    'delta' => 'waggle_vis_timeline',
    'module' => 'waggle_vis',
    'node_types' => array(),
    'pages' => 'dashboard',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'bartik',
        'weight' => 0,
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => 0,
      ),
      'waggle_theme' => array(
        'region' => 'content',
        'status' => 1,
        'theme' => 'waggle_theme',
        'weight' => -1,
      ),
    ),
    'title' => '',
    'visibility' => 0,
  );

  return $export;
}
