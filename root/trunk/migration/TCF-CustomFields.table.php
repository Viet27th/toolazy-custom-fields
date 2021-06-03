<?php
// https://codex.wordpress.org/Creating_Tables_with_Plugins

require_once('TCF-Migration.php');
use Database\TCF_Migration; // alias = "use Database\Migration as Migration"

class TCF_CustomFields_Table extends TCF_Migration {
  public $wpdb;
  public $table_name;
  public $charset_collate;

  function __construct() {
    global $wpdb;
    $this->wpdb = $wpdb;
    $this->table_name = "{$this->wpdb->prefix}tcf_custom_fields";
    $this->charset_collate = $this->wpdb->get_charset_collate();
  }

  public function createTable(): void {
    $sql = "CREATE TABLE $this->table_name (
      id int(9) NOT NULL AUTO_INCREMENT,
      PRIMARY KEY  (id),
      json_configs json NOT NULL,
      created_at datetime NOT NULL DEFAULT current_timestamp(),
      updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
    ) $this->charset_collate;";

    maybe_create_table($this->table_name, $sql);
    add_option( 'tcf_db_version', $this->tcf_db_version );
  }

  public function getAll(): Array {
    $sql = "SELECT * FROM {$this->table_name} ORDER BY id DESC;";
    $result = $this->wpdb->get_results($sql);
    $convertResults = [];
    foreach ($result as $customField) {
      $arr1 = array(
        "id" => $customField->id,
      );
      $arr2 = json_decode($customField->json_configs, true);
      $convert = array_merge($arr1, $arr2);
      array_push($convertResults, $convert);
    }
    return $convertResults;
  }

  /**
   * Return new record if save success or false if not
   */
  public function createCustomField($data) {
    unset($data["id"]);
    $dataToSave = array(
      "json_configs" => json_encode($data)
    );
    $numberOfRowInserted = $this->wpdb->insert($this->table_name, $dataToSave);
    if($numberOfRowInserted) {
      // Because you have just created so just get the first record in table to return.
      $results = $this->wpdb->get_results("SELECT * FROM $this->table_name ORDER BY ID DESC LIMIT 1");
      $arr1 = array(
        "id" => $results[0]->id,
      );
      $arr2 = json_decode($results[0]->json_configs, true);
      $convert = array_merge($arr1, $arr2);
      return $convert;
    } else {
      return false;
    }
  }

  /**
   * Delete a record by id.
   * wpdb->query will
   * Return Boolean true for CREATE, ALTER, TRUNCATE and DROP queries 
   * Return Number of rows affected/selected for all other queries. 
   * Return Boolean false on error.
   * 
   * @return boolean - true if success else false
   */
  public function deleteCustomFieldById($data) {
    $id = $data["id"];
    $results = $this->wpdb->query("DELETE FROM $this->table_name WHERE id = $id");
    if($results !== false) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Update custom field record.
   * wpdb::update return the number of rows updated, or false on error.
   * so if you update a record by record ID but nothing changed in record, it will return 0.
   * Return 0 is not mean that it's error. Error occurs when it return false.
   * 
   * @return Object|boolean - Record created if success else false.
   */
  public function updateCustomField($data) {
    $id = $data["id"];
    unset($data["id"]);
    $dataToSave = json_encode($data);

    $results = $this->wpdb->update($this->table_name, array('json_configs' => $dataToSave), array( 'id' => $id ));
    if($results !== false) {
      $results = $this->wpdb->get_results("SELECT * FROM $this->table_name WHERE id = $id");
      $arr1 = array(
        "id" => $results[0]->id,
      );
      $arr2 = json_decode($results[0]->json_configs, true);
      $convert = array_merge($arr1, $arr2);
      return $convert;
    } else {
      return false;
    }
  }
}