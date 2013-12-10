<?php
//make nodes have at least one permission that our user also has (if user and node have same permission, permission is granted, i think)
function getSecurityCheckFQ($user)
{
  $userGrants = node_access_grants('view', $user); //user is drupal global
  $userGrantAddedFQ = ' +('; //is plus here okay?
  foreach ($userGrants as $realm => $gids)
  {
    foreach ($gids as $gid)
    {
      $userGrantAddedFQ .= "sm_search_api_access_node:\"node_access_$realm:$gid\" OR ";
    }
  }
  return ($userGrantAddedFQ . 'sm_search_api_access_node:"node_access__all")');
}