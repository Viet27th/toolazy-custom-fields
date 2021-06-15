<?php
namespace Database;
require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

abstract class TCF_Migration {
  public $tcf_db_version = TOOLAZY_CF_VERSION;
  abstract public function createTable() : void;

  public function getTableName(): string {
    return $this->table_name;
  }
}