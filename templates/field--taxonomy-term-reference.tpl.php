<div class="<?php print $variables['classes'] . (!in_array('clearfix', $variables['classes_array']) ? ' clearfix' : ''); ?>">
<?php
  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']): ?>
    <h3 class="field-label">' <?php print $variables['label']; ?>: </h3>
<?php endif;
  // Render the items.
  print ($variables['element']['#label_display'] == 'inline') ? '<ul class="links inline">' : '<ul class="links">';
  foreach ($variables['items'] as $delta => $item): ?>
    <li class="taxonomy-term-reference-<?php print $delta; ?>"<?php print $variables['item_attributes'][$delta]; ?>>
      <?php print drupal_render($item); ?>
      <div class="tag-term-info" data-tid="<?php print $item['#options']['entity']->tid; ?>" style="display:none;">
        <?php
          $term = taxonomy_term_load($item['#options']['entity']->tid);
          dpm($term);
        ?>
        <strong><?php print $term->name; ?></strong>
        <div class="tag-term-description"><?php print $term->description; ?></div>
        <div class="remove-tag-wrapper"><a class="remove-tag">Remove</a></div>
      </div>
    </li>
<?php endforeach; ?>
</ul>
</div>
