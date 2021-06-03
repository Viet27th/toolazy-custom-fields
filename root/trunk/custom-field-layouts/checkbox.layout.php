<?php

/**
 * Generate HTML layout for Meta Box also known as Custom Field.
 * 
 * You can get Custom Field by using the "name" attribute of input/select/checkbox,... HTML tag
 */

// 2nd parameter == true so it comes back as an array/object if when you save Meta data as json_encode
// Get meta data of current post.
$value = (array) get_post_meta($post->ID, $obj_cf["metaKey"], true);
// Remvoe empty value from array
$value = array_filter($value, function($item) { 
  return $item != ""; 
});
$value_you_defined = $obj_cf["value"];

?>

<div 
  id="<?php echo "toolazy-cf-{$obj_cf["metaKey"]}" ?>" 
  class="<?php echo $obj_cf["wrapperClassAttributes"] ?>" 
>
  <h4>
    Key: <?php echo $obj_cf["metaKey"] ?>
    <?php if($obj_cf["isRequired"]) : ?>
      <span class="required">*</span>
    <?php endif; ?>
  </h4>

  <?php if($obj_cf["instructions"] ?? false) : ?>
    <p class="toolazy-cf-instructions"><?php echo $obj_cf["instructions"] ?> </p>
  <?php endif; ?>

  <?php
   // Start content
  ?>
  <?php foreach ($value_you_defined as $key => $value_defined) : ?>
    <div>
      <input 
        type="checkbox" 
        id="<?php echo "{$obj_cf["metaKey"]}-{$key}" ?>"
        class="<?php echo $obj_cf["metaKey"] ?>"
        name="<?php echo $obj_cf["metaKey"] ?>[]"
        value="<?php echo $value_defined["value"] ?>"
        <?php echo $obj_cf["isRequired"] ? "required" : "" ?>
        <?php echo in_array($value_defined["value"], $value) ? "checked" : "" ?>
      >
      <label 
        for="<?php echo "{$obj_cf["metaKey"]}-{$key}" ?>" 
      > 
        <?php echo $value_defined["label"] ?> 
      </label>
    </div>
  <?php endforeach; ?>
</div>

<script type="application/javascript">
  jQuery(function(){
      let requiredCheckboxes = jQuery('input.<?php echo $obj_cf["metaKey"] ?>[required]');
      let makeRequire = function() {
        if(requiredCheckboxes.is(':checked')) {
            requiredCheckboxes.removeAttr('required');
        } else {
            requiredCheckboxes.attr('required', 'required');
        }
      }
      makeRequire();
      requiredCheckboxes.change(makeRequire);
  });
</script>