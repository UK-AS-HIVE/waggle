<?php

/**
 *  Contents of averages block.
 */
function waggle_vis_averages() {
  $output = '<div id="waggle-vis-averages">';

  $index = search_api_index_load('default_node_index');
  $server = search_api_index_get_server($index);

  $connection = $server->getSolrConnection();
  
  $ws = isset($_GET['ws'])?$_GET['ws']:'';
  $fq = waggle_search_convert_to_fq($ws);
  $fq .= waggle_search_facets_to_fq('default_node_index');
  global $user;
  $fq .= getSecurityCheckFQ($user);

  $averages = $connection->makeServletRequest('select',
    array(
      'fld=item_id,score',
      'rows' => 0,
      'wt' => 'json',
      'fq' => $fq,
      'stats' => 'true',
      'stats.field' => array(
        'is_time_to_close',
        'is_comment_count',
        'is_associated_user_count',
        'is_action_count',
      ),
      //'stats.facet' => 'sm_field_tags:name'
    )
  );

  //$output .= '<script>var waggleVisAverages = ' . $averages->data . ';</script>';

  $data = drupal_json_decode(str_replace('NaN','null',$averages->data));
  dpm($data, 'averages data');

  $fieldMap = $server->getFieldNames($index);

  //dpm($fieldMap);

  //$entity_info = entity_get_info('node');
  //dpm($entity_info);

  $options = $index->getFields(FALSE, TRUE);
  //dpm($options, 'search index options');

  foreach ($data['stats']['stats_fields'] as $field => $stats) {
    $field_label = $options['fields'][array_search($field, $fieldMap)]['name'];
    if ($field === 'is_time_to_close') {
      $output .= $field_label . ': ' . waggle_vis_averages_format_timespan($data['stats']['stats_fields'][$field]['mean']) . "<br/>\n";
    } else {
      $output .= $field_label . ': ' . ($data['stats']['stats_fields'][$field]['mean']) . "<br/>\n";
    }
  }

  $output .= '</div>';
  return $output;
}

function waggle_vis_averages_format_timespan($timespan_in_seconds) {
  $minutes = floor($timespan_in_seconds / 60);
  $seconds = $timespan_in_seconds - 60*$minutes;
  if ($minutes < 60) {
    return $minutes . ' minutes';
  }
  $hours = floor($minutes / 60);
  $minutes -= 60*$hours;
  if ($hours < 24) {
    return $hours . ' hours';
  }
  $days = floor($hours / 24);
  $hours -= 24*$days;
  if ($days < 7) {
    return $days . ' days, ' . $hours . ' hours';
  }
  $weeks = floor($days / 7);
  $days -= 7*$weeks;
  //return $timespan_in_seconds . ' seconds';
  return $weeks . ' weeks, ' . $days . ' days, ' . $hours . ' hours';
}

