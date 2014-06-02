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

  $time_to_close_ranges = array();
  $lower_bound = 0;
  for ($i = 0; $i < 17; ++$i) {
    $upper_bound = 3600*pow(2,$i);
    $time_to_close_ranges[] = 'is_time_to_close:[' . $lower_bound . ' TO ' . $upper_bound . ']';
    $lower_bound = $upper_bound;
  }
  $time_to_close_ranges[] = 'is_time_to_close:[' . $lower_bound . ' TO *]';

  $averages = $connection->makeServletRequest('select',
    array(
      'fld=item_id,score',
      'rows' => 0,
      'wt' => 'json',
      'fq' => $fq,
      'facet.query' => $time_to_close_ranges,
      'facet' => 'true',
      'facet.date' => 'ds_time_to_close',
      'facet.date.start' => '1970-1-1T00:00:00Z',
      'facet.date.end' => '1971-1-1T00:00:00Z',
      'facet.date.gap' => '+7DAY',
      'facet.date.other' => 'after',
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

  $i = 0;
  foreach ($data['facet_counts']['facet_queries'] as $q => $count) {
    $upper_bound = waggle_vis_averages_format_timespan(3600*pow(2,$i));
    $i++;
    $output .= 'Closed < ' . $upper_bound . ': ' . $count . '<br/>';
  }

  foreach ($data['stats']['stats_fields'] as $field => $stats) {
    $field_label = $options['fields'][array_search($field, $fieldMap)]['name'];
    if ($field === 'is_time_to_close') {
      $output .= $field_label . ': ' . waggle_vis_averages_format_timespan($data['stats']['stats_fields'][$field]['mean']) . ' (+/- ' . waggle_vis_averages_format_timespan($data['stats']['stats_fields'][$field]['stddev']) . ")<br/>\n";
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
  if ($weeks < 4) {
    return $weeks . ' weeks, ' . $days . ' days';
  }
  $months = floor ($weeks / 4);
  $weeks -= 4*$months;
  return $months . ' months, ' . $weeks . ' weeks';
  //return $timespan_in_seconds . ' seconds';

}

