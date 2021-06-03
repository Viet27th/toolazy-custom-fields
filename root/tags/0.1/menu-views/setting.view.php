<?php
$data = array(
  "pageTitle" => esc_html(get_admin_page_title()),
  "nonce" => wp_create_nonce(TCF_NONCE),
);
?>

<div class="wrap">
  <div id="toolazy-cf-root"></div>
</div>

<script>
  window.ToolazyCfBaseUrl = "<?php echo constant("TOOLAZY_CF_BASE_URL") ?>";
  window.ToolazyCfPluginUrl = "<?php echo constant("TOOLAZY_CF_DIRECTORY_URL_PATH") ?>";
</script>

<script 
  type="text/javascript" 
  src="<?php echo constant('TOOLAZY_CF_DIRECTORY_URL_PATH') . 'menu-views-react/dist/index.bundle.js' ?>"
  data="<?php echo htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8'); ?>"
></script>