#!/usr/bin/php
<?php
  // NMA: file needs reformatting to match http://drupal.org/coding-standards
  
  include "Zend/Mime.php";
  include "Zend/Mail/Message.php";
  include "Zend/Mail.php";

  // NMA: it should be possible to specify Drupal bootstrap levels from the drush command, but this is okay too.
  //bootstrap drupal so we can use the nougaty goodness inside

  $drupal_path = $_SERVER['DOCUMENT_ROOT'];
  define('DRUPAL_ROOT', $drupal_path);

  require_once DRUPAL_ROOT . '/includes/bootstrap.inc';

  drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

  include_once DRUPAL_ROOT . '/sites/all/modules/waggle/waggle_email/waggle_email.ingestion.inc';

  //read the incoming email from stdin - put it in the variable $email
  $fd = fopen("php://stdin", "r");
	$email = "";
	while (!feof($fd)) {
	  $line = fread($fd, 8192);
	  $email .= $line;
  }
  fclose($fd);

  //create a new Zend_Mail object $message to manipulate the incoming email
  $message = new Zend_Mail_Message(array('raw' => $email));

  $fromAddress = waggle_email_ingestion_get_from_address($message);

  //check to see if the email address is a users changeable address
  $dbresult = db_query("SELECT entity_id FROM {field_data_field_mail} WHERE field_mail_value = :email LIMIT 1", array(':email' => $fromAddress));
  foreach ($dbresult as $entID) {
    $drupalUserObject = user_load($entID->entity_id);
  }

  if(!isset($drupalUserObject)){
    $drupalUserObject = user_load_by_mail($fromAddress);
  }




  //get the to address (may or may not be same format incoming as the from address) to in order to get the nodeID - story-XXXXXX@helpdev.as.uky.edu
  
  $toWhole = $message->to;
  $toWhole = trim($toWhole);

  if(strpos($toWhole, ' ') !== FALSE){ //EMail is most likely from Exchange and is in format "name" <address@address.com>
    //remove outside symbols
    watchdog('waggle_email', strlen($toWhole));
    $toWhole = substr($toWhole, 1, -1);

    $toArray = explode('<', $toWhole);
    $toAddress = $toArray[1];
    watchdog("waggle_email", $toAddress);
    $nodeID = $toAddress;
  }else{ //probably just the email address
    $nodeID = $toWhole;
  }


  //grab the story number (nid)
  //use preg_replace to turn story-XXXXXX@YYYY.com to just XXXXXX
  
  $nodeID = preg_replace('/^.+-/', '', $nodeID);
  $nodeID = preg_replace('/@.+$/', '', $nodeID);
  

  $drupalUID = $drupalUserObject->uid;

  // NMA: This might be a good spot for permissions checks, like:
  if (!node_access('update', $node = node_load($nodeID), $drupalUserObject)) { 
    watchdog('waggle_email', 'User with user ID ' . $drupalUID . ' and email address ' . $fromAddress . ' attempted to add a comment to: ' . $nodeID . '  and failed the node_access test');
    return;
  }
  else {
    watchdog('waggle_email', 'User with user ID ' . $drupalUID . ' and email address ' . $fromAddress . ' attempted to add a comment and passed the node_access test');
  }

  //get the message $body
  $body = waggle_email_ingestion_parse_body($message, $toAddress);

  //ok, lets make it a comment in drupal, now

  $comment = (object) array(
    'nid' => $nodeID,
    'cid' => 0,
    'pid' => 0,
    'uid' => $drupalUID,
    'mail' => $fromAddress,
    'is_anonymous' => 0,
    'homepage' => '',
    'status' => COMMENT_PUBLISHED,
    'subject' => '',
    'language' => LANGUAGE_NONE,
    'comment_body' => array(
      LANGUAGE_NONE => array(
        0 => array(
        'value' => check_plain($body),
        'format' => 'filtered_html',
      	),
    	),
  	),
	);

	comment_submit($comment);
	comment_save($comment);
?>
