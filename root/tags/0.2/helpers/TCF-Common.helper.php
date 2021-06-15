<?php

class TCF_Common_Helper {

	/**
	 * Call to show log on server in "path_to/wp-content/debug.log"
	 * 
	 * @param mixed @log - whatever you want to show
	 */
	public static function server_log($log) {
		if (WP_DEBUG === true) {
			if (is_array($log) || is_object($log)) {
				error_log(print_r($log, true));
			} else {
				error_log($log);
			}
		}
	}

	/**
	 * Call to show log on client.
	 */
	public static function client_log($data) {
		$output = $data;
		if (is_array($output))
			$output = implode(',', $output);;
		echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
	}

	/**
	 *
	 * Includes a file within the Toolazy Custom Fields plugin.
	 *
	 * @date	1/3/2021
	 * @since	0.0
	 *
	 * @param	string $filename The specified file.
	 * @return	void
	 */
	public static function include($filename = '')
	{
		$file_path = constant('TOOLAZY_CF_PATH') . ltrim($filename, '/');
		if (file_exists($file_path)) {
			include_once($file_path);
		} else {
			TCF_Common_Helper::server_log($file_path . "is not existing.");
		}
	}

	/**
	 *
	 * This function will load in a file from the 'custom-field-layouts' folder and 
	 * allow variables to be passed through
	 *
	 * @type function
	 * @date	1/3/2021
	 * @since	0.0
	 *
	 * @param string	$layout_path
	 * @param array	$args
	 * @return void
	 */

	public static function get_custom_field_layout($layout_path = '', $args = array())
	{
		// Allow layout file name shortcut
		if (substr($layout_path, -4) !== '.php') {
			$layout_path = constant('TOOLAZY_CF_PATH') . "custom-field-layouts/{$layout_path}.php";
		} else {
			$layout_path = constant('TOOLAZY_CF_PATH') . $layout_path;
		}

		if (file_exists($layout_path)) {
			extract($args); // pass variables to layout.
			include($layout_path);
		}
	}

	/**
	 * Get all the public Post Type of this project.
	 * 
	 * @param string	$output_type - the output should be object string names or object full data.
	 * @return array is object in javascript
	 */
	public static function get_post_types($output_type = "names")
	{
		$args = array(
			'public'   => true, // only get the post types are public.
			// '_builtin' => false,  // if false, only get custom post type
		);
		$output = $output_type; // names or objects, note names is the default
		$operator = 'and'; // 'and' or 'or'
		$post_types = get_post_types($args, $output, $operator);

		return $post_types;
	}
}

