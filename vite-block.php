<?php

/**
 * Plugin Name:       Vite Block
 * Description:
 * Version:           0.1.0
 * Requires at least: 5.7
 * Tested up to:      6.3
 * Requires PHP:      5.6
 * Author:            codekraft
 * Author URI:        https://codekraft.it
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       vite-block
 */

if ( ! defined( 'ABSPATH' ) ) exit;

\add_action( 'init', function() {
    \register_block_type( __DIR__ );
} );
function custom_header_code() {
    ?>
    <script type="module">
      import RefreshRuntime from 'http://localhost:8888/wp-content/plugins/vite-block/build/@react-refresh'
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="http://localhost:8888/wp-content/plugins/vite-block/build/@vite/client"></script>
    <script type="module" src="/wp-content/plugins/vite-block/build/vite-block.js"></script>
    <?php
}

add_action( 'admin_head', 'custom_header_code' );
