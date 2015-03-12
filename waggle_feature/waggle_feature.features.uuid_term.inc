<?php
/**
 * @file
 * waggle_feature.features.uuid_term.inc
 */

/**
 * Implements hook_uuid_features_default_terms().
 */
function waggle_feature_uuid_features_default_terms() {
  $terms = array();

  $terms[] = array(
    'name' => 'To-do',
    'description' => '',
    'format' => 'filtered_html',
    'weight' => 0,
    'uuid' => '0eb7f695-0785-4e50-a721-5e53ce668893',
    'vocabulary_machine_name' => 'story_status',
  );
  $terms[] = array(
    'name' => 'Done',
    'description' => '',
    'format' => 'filtered_html',
    'weight' => 0,
    'uuid' => '1ec2fe28-86b4-440a-94e7-467c1995a739',
    'vocabulary_machine_name' => 'story_status',
  );
  $terms[] = array(
    'name' => 'In Progress',
    'description' => '',
    'format' => 'filtered_html',
    'weight' => 0,
    'uuid' => '1f5b2e92-fdad-4ded-8489-4d87a63fae13',
    'vocabulary_machine_name' => 'story_status',
  );
  return $terms;
}
