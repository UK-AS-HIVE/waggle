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


	//get the to address (same formate incoming as the from address) to in order to get the nodeID - story-XXXXXX@helpdev.as.uky.edu

	$toWhole = $message->to;

	//remove outside symbols
	$toWhole = substr($toWhole, 1, -1);

	$toArray = explode('" <', $toWhole);

	$toAddress = $toArray[1];

	//grab the story number (nid)
	$nodeID = substr($toAddress, 6, -19);

		//get the uid from drupal via the from email address

		//grab the user object
	$drupalUserObject = user_load_by_mail($fromAddress);

	$drupalUID = $drupalUserObject->uid;

	// NMA: This might be a good spot for permissions checks, like:
	if (!node_access('update', $node = node_load($nodeID), $drupalUserObject)) { 
    	watchdog('waggle', 'User with user ID ' . $drupalUID . ' attempted to add a comment and failed the node_access test');
		return;
	}else{
		watchdog('waggle', 'User with user ID ' . $drupalUID . ' attempted to add a comment and passed the node_access test');
	}

	//get the message $body

	if($message->isMultipart()) {

		// look for plain text part
		$hasBody = false; //we set this so we can iterate through all parts without overwriting the body if anothe text/plain part exists
		foreach (new RecursiveIteratorIterator($message) as $part) {
	    	try {

	      		if ((strtok($part->contentType, ';') == 'text/plain') && ($hasBody == false)) {
	        		$bodyRaw = trim($part);

	        		$bodyRaw = preg_split('/From:/', $bodyRaw);

	        		$body = preg_replace('/=\n/', '', $bodyRaw[0]);

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
	      				
						$filelist = $filelist . "|" . $filename . "|";

						if ($file = file_save_data($attachment, 'public://' . $filename, FILE_EXISTS_RENAME))
						{
							$node = node_load($nodeID);
							watchdog('waggle', 'succesfully saved file: ' . $filename);
							$node->field_attachments[LANGUAGE_NONE][] = array('fid' => $file->fid, 'display' => 1, 'uid' => $drupalUID);
							watchdog('waggle', 'succesfully something file to node as array: ' . $filename);
							$freakout = node_save($node);
							watchdog('waggle', 'node_save satatus: ' . $freakout . "\n<pre>" . print_r($node, true) . "</pre>");
						}else{
							watchdog('waggle', 'failed to save attachment from eamail: ' . $filename . ":" . $nodeID, WATCHDOG_ERROR);
						}
	      			}
	      		}

	    	} catch (Zend_Mail_Exception $e) { 
				//none
			// NMA: At the least, log exceptions with watchdog().
	    	}
	    	catch (Exception $e){
	    		watchdog('waggle', 'exception: ' . print_r($e, true));
	    		throw $e;
	    	}
	  	}

	  	if(!$body) {
	    	print "An error occured: no body found";
	  	}
	} else {
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
