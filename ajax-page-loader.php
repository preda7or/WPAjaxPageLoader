<?php
/*
Plugin Name: VVRC fork - Ajax Page Loader
Version: 1.0
Plugin URI: http://www.lukehowell.com/ajax-page-loader/
Description: Load pages within blog without reloading page.
Author: Luke Howell
Author URI: http://www.lukehowell.com/

** Original plugin modified by Stefan Gabor **
---------------------------------------------------------------------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
---------------------------------------------------------------------
*/

/*
Version 1.0 First Release.
*/

if(!function_exists('get_option'))
	require_once('../../../wp-config.php');

// Define path locations for page loader directory and file
define('PLUGIN_AJAXPAGELOADER_PATH', '/vvrc-page-loader/');

// Set Hook for outputting JavaScript
add_action('init', 'ajax_page_loader_script_inject');

// Set Hook for outputting CORS header
add_action('send_headers', 'ajax_page_loader_header_inject');


function ajax_page_loader_header_inject()
{
	if ( !is_admin() ) {
		header('Access-Control-Allow-Origin: '.get_site_url());
		header('Access-Control-Allow-Origin: '.str_replace("://www.","://",get_site_url()));
	}
}

function ajax_page_loader_script_inject() {
	if ( !is_admin() )
	{
		wp_register_script('jquery.ba-hashchange',WP_PLUGIN_URL.PLUGIN_AJAXPAGELOADER_PATH.'jquery.ba-hashchange.min.js',
			array('jquery'),'1.0' );

		wp_register_script('ajax-page-loader',WP_PLUGIN_URL.PLUGIN_AJAXPAGELOADER_PATH.'ajax-page-loader.js',
			array('jquery','jquery.ba-hashchange'),'1.0' );

		wp_enqueue_script('ajax-page-loader');
	}
}