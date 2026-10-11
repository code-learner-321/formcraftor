<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$forms = get_posts( [
    'post_type'      => 'formcraftor_form',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
] );
?>
<div class="wrap">
    <h1 class="wp-heading-inline"><?php esc_html_e( 'Formcraftor Forms', 'formcraftor' ); ?></h1>
    <a href="<?php echo esc_url( admin_url( 'admin.php?page=formcraftor-add-form' ) ); ?>" class="page-title-action"><?php esc_html_e( 'Add New Form', 'formcraftor' ); ?></a>
    <hr class="wp-header-end">

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th><?php esc_html_e( 'Form Title', 'formcraftor' ); ?></th>
                <th><?php esc_html_e( 'Shortcode / Usage', 'formcraftor' ); ?></th>
                <th><?php esc_html_e( 'Date Created', 'formcraftor' ); ?></th>
                <th><?php esc_html_e( 'Actions', 'formcraftor' ); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php if ( ! empty( $forms ) ) : ?>
                <?php foreach ( $forms as $form ) : 
                    $delete_url = wp_nonce_url( admin_url( 'admin-post.php?action=formcraftor_delete_form&form_id=' . $form->ID ), 'formcraftor_delete_form_' . $form->ID );
                ?>
                    <tr>
                        <td><strong><?php echo esc_html( $form->post_title ); ?></strong></td>
                        <td><code>[formcraftor id="<?php echo esc_attr( $form->ID ); ?>"]</code></td>
                        <td><?php echo esc_html( get_the_date( '', $form ) ); ?></td>
                        <td>
                            <a href="<?php echo esc_url( admin_url( 'admin.php?page=formcraftor&action=edit&form_id=' . $form->ID ) ); ?>" class="button button-small"><?php esc_html_e( 'Edit', 'formcraftor' ); ?></a>
                            <a href="<?php echo esc_url( $delete_url ); ?>" class="button button-small button-link-delete" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete this form?', 'formcraftor' ); ?>');"><?php esc_html_e( 'Delete', 'formcraftor' ); ?></a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else : ?>
                <tr>
                    <td colspan="4"><?php esc_html_e( 'No forms found. Create your first form!', 'formcraftor' ); ?></td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>