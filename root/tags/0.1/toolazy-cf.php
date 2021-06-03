<?php
/**
 * Plugin Name:       Toolazy Custom Fields
 * Plugin URI:        https://wordpress.org/plugins/toolazy-custom-fields
 * Description:       Create custom fields for any post types.
 * Version:           0.1
 * Author:            viet27th
 * Author URI:        https://github.com/Viet27th/toolazy-custom-fields
 * Text Domain:       toolazy-custom-fields
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 */

/**
 * References: 
 * https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/
 * https://developer.wordpress.org/plugins/hooks/actions/
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly
if (!defined("TCF_NONCE")) {
  define("TCF_NONCE", "wp_rest");
}
if (!defined("TCF_URL_PREFIX")) {
  define("TCF_URL_PREFIX", "tcf/v1");
}

if (!class_exists('ToolazyCf')) :
  class ToolazyCf {
    /** @var string The plugin version number. */
    var $version = '0.1';

    /** @var array The plugin data array. */
    var $data = array();

    /** @var array All the custom field type and data types it will save to meta data. */
    var $custom_field_types = array(
      "input" => "text",
      "multipleInput" => "array",
      "textarea" => "text",
      "radio" => "text",
      "select" => "text",
      "checkbox" => "array",
      "file" => "array",
      "image" => "array",
    );

    /**
     * __construct
     *
     * @date	27/02/2021
     * @since	0.0
     *
     * @param	void
     * @return	void
     */
    function __construct() {
      $this->initialize();
    }

    /**
     * Sets up plugin.
     *
     * @date	1/03/2021
     * @since	0.0
     *
     * @param	void
     * @return	void
     */
    function initialize() {
      // Define constants.
      $this->define('TOOLAZY_CF_BASE_URL', get_bloginfo('url')); // https://localhost:8443/{project_name}
      $this->define('TOOLAZY_CF', 'TOOLAZY_CF');
      $this->define('TOOLAZY_CF_PATH', plugin_dir_path(__FILE__)); // /opt/lampp/htdocs/{project_name}/wp-content/plugins/{plugin_name}/
      $this->define('TOOLAZY_CF_BASENAME', plugin_basename(__FILE__)); // {plugin_name}/{plugin_main_file}.php
      $this->define('TOOLAZY_CF_DIRECTORY_URL_PATH', plugin_dir_url(__FILE__)); // https://localhost:8443/{project_name}/wp-content/plugins/{plugin_name}/
      $this->define('TOOLAZY_CF_DIRECTORY_NAME_FILE', dirname(__FILE__)); // /opt/lampp/htdocs/{project_name}/wp-content/plugins/{plugin_name}
      $this->define('TOOLAZY_CF_DIRECTORY_NAME_DIRECTORY', dirname(__DIR__) . '/'); // /opt/lampp/htdocs/{project_name}/wp-content/plugins/
      $this->define('TOOLAZY_CF_VERSION', $this->version);

      require_once("helpers/index.php");
      TCF_Common_Helper::include("api/index.php");
      TCF_Common_Helper::include("migration/TCF-CustomFields.table.php");

      $CustomFieldsTableInstance = new TCF_CustomFields_Table();
      $CustomFieldsTableInstance->createTable();
      $all_meta_box_cofigs = $CustomFieldsTableInstance->getAll();

      $this->set_data("meta_boxes_config", $all_meta_box_cofigs);

      // add_action('admin_init', [$this, 'add_global_scripts_and_styles_for_wp_admin']);
      add_action('admin_enqueue_scripts', array($this, "add_scripts_and_styles_for_wp_admin"));
      if(is_admin()) {
        add_action("admin_menu", array($this, "func_add_admin_menu"));
      }
      add_action('add_meta_boxes', [$this, 'func_add_meta_boxes']);
      add_action('save_post', [$this, 'save_meta_boxes']);
      
    }

    /**
     * This action is used to add extra submenus and menu options
     * to the admin panel’s menu structure
     * 
     * @date	1/3/2021
     * @since	0.0
     * 
     * @return void
     */
    function func_add_admin_menu() {
      add_menu_page(
        'Toolazy Custom Fields Setting', // Page title
        'Toolazy CF', // Memu option title
        'manage_options', // capability
        constant('TOOLAZY_CF_PATH') . 'menu-views/setting.view.php', // PHP file path as the $menu_slug
        null, // callable as null
        'dashicons-randomize', // it's dash icon name, icon will be shown on the left sidebar
        2, // 2 is position of dashboard in admin menu, this plugin will appear after dashboard
      );

      add_submenu_page(
        constant('TOOLAZY_CF_PATH') . 'menu-views/setting.view.php', // specify parent_slug
        'Setting', // Page title
        'Setting', // Memu option title
        'manage_options', // capability
        constant('TOOLAZY_CF_PATH') . 'menu-views/setting.view.php', // PHP file path as the $menu_slug
      );

      add_submenu_page(
        constant('TOOLAZY_CF_PATH') . 'menu-views/setting.view.php', // specify parent_slug
        'Introduce', // Page title
        'Introduce', // Memu option title
        'manage_options', // capability
        constant('TOOLAZY_CF_PATH') . 'menu-views/introduce.view.php', // PHP file path as the $menu_slug
      );
    }

    /**
     * Registration Meta boxes.
     */
    function func_add_meta_boxes() {
      $post_types = TCF_Common_Helper::get_post_types();
      $meta_boxes_config = $this->get_data("meta_boxes_config");
      if (!$meta_boxes_config) return;
      foreach ($meta_boxes_config as $obj_custom_field_config) {
        if (in_array($obj_custom_field_config["postType"], $post_types)) {
          // Unique ID, id will appear on HTML and save to meta data by this id as key, Every meta box is identified by this one.
          $id = constant('TOOLAZY_CF') . '-' . sanitize_title($obj_custom_field_config["metaKey"]);

          // Title of the meta box on the admin interface. 
          $title = $obj_custom_field_config["metaboxTitle"];

          // add_meta_box calls the callback to display the contents of the custom meta box.
          $callback = [$this, "render_custom_fields_layout"];

          // the second parameter passed to your callback
          $callback_args = $obj_custom_field_config;

          // Specify Meta box for which Post type
          $screen = $obj_custom_field_config["postType"];

          // used to provide the position of the custom meta on the display screen
          // enum of 'normal', 'side', and 'advanced'
          $context = $obj_custom_field_config["context"];

          // used to provide the position of the box in the provided context
          // Accepts 'high', 'core', 'default', or 'low'.
          $priority = $obj_custom_field_config["priority"];

          add_meta_box(
            $id,
            $title,
            $callback,
            $screen,
            $context,
            $priority,
            $callback_args
          );
        }
      }
    }

    /**
     * Create Meta Box HTML layout.
     * 
     * @param	mixed $post - contant current post data. You can get data of a post via this one like as "$post->ID"
     * @param	object $args - 
     * @return void
     */
    function render_custom_fields_layout($post, $args) {
      $obj_custom_field_config = $args["args"];
      $data = [
        "obj_cf" => $obj_custom_field_config,
        "post" => $post,
      ];

      TCF_Common_Helper::get_custom_field_layout(
        "{$data["obj_cf"]['metaboxType']}.layout",
        $data
      );
    }

    /**
     * Run before save a "post type".
     * $_POST is current post
     * 
     * @param mixed $post_id
     * 
     * @return void
     */
    function save_meta_boxes($post_id) {
      $meta_boxes_config = $this->get_data("meta_boxes_config");
      if (!$meta_boxes_config) return;
      foreach ($meta_boxes_config as $meta_box_config) {
        if(isset($_POST["post_type"]) && $meta_box_config["postType"] === $_POST["post_type"]) {
          $validatedValue = ""; // It can be string or array
          // "$meta_box_config["metaKey"]" is html tag's "name" attribute of each custom field.
          // If in the $_POST have value when Post Type submited, save that value to meta box.
          if (array_key_exists($meta_box_config["metaKey"], $_POST)) {
            // If field types has defined is array
            if($this->custom_field_types[$meta_box_config["metaboxType"]] === "array") {
              // But value in request incomming is string
              if (is_string($_POST[$meta_box_config["metaKey"]])) {
                // If is a empty string
                if ($_POST[$meta_box_config["metaKey"]] == "") {
                  // Convert to empty array
                  $validatedValue = [];
                } else {
                  // Convert to array have value
                  $validatedValue = explode(" ", sanitize_textarea_field($_POST[$meta_box_config["metaKey"]]));

                  // Save full file data for image and file
                  if($meta_box_config["metaboxType"] === "image" || $meta_box_config["metaboxType"] === "file") {
                    $newValueForMetaData = [];
                    foreach ($validatedValue as $id) {
                      $file = array(
                        "id" => $id,
                        "fullPath" => wp_get_attachment_url($id),
                      );
                      $file = array_merge($file, wp_get_attachment_metadata($id));
                      array_push($newValueForMetaData, $file);
                    }
                    $validatedValue = $newValueForMetaData;
                  }
                }
              } else {
                $validatedValue = $_POST[$meta_box_config["metaKey"]];
                // Remvoe empty value from array
                $validatedValue = array_filter($validatedValue, function($item) { 
                  return $item != ""; 
                });
              }
            }

            if($this->custom_field_types[$meta_box_config["metaboxType"]] === "text") {
              $validatedValue = sanitize_textarea_field($_POST[$meta_box_config["metaKey"]]);
            }
          } else {
            // If meta box has been registered for this post type but not found on submit incomming
            // we will set default value base on data type.
            if($this->custom_field_types[$meta_box_config["metaboxType"]] === "array") {
              $validatedValue = []; // set default value is empty array
            }

            if($this->custom_field_types[$meta_box_config["metaboxType"]] === "text") {
              $validatedValue = ""; // set default value is empty string
            }
          }

          update_post_meta(
            $post_id,
            $meta_box_config["metaKey"], // Save meta data "key" field as this name.
            $validatedValue // The data to save, get from request.
          );
        }
      }
    }

    /**
     * Defines a constant if doesnt already exist.
     * After defined, call "constant(string_name)" or just "string_name" to get value.
     * Constants can be accessed regardless of scope.
     * 
     * @date	1/3/2021
     * @since 0.0
     *
     * @param	string $name The constant name.
     * @param	mixed $value The constant value.
     * @return	void
     */
    function define($name, $value = true) {
      if (!defined($name)) {
        define($name, $value);
      }
    }

    /**
     * Returns data or null if doesn't exist.
     *
     * @date	1/3/2021
     * @since	0.0
     *
     * @param	string $name The data name.
     * @return	mixed
     */
    function get_data($name) {
      return isset($this->data[$name]) ? $this->data[$name] : null;
    }

    /**
     * Sets data for the given name and value.
     *
     * @date	1/3/2021
     * @since	0.0
     *
     * @param	string $name The data name.
     * @param	mixed $value The data value.
     * @return	void
     */
    function set_data($name, $value) {
      $this->data[$name] = $value;
    }

    /**
     * Add my global css/js for the admin pages.
     * https://stackoverflow.com/questions/3760222/how-to-include-css-and-jquery-in-my-wordpress-plugin
     * 
     * @return void
     */
    function add_scripts_and_styles_for_wp_admin($hook) {
      global $post;
        // If you are on the Create/Edit page of any "Post Type"
      if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
        wp_register_script('validate-post-type-submit', plugin_dir_url( __FILE__ ) . 'assets/js/validate-post-type-submit.js', 'jquery', '', true);
        wp_enqueue_script('validate-post-type-submit');
        // Pass variable to js file
        wp_localize_script( 
          'validate-post-type-submit', // script Id register above
          'data',  // custom name we will use this one to get data in js file.
          array( // array data pass to js file
            'metaboxRecords' => $this->get_data("meta_boxes_config")
          )
        );
      }
      wp_register_style('global_admin_pages_css', constant("TOOLAZY_CF_DIRECTORY_URL_PATH") . "assets/css/global-admin-pages.css");
      wp_enqueue_style('global_admin_pages_css');
      wp_register_script('global_admin_pages_js', constant("TOOLAZY_CF_DIRECTORY_URL_PATH") . "assets/js/global-admin-pages.js", array( 'jquery' ), "", true);
      wp_enqueue_script('global_admin_pages_js');
    }
  }

  function toolazy() {
    // Instantiate only once.
    if (!defined('TOOLAZY_CF')) {
      new ToolazyCf();
    }
  }

  /**
   * Use this hook to certant that this plugin is run after other plugin loaded and executed
   * so, you can re-use the class or function of these plugins and fix some bugs like as
   * can't get "Product" Post Type generated by Woocommerce because this plugin run before
   * Woocommerce register do action register "Product" Post Type.
   */
  add_action( 'init', 'toolazy', 10, 0);

endif;
