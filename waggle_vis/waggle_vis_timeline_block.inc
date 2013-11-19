<?php
/**
 *  Contents of timeline block.
 */
function waggle_vis_timeline() {
  drupal_add_css(drupal_get_path('module', 'waggle_vis') . '/waggle_vis.css');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/timeline.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/d3.v3/d3.v3.min.js');

  $output = '<div id="waggle-vis-timeline">';

  // Custom request, as suggested at https://drupal.org/node/1999396
  $server = search_api_index_get_server(search_api_index_load('default_node_index'));

  $connection = $server->getSolrConnection();
  $sStart = 'NOW/DAY-6MONTH';
  $sEnd = 'NOW/DAY';
  $iDayStep = 7;
  $sGap = '+' . $iDayStep . 'DAY'; //only use days for now! timeline.js needs to know gap in days
  $sRange = ($sStart . ' TO ' . $sEnd);
  $dateFQ = 'ds_created:[' . $sRange . ']';

  $ws = isset($_GET['ws'])?$_GET['ws']:'';
  $searchFQ = waggle_search_convert_to_fq($ws);

  //Construct the bigFQ for all queries
  $bigFQ = '';
  if ($searchFQ != ' ')
  {
    $bigFQ .= $searchFQ . ' ' . $dateFQ;
  }
  else
  {
    $bigFQ .= $dateFQ;
  }
  
  //check permissions of user vs permissions of query
  global $user;
  $userGrants = node_access_grants('view', $user); //user is drupal global
  $userGrantAddedFQ = ' (';
  foreach ($userGrants as $realm => $gids)
  {
    foreach ($gids as $gid)
    {
      $userGrantAddedFQ .= "sm_search_api_access_node:\"node_access_$realm:$gid\" OR ";
    }
  }
  $userGrantAddedFQ .= 'sm_search_api_access_node:"node_access__all")';
  $bigFQ .= $userGrantAddedFQ;

  //1a. Facet by tag.
  $asrTags = $connection->makeServletRequest('select',
    array(
      'rows' => 0,
      'show' => 'index',
      'fq' => $bigFQ,
      'facet' => 'on',
      'facet.field' => 'sm_field_tags:name',
      'f.sm_field_tags:name.facet.limit' => '25',
      'debugQuery' => 'on',
    )
  );
  $aTags = (array)($asrTags->facet_counts->facet_fields);
  $aTags = (array)($aTags['sm_field_tags:name']);

  //1b. Now facet by date, filtered by tag, and put those inside the tags in JSON.
  $aTagsByDate = array();
  foreach ($aTags as $sTag => $iTag_count) {
    $asrDatesOnTag = $connection->makeServletRequest('select',
      array(
      'rows' => 0,
      'qf' => 'dismax',
      'show' => 'index',
      'fq' => '+sm_field_tags\:name:' . $sTag . ' +(' . $bigFQ . ')',
      'facet' => 'on',
      'facet.date' => 'ds_created',
      'facet.date.other' => 'between',
      'facet.date.start' => $sStart,
      'facet.date.end' => $sEnd,
      'facet.date.gap' => $sGap,
      'facet.date.hardend' => 'true',
      'debugQuery' => 'on',
      )
    );
    $aDatesCreated = (array)($asrDatesOnTag->facet_counts->facet_dates->ds_created);
    $aTagsByDate[$sTag] = $aDatesCreated;
  }
  
  //2a. Facet by date
  $asrDates = $connection->makeServletRequest('select',
    array(
      'rows' => 0,
      'show' => 'index',
      'fq' => $bigFQ,
      'facet' => 'on',
      'facet.date' => 'ds_created',
      'facet.date.start' => $sStart,
      'facet.date.end' => $sEnd,
      'facet.date.other' => 'between',
      'facet.date.gap' => $sGap,
      'facet.date.hardend' => 'true'
      )
    );
  $aDates = (array)($asrDates->facet_counts->facet_dates->ds_created);

  $aData = array("Tags" => $aTagsByDate, "Total by Tags" => $aTags, "Total by Dates" => $aDates, "search" => $ws, "span" => $iDayStep);

  $output .= '<script>var HTMLEtimelineData = ' . json_encode($aData) . '</script>';
  $output .= '</div>';

  return $output;
}