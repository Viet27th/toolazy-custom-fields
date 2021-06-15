#This guideline using for Developers.
## Grant permission
1. Under General Tab, in XAMPP app, click Open Terminal
2. A terminal will be launched with something like, root@debian:~#, on the terminal shell
3. On that terminal shell, type, chmod -R 0777  /opt/lampp/htdocs/ and enter
4. Exit, the terminal and you be good to go

## Remove ._ files (Files are created automatically on Mac OS)
Open terminal, go to the root folder of project and run : "dot_clean -n ."

## Fix Wordpress Asking for FTP Credentials
Open wp-config.php add this line: "define( 'FS_METHOD', 'direct' );"
This declare allows the current user to edit or install files in your folder

## Fix Wordpress Visual Editor Not Working
Reference: https://siteefy.com/wordpress-visual-editor-not-working/
Sometimes "classic editor" is not woking on "block editor". In my case is when I add a custom field type "wp editor" to post type is "post" which using "Gutenberg", I can't focus to Visual tab on editor to edit content.
To fix it:
Open wp-config.php add this line: "define('CONCATENATE_SCRIPTS', false);"

## To write log
Open wp-config.php 
Change define( 'WP_DEBUG', false ); to true.
And add "define( 'WP_DEBUG_LOG', true );" right after.
This function Enable Debug logging to the /wp-content/debug.log file.
After that, create a new file called "debug.log" inside "wp-content" folder.
If you want to edit this file manual, Grant permission again like above.

## Change permalink to enable call my custom api
The issue is like Woocommerce api issue: 
https://stackoverflow.com/questions/22710078/woocommerce-rest-api-404-error
https://woocommerce.github.io/woocommerce-rest-api-docs/#requirements
On the Admin Panel, to Settings -> Permalinks. On Default Settings radio group, select the "Post name" one. Save the changes. Default permalinks will not work.

## The Plugin Header Comment 
Plugin Name: (required) your plugin’s name must be unique. Before publishing, search the Plugin Directory for plugins with the same name
Plugin URI: the home page of the plugin
Description: a one-line plugin description (less than 140 characters)
Version: the current plugin version (must be higher of the previous version)
Author: one or more author names, separated by commas
Author URI: the author’s home page
License: the slug of the plugin’s licence (i.e. GPL2)
License URI: the link to the full text of the license (i.e. https://www.gnu.org/licenses/gpl-2.0.html)
Text Domain: the text domain of the plugin
Domain Path: where to find the translation files

## The Readme.txt File
Plugin name (Wrapped inside == == look like this == Plugin name ==)
Contributors: (a list of wordpress.org userid’s)
Donate link: http://example.com/
Tags: (plugin tags)
Requires at least: (WordPress version)
Tested up to: (WordPress version)
Stable tag: (plugin version)
License: GPLv2 or later (or compatible)
License URI: https://www.gnu.org/licenses/gpl-2.0.html

## Publish plugin
- svn /assets to save plugin banner, plugin icon, screenshorts
- Push all new code to svn /trunk
- Push all older version to svn /tags/{folder_name_match_with_version}