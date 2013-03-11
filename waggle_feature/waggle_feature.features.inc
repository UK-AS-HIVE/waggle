<?php
/**
 * @file
 * waggle_feature.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function waggle_feature_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "facetapi" && $api == "facetapi_defaults") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function waggle_feature_views_api() {
  return array("api" => "3.0");
}

/**
 * Implements hook_image_default_styles().
 */
function waggle_feature_image_default_styles() {
  $styles = array();

  // Exported image style: small_square.
  $styles['small_square'] = array(
    'name' => 'small_square',
    'effects' => array(
      1 => array(
        'label' => 'Scale and crop',
        'help' => 'Scale and crop will maintain the aspect-ratio of the original image, then crop the larger dimension. This is most useful for creating perfectly square thumbnails without stretching the image.',
        'effect callback' => 'image_scale_and_crop_effect',
        'dimensions callback' => 'image_resize_dimensions',
        'form callback' => 'image_resize_form',
        'summary theme' => 'image_resize_summary',
        'module' => 'image',
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => '64',
          'height' => '64',
        ),
        'weight' => '1',
      ),
    ),
  );

  return $styles;
}

/**
 * Implements hook_node_info().
 */
function waggle_feature_node_info() {
  $items = array(
    'story' => array(
      'name' => t('Story'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}

/**
 * Implements hook_default_search_api_index().
 */
function waggle_feature_default_search_api_index() {
  $items = array();
  $items['default_node_index'] = entity_import('search_api_index', '{
    "name" : "Default node index",
    "machine_name" : "default_node_index",
    "description" : "An automatically created search index for indexing node data. Might be configured to specific needs.",
    "server" : "solr_server",
    "item_type" : "node",
    "options" : {
      "index_directly" : 0,
      "cron_limit" : "50",
      "data_alter_callbacks" : {
        "search_api_alter_bundle_filter" : {
          "status" : 1,
          "weight" : "-10",
          "settings" : { "default" : "0", "bundles" : { "story" : "story" } }
        },
        "search_api_alter_node_access" : { "status" : 1, "weight" : "0", "settings" : [] },
        "search_api_alter_node_status" : { "status" : 0, "weight" : "0", "settings" : [] },
        "search_api_alter_add_hierarchy" : { "status" : 0, "weight" : "0", "settings" : { "fields" : [] } },
        "search_api_alter_add_viewed_entity" : { "status" : 1, "weight" : "0", "settings" : { "mode" : "full" } },
        "search_api_alter_add_url" : { "status" : 0, "weight" : "0", "settings" : [] },
        "search_api_alter_add_aggregation" : {
          "status" : 1,
          "weight" : "0",
          "settings" : { "fields" : { "search_api_aggregation_1" : {
                "name" : "Full Story text Aggregated from most fields",
                "type" : "fulltext",
                "fields" : [
                  "nid",
                  "url",
                  "status",
                  "created",
                  "changed",
                  "author",
                  "field_associated_users",
                  "field_waiting",
                  "field_phone",
                  "field_hostname",
                  "field_user_category",
                  "field_due_date",
                  "field_submitted_by",
                  "field_closed_time",
                  "field_hr_id",
                  "field_contact",
                  "field_status",
                  "field_tags",
                  "field_ip_address",
                  "field_location",
                  "field_close_date",
                  "author:uid",
                  "author:name",
                  "author:mail",
                  "author:field_phone",
                  "author:field_department",
                  "body:value",
                  "field_associated_users:uid",
                  "field_associated_users:name",
                  "field_associated_users:mail",
                  "field_tags:name"
                ],
                "description" : "A Fulltext aggregation of the following fields: Node ID, URL, Status, Date created, Date changed, Author, On this story, Waiting on, Phone, Hostname, User Category, Due Date, Submitted by, Closed Time, hr_id, Contact, Status, Tags, IP address, Location, Close Date, Author \\u00bb User ID, Author \\u00bb Name, Author \\u00bb Email, Author \\u00bb Phone, Author \\u00bb Department, The main body text \\u00bb Text, On this story \\u00bb User ID, On this story \\u00bb Name, On this story \\u00bb Email, Tags \\u00bb Name."
              }
            }
          }
        }
      },
      "processors" : {
        "search_api_case_ignore" : {
          "status" : 1,
          "weight" : "0",
          "settings" : { "fields" : {
              "title" : true,
              "field_hostname" : true,
              "body:value" : true,
              "field_associated_users:name" : true
            }
          }
        },
        "search_api_html_filter" : {
          "status" : 1,
          "weight" : "10",
          "settings" : {
            "fields" : {
              "title" : true,
              "body:value" : true,
              "field_associated_users:field_department" : true
            },
            "title" : 0,
            "alt" : 1,
            "tags" : "h1 = 5\\r\\nh2 = 3\\r\\nh3 = 2\\r\\nstrong = 2\\r\\nb = 2\\r\\nem = 1.5\\r\\nu = 1.5"
          }
        },
        "search_api_tokenizer" : {
          "status" : 0,
          "weight" : "20",
          "settings" : {
            "fields" : {
              "title" : true,
              "body:value" : true,
              "field_associated_users:name" : true,
              "field_associated_users:field_department" : true,
              "field_tags:name" : true
            },
            "spaces" : "[^\\\\p{L}\\\\p{N}]",
            "ignorable" : "[-]"
          }
        },
        "search_api_stopwords" : {
          "status" : 0,
          "weight" : "30",
          "settings" : {
            "fields" : {
              "title" : true,
              "body:value" : true,
              "field_associated_users:field_department" : true
            },
            "file" : "",
            "stopwords" : "all\\r\\nalso\\r\\nand\\r\\nany\\r\\nare\\r\\nbut\\r\\ncan\\r\\ncannot\\r\\ncould\\r\\nfor\\r\\nfrom\\r\\nget\\r\\nhas\\r\\nhave\\r\\nhelp\\r\\nknow\\r\\nlike\\r\\nneed\\r\\nneeds\\r\\nnot\\r\\none\\r\\nout\\r\\nplease\\r\\nsome\\r\\nsomeone\\r\\nthank\\r\\nthanks\\r\\nthat\\r\\nthe\\r\\nthere\\r\\nthis\\r\\nuse\\r\\nwas\\r\\nwhen\\r\\nwill\\r\\nwith\\r\\nwork\\r\\nwould\\r\\nyou"
          }
        }
      },
      "fields" : {
        "nid" : { "type" : "integer" },
        "type" : { "type" : "string" },
        "title" : { "type" : "text" },
        "language" : { "type" : "string" },
        "status" : { "type" : "boolean" },
        "created" : { "type" : "date" },
        "changed" : { "type" : "date" },
        "author" : { "type" : "integer", "entity_type" : "user" },
        "comment_count" : { "type" : "integer" },
        "field_associated_users" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "user" },
        "field_hostname" : { "type" : "string" },
        "field_user_category" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "taxonomy_term" },
        "field_due_date" : { "type" : "date" },
        "field_submitted_by" : { "type" : "integer", "entity_type" : "user" },
        "field_status" : { "type" : "integer", "entity_type" : "taxonomy_term" },
        "field_tags" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "taxonomy_term" },
        "field_close_date" : { "type" : "date" },
        "search_api_language" : { "type" : "string" },
        "search_api_access_node" : { "type" : "list\\u003Cstring\\u003E" },
        "author:name" : { "type" : "text" },
        "author:field_office" : { "type" : "text" },
        "body:value" : { "type" : "text" },
        "field_associated_users:name" : { "type" : "list\\u003Cstring\\u003E" },
        "field_associated_users:field_department" : { "type" : "list\\u003Clist\\u003Cstring\\u003E\\u003E" },
        "field_associated_users:field_office" : { "type" : "list\\u003Ctext\\u003E" },
        "field_tags:name" : { "type" : "list\\u003Cstring\\u003E" },
        "search_api_aggregation_1" : { "type" : "text" }
      }
    },
    "enabled" : "1",
    "read_only" : "0",
    "rdf_mapping" : []
  }');
  return $items;
}

/**
 * Implements hook_default_search_api_server().
 */
function waggle_feature_default_search_api_server() {
  $items = array();
  $items['solr_server'] = entity_import('search_api_server', '{
    "name" : "Solr Server",
    "machine_name" : "solr_server",
    "description" : "",
    "class" : "search_api_solr_service",
    "options" : {
      "host" : "solr.as.uky.edu",
      "port" : "8997",
      "path" : "\\/solr",
      "http_user" : "",
      "http_pass" : "",
      "excerpt" : 0,
      "retrieve_data" : 0,
      "highlight_data" : 0,
      "http_method" : "POST"
    },
    "enabled" : "1",
    "rdf_mapping" : []
  }');
  return $items;
}
