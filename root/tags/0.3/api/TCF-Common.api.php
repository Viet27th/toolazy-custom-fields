<?php
require_once( __DIR__ . '/TCF-Base.api.php');

class TCF_Common_Api extends TCF_Base_Api {
  public static function register_endpoints() {
    register_rest_route(TCF_URL_PREFIX, '/hello-world', array(
      'methods' => 'GET',
      'callback' => array("TCF_Common_Api", 'func_hello_world'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return true;
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/check-plugin-active', array(
      'methods' => 'POST',
      'callback' => array("TCF_Common_Api", 'func_check_plugin_active'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/get-post-types', array(
      'methods' => 'GET',
      'callback' => array("TCF_Common_Api", 'func_get_post_types'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  }

  public static function func_hello_world($data) {

    // return parent::sendError("example_response_error", "Example response error.", 300);
    return parent::sendSuccess("Hello World! This is my first REST API");
  }
  
  public static function func_check_plugin_active(WP_REST_Request $request) {
    if ( ! function_exists( 'is_plugin_active' ) ) {
       require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
    }
    $plugins = $request->get_params();
    $data = array();
    foreach ($plugins as $plugin) {
      $plugin["isActive"] = is_plugin_active($plugin["path"]);
      array_push($data, $plugin);
    }
    return parent::sendSuccess($data);
  }
  
  public static function func_get_post_types(WP_REST_Request $request) {
    return parent::sendSuccess(TCF_Common_Helper::get_post_types());
  }
}

add_action('rest_api_init', array("TCF_Common_Api", "register_endpoints"));
