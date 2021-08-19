/**
 * 
 * About Wordpress Gutenberg
 * We need to know about "Selectors" and "dispatch" actions.
 * * What is a selector? wp.data.select('core/editor').getBlocks();
 * There are multiple Selectors: https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#selectors
 * 
 * * What is an action? wp.data.dispatch('core/notices').createNotice( 'success', 'Here is our notice!' );
 * And multiple actions: https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#actions
 * 
 * * What is "data store" as "core/editor, core/notices, etc."
 * https://developer.wordpress.org/block-editor/reference-guides/data/
 * 
 * 
 */

// console.log(data.metaboxRecords); // Show variables pass from .php file.
// wp.data.dispatch( 'core/editor' ).lockPostSaving( 'title-lock' ); // Gutenberg disable submit button
// wp.data.dispatch( 'core/editor' ).unlockPostSaving( 'title-lock' ); // Gutenberg enable submit button

jQuery(document).ready(function($) {
  let handleChanging = function() {
    $(this).removeClass("tcf-border-red");
    $('input[name=\'' + $(this).attr("name") + '\']').each(function() {
      $(this).removeClass("tcf-border-red");
    })
  };
  let validationAction = function(event) {
    let message = "";
    let nameArr = [];
    $('.tcf-border-red').each(function() {
      $(this).removeClass("tcf-border-red");
    });

    /**
     * Get validation for meta box type WP_Editor
     * wp_editor generate the "tinymce" and hidden "textarea", to verify, we need to get class of "textarea"
     * and use this class as an id to get tinymce instance and get the value of it. So when you use
     * wp_editor to create the meta box, you need to match "textarea" class with "tinymce" id.
     */
    $("[class*='toolazy-cf-editor-required-']").each(function() {
      let nodeName = $(this).prop("nodeName"); // Get textarea tag
      let nodeClassList = $(this).attr("class") // Class list of textarea
      let classArr = nodeClassList.split(/\s+/);
      if(nodeName === "TEXTAREA") {
        $(this).prop('required', true); // Because textare has class required so we need to add required attribute
        let tinymceIdNeedToGetContent;
        for(let className of classArr) {
          if(className.includes("toolazy-cf-editor-required-")) {
            tinymceIdNeedToGetContent = className;
            break;
          }
        }
        if(tinymce.editors[tinymceIdNeedToGetContent]) {
          if(!tinymce.editors[tinymceIdNeedToGetContent].getContent()) {
            $(this).val("");
          } else {
            $(this).val(tinymce.editors[tinymceIdNeedToGetContent].getContent());
          }
        }
      }
    });
    // End get validation for meta type wp_editor

    $('[required]').each(function() {
      $(this).unbind("keyup", handleChanging );
      $(this).keyup(handleChanging);
      $(this).unbind("change", handleChanging );
      $(this).change(handleChanging);

      if ($(this).is(':invalid') || !$(this).val()) {
        let name = $(this).attr('name');
        name = name.split('[]').join(''); // Remove "[]" in string
        if(!nameArr.includes(name)) {
          nameArr.push(name);
          message += 'The field with key = "' + name + '" is required.\n';
        }
        $(this).addClass("tcf-border-red");
      } else {
        $(this).removeClass("tcf-border-red");
      }
    });
    
    if(isGutenbergActive()) {
      if(message) {
        wp.data.dispatch( 'core/notices' ).createNotice(
          'error',
          message,
          { id: 'title-lock', isDismissible: false }
        );
        alert(message);
        event.stopPropagation();
        return false;
      } else {
        wp.data.dispatch( 'core/notices' ).removeNotice( 'title-lock' );
        return true;
      }
    } else {
      if(message) {
        alert(message);
        event.stopPropagation();
        return false;
      } else {
        return true;
      }
    }
  }

  // Validation For Classic Editor
  jQuery('#publish').click(function(event) {       
    validationAction(event);
  });

  // Validation For Gutenberg editor
  /**
   * subscribe callback fire when have any action on the Create/Edit page. 
   */
  if(isGutenbergActive()) {
    let blockLoaded = false;
    // Wait until Gutenberg rendered
    let blockLoadedInterval = setInterval(function() {
      if (blockLoaded) {
        clearInterval(blockLoadedInterval);
        return;
      }

      // post-title-0 is ID of Post Title Textarea mean that Gutenberg has been rendered
      if (document.getElementById('post-title-0')) {
        //Actual functions goes here
        jQuery(".editor-post-publish-button, .editor-post-publish-panel__toggle").click(function(event) {
          setTimeout(function() {
            // When create a new post and click to "publish" button, a panel appear and real "publish" button
            // is inside this panel so we need to add click event again for this button.
            let publishPanel = jQuery(".editor-post-publish-panel");
            if(publishPanel.length) {
              jQuery(".editor-post-publish-panel .editor-post-publish-button").click(function(event) {
                validationAction(event);
              })
            }
          }, 100)
          
          validationAction(event);
        });

        blockLoaded = true;
      }
    }, 500);
  }

});

