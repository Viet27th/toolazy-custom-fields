<?php

/**
 * Generate HTML layout for Meta Box also known as Custom Field.
 * 
 * You can get Custom Field by using the "name" attribute of input/select/checkbox,... HTML tag
 */

// 2nd parameter == true so it comes back as an array/object if when you save Meta data as json_encode
// Get meta data of current post.
$filesObj = (array) get_post_meta($post->ID, $obj_cf["metaKey"], true); // Array files object
// Remvoe empty value from array
$filesObj = array_filter($filesObj, function($item) { 
  return $item != ""; 
});
$value = []; // Array string ID of files

foreach ($filesObj as $fileObj) {
  array_push($value, $fileObj["id"]);
}

wp_enqueue_media(); // Call this function to Load css/js ... anything we need for using media modal

$converted_ids_to_object = [];
$converted_ids_to_string = "";

if ($value && count($value)) {
  foreach ($value as $id) {
    if ($id) {
      $file_path = get_attached_file($id);

      $newArray = array(
        "fileId" => $id,
        "fileTitle" => get_the_title($id) ? get_the_title($id) : 'File is deleted or cannot be found, please click "x" and udpate this post.',
        "fileName" => wp_basename($file_path),
        "fileSize" => size_format(filesize($file_path)),
        "fileUrl" => wp_get_attachment_url($id),
      );
      array_push($converted_ids_to_object, $newArray);
      $converted_ids_to_string = trim($converted_ids_to_string . " {$id}", " ");
    }
  }
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

  <div id="<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-content-wrapper" ?>">
    <div id="<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-files-container" ?>">
      <?php foreach($converted_ids_to_object as $file) : ?>

        <div 
          class="toolazy-cf-file"
          id="<?php echo $obj_cf["metaKey"] . "-file-" . $file["fileId"] ?>"
        >
          <div class="toolazy-cf-file__icon-wrapper">
            <img src="<?php echo constant("TOOLAZY_CF_DIRECTORY_URL_PATH") ?>assets/images/file.png" />
          </div>

          <div class="toolazy-cf-file__body">
            <p>Title: <?php echo $file["fileTitle"] ?> </p>
            <p>File name: <a target="_blank" href="<?php echo $file["fileUrl"] ?>"><?php echo $file["fileName"] ?></a></p>
            <p>File size: <?php echo $file["fileSize"] ?> </p>
          </div>

          <div class="toolazy-cf-file__actions">
            <span 
              class="actions__close-icon"
              data-file-id="<?php echo $file["fileId"] ?>"
              data-target-to="<?php echo $obj_cf["metaKey"] . "-file-" . $file["fileId"] ?>"
            >
              x
            </span>
          </div>

        </div>

      <?php endforeach; ?>
    </div>

    <input 
      id="<?php echo "{$obj_cf["metaKey"]}-upload-file-button" ?>"
      type="button" 
      class="button" 
      value="<?php _e( 'Upload file' ); ?>" 
    />

    <input
      class="tcf-hidden-input"
      type="text"
      name="<?php echo $obj_cf["metaKey"] ?>" 
      value="<?php echo $converted_ids_to_string ?>"
      id="<?php echo $obj_cf["metaKey"] ?>-hidden-input" 
      <?php echo $obj_cf["isRequired"] ? "required" : "" ?>
    />
  </div>
  
</div>

<script type='text/javascript'>
jQuery(function($){
  // Set all variables to be used in scope
  let frame;
  let allowMultipleSelection = <?php echo json_encode($obj_cf["allowMultipleSelection"]) ?>;
  let fileTypeAllowed = <?php echo json_encode($obj_cf["fileTypeAllowed"]) ?>;
  let metabox = $("#<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-content-wrapper" ?>");
  let filesContainer = $("#<?php echo "toolazy-cf-{$obj_cf["metaKey"]}-files-container" ?>");
  let addFileBtn = metabox.find("#<?php echo "{$obj_cf["metaKey"]}-upload-file-button" ?>");
  let pluginUrl = "<?php echo constant("TOOLAZY_CF_DIRECTORY_URL_PATH") ?>";
  let hiddenInput = $("#<?php echo $obj_cf["metaKey"] ?>-hidden-input");

  let handleRemoveFile = function(event) {
    let fileId = $(this).data('file-id');
    let targetDiv = $("div#" + $(this).data('target-to'));

    targetDiv.remove();
    let fileIds = hiddenInput.val();
    fileIds = fileIds.split(" ");
    fileIds = fileIds.filter(function(e) {
      return e != fileId;
    });
    fileIds = fileIds.join(" ");

    hiddenInput.val(fileIds);
  };

  $(".actions__close-icon").on("click", handleRemoveFile);

  addFileBtn.on( 'click', function( event ){
    event.preventDefault();

    // If the media frame already exists, reopen it.
    if ( frame ) {
      frame.open();
      return;
    }

     // Create a new media frame
     frame = wp.media({
      title: 'Toolazy Custom Field - Select or Upload Media',
      filterable: 'all',
      library: {
        type: fileTypeAllowed
      },
      button: {
        text: 'Select'
      },
      multiple: allowMultipleSelection // Set to true to allow multiple files to be selected
    });

    // Invoke when selected the images in the media frame and click to select
    frame.on( 'select', function() {
      // Get media attachment details from the frame state
      let selection = frame.state().get('selection');

      // Remove all HTML inside element.
      filesContainer.empty();
      // Clear file selected.
      hiddenInput.val("");

      if (selection.length) {
        selection.map( function( attachment ) {
          attachment = attachment.toJSON();
          if(attachment.id) {
            // Create HTML layout for file selected and append to the container element
            let str = '<div class="toolazy-cf-file" id="' + '<?php echo $obj_cf["metaKey"] ?>-file-' + attachment.id + '">' +
                        '<div class="toolazy-cf-file__icon-wrapper">' +
                          '<img src="' + pluginUrl + 'assets/images/file.png" />' +
                        '</div>' +

                        '<div class="toolazy-cf-file__body">' +
                          '<p>Title: ' + attachment.title + '</p>' +
                          '<p>File name: ' + '<a target="_blank" href="' + attachment.url + '">' + attachment.filename + '</a>' + '</p>' +
                          '<p>File size: ' + attachment.filesizeHumanReadable + '</p>' +
                        '</div>' +

                        '<div class="toolazy-cf-file__actions">' +
                          '<span' + 
                            ' data-target-to="' + '<?php echo $obj_cf["metaKey"] ?>-file-' + attachment.id + '"' +
                            ' data-file-id="' + attachment.id + '"' +
                            ' class="actions__close-icon">x</span>' +
                        '</div>' +
                      '</div>';

            // Convert string to HTML
            // let html = $.parseHTML( str );
            let html = toolazyStringToHTML(str);

            // Update id of selected file to the hidden input
            
            let oldValue = hiddenInput.val();
            let newValue = oldValue.concat(" " + attachment.id);
            hiddenInput.val(newValue.trim());

            // Find element inside and add event
            $(html).find(".actions__close-icon").on("click", handleRemoveFile);

            // Append element to the DOM container
            filesContainer.append(html);
          }
        });
      }

    });

    // Fire after media popup is closed.
    frame.on('close',function() {});

    // Fire when media popup is opened.
    frame.on('open',function() {
      let selection = frame.state().get('selection');
      var ids_value = hiddenInput.val().split(" ");
      
      if(ids_value.length > 0) {
        // Loop over files ID and check these file in media modal
        ids_value.forEach(function(id) {
          attachment = wp.media.attachment(id);
          attachment.fetch();
          selection.add(attachment ? [attachment] : []);
        });
      }
    });

    // Finally, open the modal on click
    frame.open();
  });

});
</script>

<style>
  .toolazy-cf-file {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 9px 11px;
    background-color: rgba(0,0,0,.095);
  }
  .toolazy-cf-file .toolazy-cf-file__icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 9px;
  }
  .toolazy-cf-file .toolazy-cf-file__icon-wrapper img {
    width: 40px;
  }

  .toolazy-cf-file .toolazy-cf-file__body {
    flex: 1;
  }

  .toolazy-cf-file .toolazy-cf-file__body p {
    margin: 0;
  }

  .toolazy-cf-file .toolazy-cf-file__actions {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }

  .toolazy-cf-file .toolazy-cf-file__actions .actions__close-icon {
    background-color: black;
    color: #FFF;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 12px;
    margin-left: 5px;
  }
</style>

