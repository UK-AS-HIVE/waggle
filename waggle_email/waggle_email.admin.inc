<?php

/**
 * @file
 * Provide administration screens for waggle_email module.
 */

/* * Implements form callback */
function waggle_email_admin_form()
{
  $form = array();
  $form['setup'] = array(
    '#type' => 'fieldset',
    '#title' => 'Setup',
    '#collapsed' => FALSE,
    '#collapsible' => TRUE,
  );

  $form['setup']['server'] = array(
    '#type' => 'textfield',
    '#title' => 'Server',
    '#default_value' => variable_get('waggle_email_imap_server', ''),
    '#required' => TRUE,
  );

  $form['setup']['user'] = array(
    '#type' => 'textfield',
    '#title' => 'Account user name',
    '#default_value' => variable_get('waggle_email_imap_user', ''),
    '#required' => TRUE,
  );

  $form['setup']['pass'] = array(
    '#type' => 'password',
    '#title' => 'Password',
    '#default_value' => variable_get('waggle_email_imap_pass', ''),
    '#required' => TRUE,
  );

  $form['setup']['secure'] = array(
    '#type' => 'checkbox',
    '#title' => 'Secure connection',
    '#default_value' => variable_get('waggle_email_imap_secure', 1),
    '#required' => TRUE,
  );

  $form['actions'] = array(
    '#type' => 'actions',
  );

  $form['actions']['save'] = array(
    '#type' => 'submit',
    '#validate' => array('waggle_email_admin_form_validate'),
    '#submit' => array('waggle_email_admin_form_submit'),
    '#value' => t('Save'),
  );

  return $form;
}
