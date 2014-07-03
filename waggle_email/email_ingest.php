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

  waggle_email_ingest_message($message);
?>
