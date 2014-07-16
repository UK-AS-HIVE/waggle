<?php

/**
 *  Contents of close_times block.
 */
function waggle_vis_close_times() {
  $output = '<svg id="waggle-vis-close-times" width="690" height="300">';

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
  for ($i = 1; $i < 45; ++$i) {
    $upper_bound = 24*3600*$i; //pow(2,$i);
    $time_to_close_ranges[] = 'is_time_to_close:[' . $lower_bound . ' TO ' . $upper_bound . ']';
    $lower_bound = $upper_bound;
  }
  $time_to_close_ranges[] = 'is_time_to_close:[' . $lower_bound . ' TO *]';

  $close_times = $connection->makeServletRequest('select',
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

  $data = drupal_json_decode(str_replace('NaN','null',$close_times->data));
  dpm($data, 'close_times data');

  $fieldMap = $server->getFieldNames($index);

  //dpm($fieldMap);

  //$entity_info = entity_get_info('node');
  //dpm($entity_info);

  $options = $index->getFields(FALSE, TRUE);
  //dpm($options, 'search index options');

  $i = 0;
  $max = 1;
  foreach ($data['facet_counts']['facet_queries'] as $q => $count) {
    if ($count > $max) $max = $count;
  }

  $height_scale = 265.0/$max;

  foreach ($data['facet_counts']['facet_queries'] as $q => $count) {
    //$upper_bound = waggle_vis_close_times_format_timespan(24*3600*$i/*pow(2,$i)*/);
    $i++;
    /*$output .= 'Day ' . $i . ': ' . $count . '<br/>';*/
    $output .= "<rect fill=\"#0070b3\" x=\"" . (20+14*$i) . "\" y=\"" . (275 -  $count*$height_scale) . "\" width=\"8\" height=\"" . ($count*$height_scale) . "\" />";
    $output .= '<text x="' . (20+14*$i+4) . '" y="285" text-anchor="middle" style="font-size: 9px;">' . $i . '</text>';
  }

  $output .= '<text x="10" y="10" text-anchor="middle" alignment-baseline="middle" style="font-size: 9px;">' . $max . '</text>';

  $output .= '</svg>';
  return $output;
}

function waggle_vis_close_times_format_timespan($timespan_in_seconds) {
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

