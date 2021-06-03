<?php

/**
 * Generate HTML layout for Meta Box also known as Custom Field.
 * 
 * You can get Custom Field by using the "name" attribute of input/select/checkbox,... HTML tag
 */

// 2nd parameter == true so it comes back as an array/object if when you save Meta data as json_encode
// Get meta data of current post.
$value = (string) get_post_meta($post->ID, $obj_cf["metaKey"], true);
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
  <select 
    class="tcf-w-30"
    
    name="<?php echo $obj_cf["metaKey"] ?>"

    <?php echo $obj_cf["isRequired"] ? "required" : "" ?>
  > 
    <option value="">Select one</option>
    <?php foreach ($value_you_defined as $key => $value_defined) : ?>
      <option 
        value="<?php echo $value_defined["value"] ?>"
        <?php selected($value, $value_defined["value"], true) ?>
      >
        <?php echo $value_defined["label"] ?> 
      </option>
    <?php endforeach; ?>
  </select>
</div>