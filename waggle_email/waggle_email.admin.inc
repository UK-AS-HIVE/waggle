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

  $form['setup']['email_domain'] = array(
    '#type' => 'textfield',
    '#title' => 'Default Email Domain',
    '#default_value' => variable_get('waggle_email_default_domain', ''),
    '#required' => TRUE,
  );


  $form['setup']['attachment_save_location'] = array(
    '#type' => 'textfield',
    '#title' => 'Location to save attachments',
    '#default_value' => variable_get('waggle_email_attachment_save_location', 'public://'),
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
