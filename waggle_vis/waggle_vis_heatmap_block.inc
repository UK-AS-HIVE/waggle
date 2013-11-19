<?php
/**
 *  Contents of heatmap block.
 */
function waggle_vis_heatmap()
{
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/heatmap.js');
  drupal_add_js(drupal_get_path('module', 'waggle_vis') . '/js/d3.v3/d3.v3.min.js');

  return 'hello!';
}