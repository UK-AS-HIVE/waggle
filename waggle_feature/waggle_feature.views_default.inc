<?php
/**
 * @file
 * waggle_feature.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function waggle_feature_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'story_search_test';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'search_api_index_default_node_index';
  $view->human_name = 'Story Search';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['css_class'] = 'view-accordion-view';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'role';
  $handler->display->display_options['access']['role'] = array(
    2 => '2',
  );
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'infinite_scroll';
  $handler->display->display_options['pager']['options']['items_per_page'] = '20';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['pager']['options']['id'] = '50';
  $handler->display->display_options['pager']['options']['quantity'] = '9';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'entity';
  $handler->display->display_options['row_options']['view_mode'] = 'search_result';
  /* Header: Global: Result summary */
  $handler->display->display_options['header']['result']['id'] = 'result';
  $handler->display->display_options['header']['result']['table'] = 'views';
  $handler->display->display_options['header']['result']['field'] = 'result';
  $handler->display->display_options['header']['result']['empty'] = TRUE;
  $handler->display->display_options['header']['result']['content'] = '@total stories';
  /* Header: Global: Text area */
  $handler->display->display_options['header']['area']['id'] = 'area';
  $handler->display->display_options['header']['area']['table'] = 'views';
  $handler->display->display_options['header']['area']['field'] = 'area';
  $handler->display->display_options['header']['area']['label'] = 'Add PHP';
  $handler->display->display_options['header']['area']['empty'] = TRUE;
  $handler->display->display_options['header']['area']['content'] = '<?php
drupal_add_js(drupal_get_path(\'theme\', \'waggle_theme\') . \'/js/waggleAccordion.js\');
drupal_add_js(drupal_get_path(\'module\', \'waggle\') . \'/js/autocomplete.js\');
?>';
  $handler->display->display_options['header']['area']['format'] = 'php_code';
  /* No results behavior: Global: Text area */
  $handler->display->display_options['empty']['area']['id'] = 'area';
  $handler->display->display_options['empty']['area']['table'] = 'views';
  $handler->display->display_options['empty']['area']['field'] = 'area';
  $handler->display->display_options['empty']['area']['empty'] = TRUE;
  $handler->display->display_options['empty']['area']['content'] = 'No stories match your current search!

';
  $handler->display->display_options['empty']['area']['format'] = 'filtered_html';
  /* Field: Indexed Node: Node ID */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['exclude'] = TRUE;
  $handler->display->display_options['fields']['nid']['link_to_entity'] = 0;
  /* Field: Indexed Node: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['link_to_entity'] = 0;
  /* Field: Content: Link */
  $handler->display->display_options['fields']['view_node']['id'] = 'view_node';
  $handler->display->display_options['fields']['view_node']['table'] = 'views_entity_node';
  $handler->display->display_options['fields']['view_node']['field'] = 'view_node';
  /* Field: Indexed Node: On this story */
  $handler->display->display_options['fields']['field_associated_users']['id'] = 'field_associated_users';
  $handler->display->display_options['fields']['field_associated_users']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['field_associated_users']['field'] = 'field_associated_users';
  $handler->display->display_options['fields']['field_associated_users']['label'] = 'Associated Users';
  $handler->display->display_options['fields']['field_associated_users']['link_to_entity'] = 1;
  $handler->display->display_options['fields']['field_associated_users']['view_mode'] = 'full';
  /* Field: Indexed Node: Due Date */
  $handler->display->display_options['fields']['field_due_date']['id'] = 'field_due_date';
  $handler->display->display_options['fields']['field_due_date']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['field_due_date']['field'] = 'field_due_date';
  $handler->display->display_options['fields']['field_due_date']['settings'] = array(
    'format_type' => 'long',
    'fromto' => 'both',
    'multiple_number' => '',
    'multiple_from' => '',
    'multiple_to' => '',
  );
  /* Field: The main body text: Text (indexed) */
  $handler->display->display_options['fields']['body_value']['id'] = 'body_value';
  $handler->display->display_options['fields']['body_value']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['body_value']['field'] = 'body_value';
  $handler->display->display_options['fields']['body_value']['alter']['max_length'] = '300';
  $handler->display->display_options['fields']['body_value']['alter']['trim'] = TRUE;
  $handler->display->display_options['fields']['body_value']['alter']['html'] = TRUE;
  $handler->display->display_options['fields']['body_value']['link_to_entity'] = 1;
  /* Field: Search: Relevance */
  $handler->display->display_options['fields']['search_api_relevance']['id'] = 'search_api_relevance';
  $handler->display->display_options['fields']['search_api_relevance']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['search_api_relevance']['field'] = 'search_api_relevance';
  $handler->display->display_options['fields']['search_api_relevance']['link_to_entity'] = 0;
  /* Field: Indexed Node: Tags */
  $handler->display->display_options['fields']['field_tags']['id'] = 'field_tags';
  $handler->display->display_options['fields']['field_tags']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['field_tags']['field'] = 'field_tags';
  $handler->display->display_options['fields']['field_tags']['link_to_entity'] = 1;
  $handler->display->display_options['fields']['field_tags']['view_mode'] = 'full';
  /* Field: Indexed Node: On this story */
  $handler->display->display_options['fields']['field_associated_users_1']['id'] = 'field_associated_users_1';
  $handler->display->display_options['fields']['field_associated_users_1']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['field_associated_users_1']['field'] = 'field_associated_users';
  $handler->display->display_options['fields']['field_associated_users_1']['label'] = 'Associated Users';
  $handler->display->display_options['fields']['field_associated_users_1']['link_to_entity'] = 1;
  $handler->display->display_options['fields']['field_associated_users_1']['view_mode'] = 'full';
  /* Field: Content: Rendered Node */
  $handler->display->display_options['fields']['rendered_entity']['id'] = 'rendered_entity';
  $handler->display->display_options['fields']['rendered_entity']['table'] = 'views_entity_node';
  $handler->display->display_options['fields']['rendered_entity']['field'] = 'rendered_entity';
  /* Sort criterion: Indexed Node: Date created */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Indexed Node: Content type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'story' => 'story',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['defaults']['hide_admin_links'] = FALSE;
  $handler->display->display_options['path'] = 'story-search';
  $export['story_search_test'] = $view;

  return $export;
}
