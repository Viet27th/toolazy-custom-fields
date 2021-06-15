<?php

require_once( __DIR__ . '/TCF-Base.api.php');
TCF_Common_Helper::include("migration/TCF-CustomFields.table.php");

class TCF_CustomFields_Api extends TCF_Base_Api {
  public static function register_endpoints() {  
    register_rest_route(TCF_URL_PREFIX, '/get-all-custom-fields', array(
      'methods' => 'GET',
      'callback' => array("TCF_CustomFields_Api", 'func_get_all_custom_fields'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/get-custom-field-types', array(
      'methods' => 'GET',
      'callback' => array("TCF_CustomFields_Api", 'func_custom_field_types'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/create-custom-field', array(
      'methods' => 'POST',
      'callback' => array("TCF_CustomFields_Api", 'func_create_custom_field'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/update-custom-field', array(
      'methods' => 'PUT',
      'callback' => array("TCF_CustomFields_Api", 'func_update_custom_field'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  
    register_rest_route(TCF_URL_PREFIX, '/delete-custom-field-by-id', array(
      'methods' => 'POST',
      'callback' => array("TCF_CustomFields_Api", 'func_delete_custom_field_by_id'),
      'args' => array(),
      'permission_callback' => function (WP_REST_Request $request) {
        return parent::verifyingNonce($request);
      },
    ));
  }
  
  public static function func_get_all_custom_fields(WP_REST_Request $request) {
    $CustomFieldTableInstance = new TCF_CustomFields_Table();
    $all_meta_box_cofigs = $CustomFieldTableInstance->getAll();
  
    return parent::sendSuccess($all_meta_box_cofigs);
  }
  
  public static function func_custom_field_types(WP_REST_Request $request) {
    $data = [
      array(
        "name" => "Input",
        "value" => "input",
      ),
      array(
        "name" => "Multiple Input",
        "value" => "multipleInput",
      ),
      array(
        "name" => "Text Area",
        "value" => "textarea",
      ),
      array(
        "name" => "Checkbox",
        "value" => "checkbox",
      ),
      array(
        "name" => "Radio",
        "value" => "radio",
      ),
      array(
        "name" => "Select",
        "value" => "select",
      ),
      array(
        "name" => "File",
        "value" => "file",
      ),
      array(
        "name" => "Image",
        "value" => "image",
      ),
      array(
        "name" => "WP Editor",
        "value" => "wpEditor",
      ),
    ];

    return parent::sendSuccess($data);
  }
  
  public static function func_create_custom_field(WP_REST_Request $request) {
    $custom_field_data = $request->get_params();
  
    $CustomFieldTableInstance = new TCF_CustomFields_Table();
    $customField = $CustomFieldTableInstance->createCustomField($custom_field_data);
  
    return parent::sendSuccess($customField);
  }
  
  public static function func_update_custom_field(WP_REST_Request $request) {
    $custom_field_data = $request->get_params();
    $CustomFieldTableInstance = new TCF_CustomFields_Table();
    $result = $CustomFieldTableInstance->updateCustomField($custom_field_data);
  
    return parent::sendSuccess($result);
  }
  
  public static function func_delete_custom_field_by_id(WP_REST_Request $request) {
    $custom_field_data = $request->get_params();
    $CustomFieldTableInstance = new TCF_CustomFields_Table();
    $result = $CustomFieldTableInstance->deleteCustomFieldById($custom_field_data);
  
    return parent::sendSuccess($result);
  }
}

add_action('rest_api_init', array("TCF_CustomFields_Api", "register_endpoints"));
