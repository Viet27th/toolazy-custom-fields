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
if($obj_cf["isRequired"] && !count($value)) {
  $value = [""];
}
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

  <button 
    type="button" 
    class="tcf-mi-btn tcf-mi-btn-add"
    onclick="miAddClicked(this)"
  >
    +
  </button>
  <div id="<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-mi-container" ?>">
    <?php foreach($value as $inputValue) : ?>
      <div class="tcf-mi-wrap-input-row">
        <input 
          class="tcf-w-30"

          type="<?php echo $obj_cf["inputType"] ?>" 
          
          name="<?php echo $obj_cf["metaKey"] ?>[]"

          value="<?php echo ($inputValue ? htmlentities($inputValue) : htmlentities($obj_cf["defaultValue"])) ?>"

          <?php echo $obj_cf["isRequired"] ? "required" : "" ?>

          placeholder="<?php echo $obj_cf["placeholderText"] ?>"

          <?php if($obj_cf["characterLimit"] ?? false) : ?>
            maxlength="<?php echo $obj_cf["characterLimit"] ?>"
          <?php endif; ?>
        >
        <button 
          type="button" 
          class="tcf-mi-btn tcf-mi-btn-remove"
          onclick="miRemoveClicked(this)"
        >
          -
        </button>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<script type='text/javascript'>
let miAddClicked;
let miRemoveClicked;
jQuery(function($) {
  let miContainer = $("#<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-mi-container" ?>");
  let inputType = "<?php echo $obj_cf["inputType"] ?>";
  let inputName = "<?php echo $obj_cf["metaKey"] ?>[]";
  let isRequired = <?php echo json_encode($obj_cf["isRequired"]) ?> ? "required " : " ";
  let isRequiredBool = <?php echo json_encode($obj_cf["isRequired"]) ?>;
  let defaultValue = "<?php echo htmlentities($obj_cf["defaultValue"]) ?>" ? "<?php echo htmlentities($obj_cf["defaultValue"]) ?>" + '" ' : "";
  let placeholderText = "<?php echo $obj_cf["placeholderText"] ?>" ? 'placeholder="' + '<?php echo $obj_cf["placeholderText"] ?>' + '" ' : ' ';
  let characterLimit = "<?php echo $obj_cf["characterLimit"] ?>" ? 'maxlength="' + '<?php echo $obj_cf["characterLimit"] ?>' + '" ' : ' ' ;

  miAddClicked = function(event) {
    let str = '<div class="tcf-mi-wrap-input-row">' +
                '<input ' +
                  'class="tcf-w-30" ' +
                  'type="' + inputType + '" ' +
                  'name="' + inputName + '" ' +
                  'value="' + defaultValue + '" ' + 
                  isRequired +
                  placeholderText +
                  characterLimit +
                '>' +
                '<button ' + 
                  'type="button" ' + 
                  'class="tcf-mi-btn tcf-mi-btn-remove" ' +
                  'onclick="' + 'miRemoveClicked(this)' + '" ' +
                '>' +
                  '-' +
                '</button>'
              '</div>';

    let html = toolazyStringToHTML(str);
    miContainer.prepend(html);
  }

  miRemoveClicked = function(event) {
    if(isRequiredBool) {
      if($("input[name='" + inputName + "']").length > 1) {
        $(event).parent().remove();
      }
    } else {
      $(event).parent().remove();
    }
  }
});
</script>

<style>
  .tcf-mi-wrap-input-row {
    display: flex;
    margin-bottom: 5px;
  }

  .tcf-mi-btn {
    border: none;
    outline: none;
    color: white;
    padding: 11px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    cursor: pointer;
    font-size: 22px;
    padding: 3px 10px;
    border-radius: 5px;
  }

  .tcf-mi-btn-add {
    background-color: #008CBA;
    margin-bottom: 5px;
  }

  .tcf-mi-btn-remove {
    background-color: #f44336;
    margin-left: 5px;
  }
</style>