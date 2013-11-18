<?php

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
function waggle_email_ingestion_parse_body($message) {
  $body = null;

  $fromAddress = waggle_email_ingestion_get_from_address($message);

  if ($message->isMultipart()) {

  // look for plain text part
  $hasBody = false; //we set this so we can iterate through all parts without overwriting the body if another text/plain part exists
  foreach (new RecursiveIteratorIterator($message) as $part) {
    try {

      if ((strtok($part->contentType, ';') == 'text/plain') && ($hasBody == false)) {
        $bodyRaw = trim($part); 


        $fromDomain = explode('@', $fromAddress);

        //watchdog('waggle_email', $fromDomain[1]);

        //watchdog('waggle_email', $toWhole);

        if($fromDomain[1] == "gmail.com"){
          $bodyRaw = iconv('ISO-8859-1', 'UTF-8//TRANSLIT', $bodyRaw);
          $bodySplit = preg_split("/On .+<.*" . $toAddress .".*> wrote:/", $bodyRaw);
          $bodyRaw = $bodySplit[0];
        }else{

  	      if ($part->contentTransferEncoding == 'base64') {
  	      	$bodyRaw = base64_decode($bodyRaw);
  	        //watchdog('waggle', 'this was base 64 encoded');
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
            //watchdog('waggle', 'succesfully saved file: ' . $filename);
            $node->field_attachments[LANGUAGE_NONE][] = array('fid' => $file->fid, 'display' => 1, 'uid' => $drupalUID);
            //watchdog('waggle', 'succesfully attached file to node as array: ' . $filename);
            $freakout = node_save($node);
          }
          else {
            //watchdog('waggle', 'failed to save attachment from eamail: ' . $filename . ":" . $nodeID, WATCHDOG_ERROR);
          }
        }
      }

    } catch (Zend_Mail_Exception $e) { 
    //none
    // NMA: At the least, log exceptions with watchdog().
    }
    catch (Exception $e) {
      //watchdog('waggle', 'exception: ' . print_r($e, true));
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

  return $body;
}

