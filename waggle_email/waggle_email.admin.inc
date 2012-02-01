<?php

/**
 * @file
 * Provide administration screens for ec_checkout module.
 */

/* * Implements form callback */
function waggle_email_admin_form()
{
  $form = array();  $form['server'] = array(
    '#type' => 'textfield',
    '#title' => 'Server',
    '#default_value' => variable_get('waggle_email_imap_server', ''),
    '#required' => TRUE,
  );

  $form['user'] = array(
    '#type' => 'textfield',
    '#title' => 'Account user name',
    '#default_value' => variable_get('waggle_email_imap_user', ''),
    '#required' => TRUE,
  );

  $form['pass'] = array(
    '#type' => 'password',
    '#title' => 'Password',
    '#default_value' => variable_get('waggle_email_imap_pass', ''),
    '#required' => TRUE,
  );

  $form['secure'] = array(
    '#type' => 'checkbox',
    '#title' => 'Secure connection',
    '#default_value' => variable_get('waggle_email_imap_secure', 1),
    '#required' => TRUE,
  );

  return system_settings_form($form);
}
