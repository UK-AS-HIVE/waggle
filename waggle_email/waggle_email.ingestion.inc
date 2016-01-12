<?php

function waggle_email_ingest_message(Zend_Mail_Message $message) {
  $fromAddress = waggle_email_ingestion_get_from_address($message);

  //check to see if the email address is a users changeable address
  $dbresult = db_query("SELECT entity_id FROM {field_data_field_mail} WHERE field_mail_value = :email LIMIT 1", array(':email' => $fromAddress));
  foreach ($dbresult as $entID) {
    $drupalUserObject = user_load($entID->entity_id);
  }

  if(!isset($drupalUserObject)){
    $drupalUserObject = user_load_by_mail($fromAddress);
  }

  $toAddress = waggle_email_get_toAddress($message);
  //$nodeID = waggle_email_parse_story_id($message);
  $nodeID = waggle_email_parse_story_id_from_toAddress($toAddress);

  $drupalUID = $drupalUserObject->uid;

  // NMA: This might be a good spot for permissions checks, like:
  if (!node_access('update', $node = node_load($nodeID), $drupalUserObject)) { 
    watchdog('waggle_email', 'User with user ID ' . $drupalUID . ' and email address ' . $fromAddress . ' attempted to add a comment to: ' . $nodeID . '  and failed the node_access test');
    $drupalUID = 0;
    //return;
  }
  else {
    watchdog('waggle_email', 'User with user ID ' . $drupalUID . ' and email address ' . $fromAddress . ' attempted to add a comment and passed the node_access test');
  }

  //get the message $body
  $body = waggle_email_ingestion_parse_body($message, $toAddress, $nodeID);


  //ok, lets make it a comment in drupal, now

  $comment = (object) array(
    'nid' => $nodeID,
    'cid' => 0,
    'pid' => 0,
    'uid' => $drupalUID,
    'mail' => $fromAddress,
    'is_anonymous' => ($drupalUID==0?1:0),
    'homepage' => '',
    'status' => COMMENT_PUBLISHED,
    'subject' => '',
    'language' => LANGUAGE_NONE,
    'comment_body' => array(
      LANGUAGE_NONE => array(
        0 => array(
        'value' => check_plain( ($drupalUID==0?($fromAddress . ' wrote: '):'') . $body),
        'format' => 'filtered_html',
        ),
      ),
    ),
  );

  comment_submit($comment);
  comment_save($comment);


  //do another pass, and add any incoming attachments to the story
  $attachments = waggle_email_parse_attachments($message, $nodeID, $drupalUID);
}

function waggle_email_get_toAddress(Zend_Mail_Message $message) {
  //get the to address (may or may not be same format incoming as the from address) to in order to get the nodeID - story-XXXXXX@helpdev.as.uky.edu
  
  $toAddresses = explode(',', $message->to);

  foreach ($toAddresses as $toAddress) {
    if(strpos($toAddress, ' ') !== FALSE){ //EMail is most likely from Exchange and is in format "name" <address@address.com>
      //remove outside symbols
      //watchdog('waggle_email', strlen($toAddress));
      $toAddress = substr($toAddress, 1, -1);

      $toArray = explode('<', $toAddress);
      $toAddress = $toArray[1];
    }

    if (substr($toAddress, 0, 6) == 'story-') {
      return $toAddress;
    }
  }
}

function waggle_email_parse_story_id_from_toAddress($toAddress) {
  //grab the story number (nid)
  //use preg_replace to turn story-XXXXXX@YYYY.com to just XXXXXX
  
  $nodeID = preg_replace('/^.+-/', '', $toAddress);
  $nodeID = preg_replace('/@.+$/', '', $nodeID);

  return $nodeID;
}

function waggle_email_parse_story_id(Zend_Mail_Message $message) {
  return waggle_email_parse_story_id_from_toAddress(
    waggle_email_get_toAddress($message)
  );
}
/*
function waggle_email_parse_story_id(Zend_Mail_Message $message) {
  //get the to address (may or may not be same format incoming as the from address) to in order to get the nodeID - story-XXXXXX@helpdev.as.uky.edu
  
  $toWhole = $message->to;
  $toWhole = trim($toWhole);

  if(strpos($toWhole, ' ') !== FALSE){ //EMail is most likely from Exchange and is in format "name" <address@address.com>
    //remove outside symbols
    //watchdog('waggle_email', strlen($toWhole));
    $toWhole = substr($toWhole, 1, -1);

    $toArray = explode('<', $toWhole);
    $toAddress = $toArray[1];
    //watchdog("waggle_email", $toAddress);
    $nodeID = $toAddress;
  }else{ //probably just the email address
    $nodeID = $toWhole;
  }


  //grab the story number (nid)
  //use preg_replace to turn story-XXXXXX@YYYY.com to just XXXXXX
  
  $nodeID = preg_replace('/^.+-/', '', $nodeID);
  $nodeID = preg_replace('/@.+$/', '', $nodeID);

  return $nodeID;
}*/


function waggle_email_ingestion_get_from_address($message) {
  //get constituent parts of the email that we need to put into the new story note

  //the whole from address in the format "Foo, Jon D" <jfoo@address.com>
  $fromWhole = $message->from;
  //***substring and explode to split the 2 parts and remove unneccessary symbols.***

  $fromWhole = substr($fromWhole, 1, -1);

  $fromArray = explode('<', $fromWhole);


  $fromName = $fromArray[0];

  $fromAddress = $fromArray[1];

  return $fromAddress;
}

/**
 *  $message - a message object, as created by new Zend_Mail_Message.
 */
function waggle_email_ingestion_parse_body($message, $toAddress = 'story-xxxxxx@hostname', $nodeID) {
  $body = null;

  $fromAddress = waggle_email_ingestion_get_from_address($message);

  if ($message->isMultipart()) {

  // look for plain text part
  $hasBody = false; //we set this so we can iterate through all parts without overwriting the body if another text/plain part exists
  foreach (new RecursiveIteratorIterator($message) as $part) {
    //try {

      if ((strtok($part->contentType, ';') == 'text/plain') && ($hasBody == false)) {
        $bodyRaw = trim($part); 


        $fromDomain = explode('@', $fromAddress);

        //watchdog('waggle_email', $fromDomain[1]);

        //watchdog('waggle_email', $toWhole);

        try {
          $enc = array_key_exists('content-transfer-encoding', $part->getHeaders()) ? $part->contentTransferEncoding : '7bit';

          switch (strtolower($enc)) {
            case 'base64':
              $bodyRaw = base64_decode($bodyRaw);
              break;
            //watchdog('waggle', 'this was base 64 encoded');
          
            case 'quoted-printable':
              $bodyRaw = quoted_printable_decode($bodyRaw);
              break;
          }
        } catch (Exception $e) {
          /* There was an error with decoding the text,
             just continue on */
        }

        preg_match('/charset="?([^"]+)"?$/', $part->contentType, $matches);

        switch($charset = strtolower($matches[1])){
          case 'windows-1252':
            $bodyRaw = iconv('Windows-1252', 'UTF-8//IGNORE', $bodyRaw);
            break;
          case 'iso-8859-1':
            $bodyRaw = iconv('ISO-8859-1', 'UTF-8//TRANSLIT', $bodyRaw);
            break;
          case 'gb2312':
            $bodyRaw = iconv('GB2312', 'UTF-8//IGNORE', $bodyRaw);
            break;
        }

        # TODO: break this out into its own unit tests
        $bodyRaw = preg_split('/(^_{5,})?[\r\n]{1,2}^(From|发件人):|^[0-9\/]+ <' . preg_quote($toAddress) . '>$|^[0-9]{4}-[0-9]{2}-[0-9]{2}.*<' . preg_quote($toAddress) . '>:$|^On.+?, <' . preg_quote($toAddress) . '> wrote:/sm', $bodyRaw);

        $body = trim($bodyRaw[0]);


        $hasBody = true;
      }

      
    /*} catch (Zend_Mail_Exception $e) { 
    //none
    // NMA: At the least, log exceptions with watchdog().
    }
    catch (Exception $e) {
      //watchdog('waggle', 'exception: ' . print_r($e, true));
      throw $e;
    }*/
    }

    if (!$body) {
      print "An error occured: no body found";
    }
  } 
  else {
    $bodyRaw = trim($message->getContent());
    try {
      $enc = array_key_exists('content-transfer-encoding', $message->getHeaders()) ? $message->contentTransferEncoding : '7bit';

      switch (strtolower($enc)) {
        case 'base64':
          $bodyRaw = base64_decode($bodyRaw);
          break;
        //watchdog('waggle', 'this was base 64 encoded');
        case 'quoted-printable':
          $bodyRaw = quoted_printable_decode($bodyRaw);
          break;
      }
    } catch (Exception $e) {
      /* There was an error with decoding the text,
         just continue on */
    }

    $body = $bodyRaw;

  }

  return $body;
}

function waggle_email_parse_attachments($message, $nodeID, $drupalUID) {
  $attachments = array();

  if (!($message->isMultipart()))
    return $attachments;

  foreach (new RecursiveIteratorIterator($message) as $part) {
    // check to see if there is an attachment part
    if ($part->headerExists('Content-Disposition'))
    {
      $contentDisposition = explode(';', $part->getHeader('Content-Disposition'));
      //cycle through the rest of the parts looking for attachments
      if ($contentDisposition[0] == "attachment")
      {

        $filename = '';
        foreach ($contentDisposition as $cdPart) {
          $kv = explode('=', $cdPart);
          if (trim($kv[0]) === 'filename' && count($kv) > 1) {
            $filename = trim($kv[1]);
            break;
          }
        }
        if ($filename == '' && $part->headerExists('Content-Description')) {
          $filename = $part->contentDescription;
        }

        // If filename is quoted, remove quotes
        if (substr($filename, 0, 1) == '"' && substr($filename, -1, 1) == '"') {
          $filename = substr($filename, 1, strlen($filename)-2);
        }

        $attachment = base64_decode($part->getContent());

        $attachments[$filename] = $attachment;

        $saveLoc = variable_get("waggle_email_attachment_save_location", "public://");

        // TODO: probably break out attachments to be their own unit test
        // in the meantime, unit tests will fail due to not being able to set file perms
        if (!class_exists('DrupalTestCase'))
          if ($file = file_save_data($attachment, $saveLoc . $filename, FILE_EXISTS_RENAME))
          {
            $node = node_load($nodeID);
            //watchdog('waggle', 'succesfully saved file: ' . $filename);
            $node->field_attachments[LANGUAGE_NONE][] = array('fid' => $file->fid, 'display' => 1, 'uid' => $drupalUID);
            //watchdog('waggle', 'succesfully attached file to node as array: ' . $filename);
            $freakout = node_save($node);
          }
          else {
            watchdog('waggle', 'failed to save attachment from eamail: ' . $filename . ":" . $nodeID, WATCHDOG_ERROR);
          }
      }
    }
  }

  return $attachments;
}

