<?php
/**
 *  Contents of heatmap block.
 */
function waggle_vis_heatmap()
{
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/d3.v3/d3.v3.min.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/share.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/heatmap.js');
  
  $sOutput = '<div id="waggle-vis-heatmap">';

  $servSolr = search_api_index_get_server(search_api_index_load('default_node_index'));
  $connection = $servSolr->getSolrConnection();
  $sWordSearch = isset($_GET['ws']) ? $_GET['ws'] : '';
  $sStart = 'NOW/DAY-1MONTH';
  $sEnd = 'NOW/DAY';
  $sStartTime = substr($sStart, 0, strpos($sStart, 'T') + 1) . '08:00:00Z';
  $sEndTime = substr($sEnd, 0, strpos($sStart, 'T') + 1) . '20:00:00Z';
  $dateFQ = 'ds_created:[' . $sStart . ' TO ' . $sEnd . ']';
  $output .= '<p>hello!</p>';

  $asrHourFilter = $connection->makeServletRequest('select',
    array(
      'rows' => 25,
      'show' => 'index',
      'fq' => $dateFQ. '+is_hour_created:[8 TO 19]',
      'debugQuery' => 'on'
    )
  );
  dpm($asrHourFilter);

  /*
  $asrTimeClosedFilter = $connection->makeServletRequest('select',
    array(
      'rows' => 25,
      'show' => 'index',
      'fq' => '+is_time_to_close'))
  */

  $output .= '</div>';
  return $output;
}