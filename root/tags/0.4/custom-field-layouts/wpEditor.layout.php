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
   wp_editor(
		$value ? $value : $obj_cf["defaultValue"],
		$obj_cf["isRequired"] ? "toolazy-cf-editor-required-{$obj_cf["metaKey"]}" : "toolazy-cf-editor-{$obj_cf["metaKey"]}",
		array(
			"wpautop" => false,
			"media_buttons" => isset($obj_cf["showMediaButton"]) ? $obj_cf["showMediaButton"] : true,
			"drag_drop_upload" => true, // Allow drop file into editor to upload
			"textarea_name" => $obj_cf["metaKey"],
			"textarea_rows" => $obj_cf["visibleLinesNumber"] ? $obj_cf["visibleLinesNumber"] : 10,
      "editor_class" => $obj_cf["isRequired"] ? "toolazy-cf-editor-required-{$obj_cf["metaKey"]}" : "toolazy-cf-editor-{$obj_cf["metaKey"]}", // Add class to hidden textarea
		)
	);
  ?>
</div>