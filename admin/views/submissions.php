<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

global $wpdb;
$table_name  = $wpdb->prefix . 'formcraftor_submissions';
$submissions = $wpdb->get_results( "SELECT * FROM $table_name ORDER BY id DESC" );
?>
<div class="wrap">
    <h1 class="wp-heading-inline"><?php esc_html_e( 'Formcraftor > Received Submissions', 'formcraftor' ); ?></h1>
    <hr class="wp-header-end">

    <?php if ( isset( $_GET['message'] ) && 'deleted' === $_GET['message'] ) : ?>
        <div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Submission(s) deleted successfully.', 'formcraftor' ); ?></p></div>
    <?php endif; ?>

    <form method="POST" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="formcraftor-submissions-bulk-form">
        <input type="hidden" name="action" value="formcraftor_bulk_delete_submissions" />
        <?php wp_nonce_field( 'formcraftor_bulk_delete_sub_action', 'formcraftor_bulk_sub_nonce' ); ?>

        <div class="tablenav top" style="margin-bottom: 10px;">
            <div class="alignleft actions bulkactions">
                <select name="bulk_action" id="bulk-action-selector-top">
                    <option value="-1"><?php esc_html_e( 'Bulk Actions', 'formcraftor' ); ?></option>
                    <option value="delete"><?php esc_html_e( 'Delete', 'formcraftor' ); ?></option>
                </select>
                <input type="submit" id="doaction" class="button action" value="<?php esc_attr_e( 'Apply', 'formcraftor' ); ?>" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete selected submissions?', 'formcraftor' ); ?>');" />
            </div>
        </div>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <td id="cb" class="manage-column column-cb check-column" style="width: 30px;"><input id="cb-select-all-1" type="checkbox"></td>
                    <th style="width: 60px;"><?php esc_html_e( 'ID', 'formcraftor' ); ?></th>
                    <th><?php esc_html_e( 'Form Title', 'formcraftor' ); ?></th>
                    <th><?php esc_html_e( 'Submitted Form Data', 'formcraftor' ); ?></th>
                    <th><?php esc_html_e( 'Date & Time', 'formcraftor' ); ?></th>
                    <th style="width: 100px;"><?php esc_html_e( 'Actions', 'formcraftor' ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php if ( ! empty( $submissions ) ) : ?>
                    <?php foreach ( $submissions as $sub ) : 
                        $dataArr    = json_decode( $sub->submitted_data, true );
                        $delete_url = wp_nonce_url( admin_url( 'admin-post.php?action=formcraftor_delete_submission&sub_id=' . $sub->id ), 'formcraftor_delete_sub_' . $sub->id );
                    ?>
                        <tr>
                            <th scope="row" class="check-column"><input type="checkbox" name="submission_ids[]" value="<?php echo esc_attr( $sub->id ); ?>"></th>
                            <td>#<?php echo esc_html( $sub->id ); ?></td>
                            <td><strong><?php echo esc_html( $sub->form_title ); ?></strong></td>
                            <td>
                                <?php if ( is_array( $dataArr ) && ! empty( $dataArr ) ) : ?>
                                    <ul style="margin: 0;">
                                        <?php foreach ( $dataArr as $key => $val ) : 
                                            // Clean field keys into human-readable label headers
                                            $clean_label = ucfirst( str_replace( [ 'field_', 'file_' ], '', $key ) );
                                        ?>
                                            <li>
                                                <strong><?php echo esc_html( $clean_label ); ?>:</strong>
                                                <?php if ( filter_var( $val, FILTER_VALIDATE_URL ) ) : 
                                                    $filename = basename( parse_url( $val, PHP_URL_PATH ) );
                                                ?>
                                                    <a href="<?php echo esc_url( $val ); ?>" target="_blank" style="color: #2271b1; text-decoration: underline; font-weight: 500;">
                                                        <?php echo esc_html( $filename ?: __( 'View / Download File', 'formcraftor' ) ); ?>
                                                    </a>
                                                <?php else : ?>
                                                    <?php echo esc_html( is_array( $val ) ? implode( ', ', $val ) : $val ); ?>
                                                <?php endif; ?>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php else : ?>
                                    <em><?php esc_html_e( 'No data captured.', 'formcraftor' ); ?></em>
                                <?php endif; ?>
                            </td>
                            <td><?php echo esc_html( $sub->created_at ); ?></td>
                            <td>
                                <a href="<?php echo esc_url( $delete_url ); ?>" class="button button-small button-link-delete" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete this submission?', 'formcraftor' ); ?>');"><?php esc_html_e( 'Delete', 'formcraftor' ); ?></a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr>
                        <td colspan="6"><?php esc_html_e( 'No form submissions received yet.', 'formcraftor' ); ?></td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const selectAll = document.getElementById('cb-select-all-1');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('input[name="submission_ids[]"]');
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
        });
    }
});
</script>