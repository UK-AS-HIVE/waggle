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

  //get constituent parts of the email that we need to put into the new story note

  //the whole from address in the format "Foo, Jon D" <jfoo@address.com>
  $fromWhole = $message->from;

  //***substring and explode to split the 2 parts and remove unneccessary symbols.***

  $fromWhole = substr($fromWhole, 1, -1);

  $fromArray = explode('" <', $fromWhole);

  $fromName = $fromArray[0];

  $fromAddress = $fromArray[1];

  //check to see if the email address is a users changeable address
  $dbresult = db_query("SELECT entity_id FROM field_data_field_mail WHERE field_mail_value = :email LIMIT 1", array(':email' => $fromAddress));
  foreach ($dbresult as $entID) {
    watchdog('waggle_email', "uid from changeable email = " . $entID->entity_id);
    $drupalUserObject = user_load($entID->entity_id);
  }

  if(!isset($drupalUserObject)){
    watchdog("waggle_email", "no changeable email");
    $drupalUserObject = user_load_by_mail($fromAddress);
  }




  //get the to address (same formate incoming as the from address) to in order to get the nodeID - story-XXXXXX@helpdev.as.uky.edu

  $toWhole = $message->to;

  //remove outside symbols
  $toWhole = substr($toWhole, 1, -1);

  $toArray = explode('" <', $toWhole);

  $nodeID = $toArray[1];


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

  if ($message->isMultipart()) {

  // look for plain text part
  $hasBody = false; //we set this so we can iterate through all parts without overwriting the body if another text/plain part exists
  foreach (new RecursiveIteratorIterator($message) as $part) {
    try {

      if ((strtok($part->contentType, ';') == 'text/plain') && ($hasBody == false)) {
        $bodyRaw = trim($part); 

	      if ($part->contentTransferEncoding == 'base64') {
	      	$bodyRaw = base64_decode($bodyRaw);
	        watchdog('waggle', 'this was base 64 encoded');
	      }
	      elseif ($part->contentTransferEncoding == 'quoted-printable') {

		      $bodyRaw = quoted_printable_decode($bodyRaw);

		      preg_match('/charset="(.+)"$/', $part->contentType, $matches);
		      switch($charset = $matches[1]){
		        case 'Windows-1252':
		          $bodyRaw = iconv('Windows-1252', 'UTF-8//IGNORE', $bodyRaw);
		          break;
		        case 'iso-8859-1':
		          $bodyRaw = iconv('ISO-8859-1', 'UTF-8//TRANSLIT', $bodyRaw);
		          break;
		      }
	      }

        $bodyRaw = preg_split('/From:/', $bodyRaw);

        $body = $bodyRaw[0];

        $hasBody = true;
      }

      // check to see if there is an attachment part
      if ($part->headerExists('Content-Disposition'))
      {
        $contentDisposition = explode(';', $part->getHeader('Content-Disposition'));
        //cycle through the rest of the parts looking for attachments
        if ($contentDisposition[0] == "attachment")
        {

          $filename = $part->contentDescription;

          $attachment = base64_decode($part->getContent());

          $saveLoc = variable_get("waggle_email_attachment_save_location", "public://");

          if ($file = file_save_data($attachment, $saveLoc . $filename, FILE_EXISTS_RENAME))
          {
            $node = node_load($nodeID);
            watchdog('waggle', 'succesfully saved file: ' . $filename);
            $node->field_attachments[LANGUAGE_NONE][] = array('fid' => $file->fid, 'display' => 1, 'uid' => $drupalUID);
            watchdog('waggle', 'succesfully attached file to node as array: ' . $filename);
            $freakout = node_save($node);
          }
          else {
            watchdog('waggle', 'failed to save attachment from eamail: ' . $filename . ":" . $nodeID, WATCHDOG_ERROR);
          }
        }
      }

    } catch (Zend_Mail_Exception $e) { 
    //none
    // NMA: At the least, log exceptions with watchdog().
    }
    catch (Exception $e) {
      watchdog('waggle', 'exception: ' . print_r($e, true));
      throw $e;
    }
    }

    if (!$body) {
      print "An error occured: no body found";
    }
  } 
  else {
  	$body = trim($message->getContent());
  }

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
