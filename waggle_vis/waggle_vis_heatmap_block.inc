<?php
/**
 *  Contents of heatmap block.
 */
function waggle_vis_heatmap()
{
  drupal_add_css(drupal_get_path('module', 'waggle_vis') . '/css/waggle_vis_share.css'); //TODO: put this in it's own block
  //drupal_add_css(drupal_get_path('module', 'waggle_vis') . '/css/waggle_vis_heatmap.css');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/d3.v3/d3.v3.min.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/share.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/heatmap.js');
  
  $sOutput = '<div id="waggle-vis-heatmap">';

  $servSolr = search_api_index_get_server(search_api_index_load('default_node_index'));
  $connection = $servSolr->getSolrConnection();
  $sWordSearch = isset($_GET['ws']) ? $_GET['ws'] : '';
  $sStart = 'NOW/DAY-6MONTH';
  $sEnd = 'NOW/DAY';
  $sDateFQ = "ds_created:[$sStart TO $sEnd]";
  $iHourStart = 8;
  $iHourEnd = 19;
  $iDayStart = 0; //monday
  $iDayEnd = 6; //friday
  $sHourCreatedFQ = "is_hour_created:[$iHourStart TO $iHourEnd]";
  $output .= '<p>hello!</p>';
  $sBigFQ =  waggle_search_convert_to_fq($sWordSearch) . $sDateFQ . ' ' . $sHourCreatedFQ; //left optional because waggle_search_convert_to_fq leaves it's filters as optional
  global $user; //get access to the global user var
  module_load_include('inc', 'waggle_vis', 'waggle_vis_security_check');
  $sBigFQ .= ' ' . getSecurityCheckFQ($user);

  $data;
  for ($i = $iDayStart; $i <= $iDayEnd; $i++)
  {
    $asrRequestsByHourPerDay = $connection->makeServletRequest('select',
      array(
        'rows' => 0,
        'show' => 'index',
        'fq' => $sBigFQ . " is_day_created:$i", //TODO: add security check
        'facet' => 'on',
        'facet.field' => 'is_hour_created',
        //'facet.mincount' => 1,
        'debugQuery' => 'on',
      )
    );
    $data[$i] = $asrRequestsByHourPerDay->facet_counts->facet_fields->is_hour_created;
  }

  dpm($data);
  $sOutput .= '<script>var HTMLEHeatmapData = ' . json_encode($data, JSON_FORCE_OBJECT) . ", HOURSTART = $iHourStart, HOUREND = $iHourEnd, DAYSTART = $iDayStart, DAYEND = $iDayEnd;</script>";
  /*
  $asrTimeClosedFilter = $connection->makeServletRequest('select',
    array(
      'rows' => 25,
      'show' => 'index',
      'fq' => '+is_time_to_close'))
  */

  $sOutput .= '</div>';
  return $sOutput;
}
