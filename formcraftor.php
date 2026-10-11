<?php
/**
 * Plugin Name: Formcraftor
 * Plugin URI:  https://github.com/najubudeen/formcraftor
 * Description: A lightweight, secure, and fully responsive custom form builder plugin built for the WordPress Gutenberg editor with comprehensive field options and WCAG AA compliance.
 * Version:     2.0.0
 * Author:      Najubudeen
 * License:     GPL-2.0+
 * Text Domain: formcraftor
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'FORMCRAFTOR_VERSION', '2.0.0' );
define( 'FORMCRAFTOR_PATH', plugin_dir_path( __FILE__ ) );
define( 'FORMCRAFTOR_URL', plugin_dir_url( __FILE__ ) );

/**
 * Main Formcraftor Plugin Class
 */
final class Formcraftor_Plugin {

    private static ?Formcraftor_Plugin $instance = null;

    public static function get_instance(): Formcraftor_Plugin {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        register_activation_hook( __FILE__, [ $this, 'activate' ] );
        add_action( 'init', [ $this, 'register_form_cpt' ] );
        add_action( 'init', [ $this, 'register_block' ] );
        add_action( 'init', [ $this, 'register_shortcodes' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_scripts' ] );
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
        add_action( 'admin_post_formcraftor_save_form', [ $this, 'handle_form_submission' ] );
        add_action( 'admin_post_formcraftor_delete_form', [ $this, 'handle_form_deletion' ] );
        add_action( 'admin_post_formcraftor_delete_submission', [ $this, 'handle_submission_deletion' ] );
        add_action( 'admin_post_formcraftor_bulk_delete_submissions', [ $this, 'handle_bulk_submission_deletion' ] );
        add_action( 'wp_ajax_formcraftor_submit', [ $this, 'handle_frontend_form_submission' ] );
        add_action( 'wp_ajax_nopriv_formcraftor_submit', [ $this, 'handle_frontend_form_submission' ] );
    }

    public function activate(): void {
        global $wpdb;
        $table_name      = $wpdb->prefix . 'formcraftor_submissions';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            form_id bigint(20) NOT NULL,
            form_title varchar(255) NOT NULL,
            submitted_data longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    public function enqueue_frontend_scripts(): void {
        wp_enqueue_script( 'formcraftor-view', FORMCRAFTOR_URL . 'build/formcraftor/view.js', [], FORMCRAFTOR_VERSION, true );
        wp_localize_script( 'formcraftor-view', 'formcraftor_ajax_obj', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
        ] );
    }

    public function register_form_cpt(): void {
        register_post_type( 'formcraftor_form', [
            'labels' => [
                'name'          => __( 'Forms', 'formcraftor' ),
                'singular_name' => __( 'Form', 'formcraftor' ),
            ],
            'public'             => false,
            'show_ui'            => false,
            'show_in_rest'       => true,
            'supports'           => [ 'title', 'custom-fields' ],
            'capability_type'    => 'post',
        ] );

        register_post_meta( 'formcraftor_form', '_formcraftor_fields', [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'auth_callback' => function() {
                return current_user_can( 'manage_options' );
            }
        ] );
    }

    public function register_block(): void {
        if ( function_exists( 'register_block_type_from_metadata' ) ) {
            register_block_type_from_metadata( FORMCRAFTOR_PATH . 'build/formcraftor' );
        }
    }

    public function register_shortcodes(): void {
        add_shortcode( 'formcraftor', [ $this, 'render_form_shortcode' ] );
    }

    public function render_form_shortcode( $atts ): string {
        $atts = shortcode_atts( [
            'id' => 0,
        ], $atts, 'formcraftor' );

        $form_id = absint( $atts['id'] );
        if ( ! $form_id ) {
            return '<div class="formcraftor-notice"><p>' . esc_html__( 'Invalid Form ID provided in shortcode.', 'formcraftor' ) . '</p></div>';
        }

        $form_post = get_post( $form_id );
        if ( ! $form_post || 'formcraftor_form' !== $form_post->post_type ) {
            return '<div class="formcraftor-notice"><p>' . esc_html__( 'Form not found.', 'formcraftor' ) . '</p></div>';
        }

        ob_start();
        $attributes = [ 'selectedFormId' => $form_id ];
        include FORMCRAFTOR_PATH . 'src/formcraftor/render.php';
        return ob_get_clean();
    }

    public function register_admin_menu(): void {
        add_menu_page(
            __( 'Formcraftor', 'formcraftor' ),
            __( 'Formcraftor', 'formcraftor' ),
            'manage_options',
            'formcraftor',
            [ $this, 'render_forms_list_page' ],
            'dashicons-feedback',
            30
        );

        add_submenu_page(
            'formcraftor',
            __( 'Forms', 'formcraftor' ),
            __( 'Forms', 'formcraftor' ),
            'manage_options',
            'formcraftor',
            [ $this, 'render_forms_list_page' ]
        );

        add_submenu_page(
            'formcraftor',
            __( 'Add New Form', 'formcraftor' ),
            __( 'Add New Form', 'formcraftor' ),
            'manage_options',
            'formcraftor-add-form',
            [ $this, 'render_add_form_page' ]
        );

        add_submenu_page(
            'formcraftor',
            __( 'Submissions', 'formcraftor' ),
            __( 'Submissions', 'formcraftor' ),
            'manage_options',
            'formcraftor-submissions',
            [ $this, 'render_submissions_page' ]
        );
    }

    public function render_forms_list_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $action = isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '';
        if ( 'edit' === $action ) {
            include_once FORMCRAFTOR_PATH . 'admin/views/add-form.php';
        } else {
            include_once FORMCRAFTOR_PATH . 'admin/views/dashboard.php';
        }
    }

    public function render_add_form_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        include_once FORMCRAFTOR_PATH . 'admin/views/add-form.php';
    }

    public function render_submissions_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        include_once FORMCRAFTOR_PATH . 'admin/views/submissions.php';
    }

    public function handle_form_submission(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Unauthorized user.', 'formcraftor' ) );
        }

        check_admin_referer( 'formcraftor_save_form_action', 'formcraftor_nonce' );

        $form_id     = isset( $_POST['form_id'] ) ? absint( $_POST['form_id'] ) : 0;
        $form_title  = isset( $_POST['form_title'] ) ? sanitize_text_field( wp_unslash( $_POST['form_title'] ) ) : '';
        $form_fields = isset( $_POST['form_fields'] ) ? wp_unslash( $_POST['form_fields'] ) : '';

        if ( ! empty( $form_title ) ) {
            if ( $form_id > 0 ) {
                wp_update_post( [
                    'ID'         => $form_id,
                    'post_title' => $form_title,
                ] );
                update_post_meta( $form_id, '_formcraftor_fields', sanitize_text_field( $form_fields ) );
            } else {
                $form_id = wp_insert_post( [
                    'post_title'   => $form_title,
                    'post_type'    => 'formcraftor_form',
                    'post_status'  => 'publish',
                ] );

                if ( $form_id && ! is_wp_error( $form_id ) ) {
                    update_post_meta( $form_id, '_formcraftor_fields', sanitize_text_field( $form_fields ) );
                }
            }
        }

        wp_safe_redirect( admin_url( 'admin.php?page=formcraftor&message=saved' ) );
        exit;
    }

    public function handle_form_deletion(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Unauthorized user.', 'formcraftor' ) );
        }

        $form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;
        if ( $form_id > 0 ) {
            check_admin_referer( 'formcraftor_delete_form_' . $form_id );
            wp_delete_post( $form_id, true );
        }

        wp_safe_redirect( admin_url( 'admin.php?page=formcraftor&message=deleted' ) );
        exit;
    }

    public function handle_submission_deletion(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Unauthorized user.', 'formcraftor' ) );
        }

        $sub_id = isset( $_GET['sub_id'] ) ? absint( $_GET['sub_id'] ) : 0;
        if ( $sub_id > 0 ) {
            check_admin_referer( 'formcraftor_delete_sub_' . $sub_id );
            global $wpdb;
            $table_name = $wpdb->prefix . 'formcraftor_submissions';
            $wpdb->delete( $table_name, [ 'id' => $sub_id ], [ '%d' ] );
        }

        wp_safe_redirect( admin_url( 'admin.php?page=formcraftor-submissions&message=deleted' ) );
        exit;
    }

    public function handle_bulk_submission_deletion(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Unauthorized user.', 'formcraftor' ) );
        }

        check_admin_referer( 'formcraftor_bulk_delete_sub_action', 'formcraftor_bulk_sub_nonce' );

        $bulk_action    = isset( $_POST['bulk_action'] ) ? sanitize_text_field( wp_unslash( $_POST['bulk_action'] ) ) : '';
        $submission_ids = isset( $_POST['submission_ids'] ) ? array_map( 'absint', $_POST['submission_ids'] ) : [];

        if ( 'delete' === $bulk_action && ! empty( $submission_ids ) ) {
            global $wpdb;
            $table_name   = $wpdb->prefix . 'formcraftor_submissions';
            $ids_imploded = implode( ',', $submission_ids );
            $wpdb->query( "DELETE FROM $table_name WHERE id IN ($ids_imploded)" );
        }

        wp_safe_redirect( admin_url( 'admin.php?page=formcraftor-submissions&message=deleted' ) );
        exit;
    }

    public function handle_frontend_form_submission(): void {
        if ( ! isset( $_POST['formcraftor_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['formcraftor_nonce'] ) ), 'formcraftor_frontend_nonce' ) ) {
            wp_send_json_error( [ 'message' => __( 'Security verification failed.', 'formcraftor' ) ] );
        }

        $form_id     = isset( $_POST['form_id'] ) ? absint( $_POST['form_id'] ) : 0;
        $form_post   = get_post( $form_id );
        $form_title  = $form_post ? $form_post->post_title : 'Form #' . $form_id;
        $fields_json = get_post_meta( $form_id, '_formcraftor_fields', true );
        $form_fields = ! empty( $fields_json ) ? json_decode( $fields_json, true ) : [];

        $submitted_fields = [];

        // Validate phone number field if present
        if ( isset( $_POST['field_phone'] ) ) {
            $phone_val = preg_replace( '/[^0-9]/', '', sanitize_text_field( wp_unslash( $_POST['field_phone'] ) ) );
            
            // Check min/max rules from saved field structure
            $min_dig = 5;
            $max_dig = 10;
            if ( is_array( $form_fields ) ) {
                foreach ( $form_fields as $f ) {
                    if ( isset( $f['type'] ) && 'phone' === $f['type'] ) {
                        $min_dig = isset( $f['minDigits'] ) ? absint( $f['minDigits'] ) : 5;
                        $max_dig = isset( $f['maxDigits'] ) ? absint( $f['maxDigits'] ) : 10;
                        break;
                    }
                }
            }

            $len = strlen( $phone_val );
            if ( $len < $min_dig || $len > $max_dig ) {
                wp_send_json_error( [ 'message' => sprintf( __( 'Phone number must be between %d and %d digits.', 'formcraftor' ), $min_dig, $max_dig ) ] );
            }
        }

        foreach ( $_POST as $key => $value ) {
            if ( in_array( $key, [ 'formcraftor_nonce', 'instance_id', 'form_id', 'action' ], true ) ) {
                continue;
            }
            $clean_key                      = sanitize_text_field( $key );
            $submitted_fields[ $clean_key ] = is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : sanitize_text_field( wp_unslash( $value ) );
        }

        $uploaded_files_summary = [];

        if ( ! empty( $_FILES ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            foreach ( $_FILES as $file_key => $file_array ) {
                if ( ! empty( $file_array['name'] ) ) {
                    $upload = wp_handle_upload( $file_array, [ 'test_form' => false ] );
                    if ( isset( $upload['url'] ) ) {
                        $file_url                        = esc_url_raw( $upload['url'] );
                        $field_label                     = 'Uploaded File';
                        if ( preg_match( '/field_file_(\d+)/', $file_key, $matches ) ) {
                            $idx = intval( $matches[1] );
                            if ( isset( $form_fields[ $idx ]['label'] ) && ! empty( $form_fields[ $idx ]['label'] ) ) {
                                $field_label = sanitize_text_field( $form_fields[ $idx ]['label'] );
                            }
                        }

                        $submitted_fields[ $field_label ] = $file_url;

                        $uploaded_files_summary[] = [
                            'label' => $field_label,
                            'name'  => sanitize_file_name( $file_array['name'] ),
                            'url'   => $file_url,
                        ];
                    }
                }
            }
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'formcraftor_submissions';
        
        $this->activate();

        $inserted = $wpdb->insert(
            $table_name,
            [
                'form_id'        => $form_id,
                'form_title'     => $form_title,
                'submitted_data' => wp_json_encode( $submitted_fields ),
                'created_at'     => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s' ]
        );

        if ( false === $inserted ) {
            wp_send_json_error( [ 'message' => __( 'Could not save submission to database.', 'formcraftor' ) ] );
        }

        wp_send_json_success( [
            'message' => __( 'Form submitted successfully!', 'formcraftor' ),
            'files'   => $uploaded_files_summary,
        ] );
    }
}

Formcraftor_Plugin::get_instance();