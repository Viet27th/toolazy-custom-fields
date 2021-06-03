<?php

/**
 * Generate HTML layout for Meta Box also known as Custom Field.
 * 
 * You can get Custom Field by using the "name" attribute of input/select/checkbox,... HTML tag
 */

// 2nd parameter == true so it comes back as an array/object if when you save Meta data as json_encode
// Get meta data of current post.
$value = (string) get_post_meta($post->ID, $obj_cf["metaKey"], true);

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
  <input 
    class="tcf-w-30"
    
    type="<?php echo $obj_cf["inputType"] ?>" 
    
    name="<?php echo $obj_cf["metaKey"] ?>"

    value="<?php echo ($value ? htmlentities($value) : htmlentities($obj_cf["defaultValue"])) ?>"

    <?php echo $obj_cf["isRequired"] ? "required" : "" ?>

    placeholder="<?php echo $obj_cf["placeholderText"] ?>"

    <?php if($obj_cf["characterLimit"] ?? false) : ?>
      maxlength="<?php echo $obj_cf["characterLimit"] ?>"
    <?php endif; ?>
  >
</div>