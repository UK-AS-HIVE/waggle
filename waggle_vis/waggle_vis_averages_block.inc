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

  $output .= '</div>';
  return $output;
}

