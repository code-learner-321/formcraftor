<?php
/**
 * Server-side rendering for the Formcraftor Widget block.
 *
 * @package Formcraftor
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$selected_form_id = isset( $attributes['selectedFormId'] ) ? absint( $attributes['selectedFormId'] ) : 0;
if ( ! $selected_form_id ) {
    return '<div class="formcraftor-notice"><p>' . esc_html__( 'Please select a form to display.', 'formcraftor' ) . '</p></div>';
}

$form_post = get_post( $selected_form_id );
if ( ! $form_post || 'formcraftor_form' !== $form_post->post_type ) {
    return '<div class="formcraftor-notice"><p>' . esc_html__( 'Selected form no longer exists.', 'formcraftor' ) . '</p></div>';
}

$form_title      = $form_post->post_title;
$fields_json     = get_post_meta( $selected_form_id, '_formcraftor_fields', true );
$fields          = ! empty( $fields_json ) ? json_decode( $fields_json, true ) : [];
$field_overrides = isset( $attributes['fieldOverrides'] ) ? json_decode( $attributes['fieldOverrides'], true ) : [];

$instance_id = 'fc-inst-' . $selected_form_id . '-' . wp_rand( 1000, 9999 );
$nonce       = wp_create_nonce( 'formcraftor_frontend_nonce' );
?>

<div class="formcraftor-wrapper <?php echo esc_attr( $instance_id ); ?>">
    <form id="<?php echo esc_attr( $instance_id ); ?>-form" class="formcraftor-form" method="POST" enctype="multipart/form-data">
        <h3 class="formcraftor-title"><?php echo esc_html( $form_title ); ?></h3>
        
        <input type="hidden" name="formcraftor_nonce" value="<?php echo esc_attr( $nonce ); ?>" />
        <input type="hidden" name="instance_id" value="<?php echo esc_attr( $instance_id ); ?>" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $selected_form_id ); ?>" />

        <?php if ( ! empty( $fields ) && is_array( $fields ) ) : ?>
            <?php foreach ( $fields as $idx => $field ) : 
                $f_type    = sanitize_text_field( $field['type'] ?? 'text' );
                $f_label   = isset( $field_overrides[$idx]['label'] ) ? sanitize_text_field( $field_overrides[$idx]['label'] ) : sanitize_text_field( $field['label'] ?? 'Field' );
                $f_req     = ! empty( $field['required'] ) ? 'required' : '';
                
                $min_dig   = isset( $field_overrides[$idx]['minDigits'] ) ? absint( $field_overrides[$idx]['minDigits'] ) : absint( $field['minDigits'] ?? 5 );
                $max_dig   = isset( $field_overrides[$idx]['maxDigits'] ) ? absint( $field_overrides[$idx]['maxDigits'] ) : absint( $field['maxDigits'] ?? 10 );

                $pad_top   = isset( $field_overrides[$idx]['paddingTop'] ) ? sanitize_text_field( $field_overrides[$idx]['paddingTop'] ) : sanitize_text_field( $field['paddingTop'] ?? '0px' );
                $pad_bot   = isset( $field_overrides[$idx]['paddingBottom'] ) ? sanitize_text_field( $field_overrides[$idx]['paddingBottom'] ) : sanitize_text_field( $field['paddingBottom'] ?? '10px' );
                $pad_left  = isset( $field_overrides[$idx]['paddingLeft'] ) ? sanitize_text_field( $field_overrides[$idx]['paddingLeft'] ) : sanitize_text_field( $field['paddingLeft'] ?? '0px' );
                $pad_right = isset( $field_overrides[$idx]['paddingRight'] ) ? sanitize_text_field( $field_overrides[$idx]['paddingRight'] ) : sanitize_text_field( $field['paddingRight'] ?? '0px' );
                
                $inner_style = sprintf( 
                    'padding-top: %s; padding-bottom: %s; padding-left: %s; padding-right: %s; box-sizing: border-box; width: 100%%; max-width: 100%%;', 
                    esc_attr( $pad_top ), 
                    esc_attr( $pad_bot ), 
                    esc_attr( $pad_left ), 
                    esc_attr( $pad_right ) 
                );
            ?>
                <div class="formcraftor-field-group" style="width: 100%; max-width: 100%; box-sizing: border-box;">
                    <div class="formcraftor-field-inner" style="<?php echo esc_attr( $inner_style ); ?>">
                        <label>
                            <?php echo esc_html( $f_label ); ?>
                            <?php if ( $f_req ) : ?> <span class="required">*</span><?php endif; ?>
                        </label>

                        <?php if ( 'text' === $f_type || 'firstname' === $f_type || 'lastname' === $f_type ) : ?>
                            <input type="text" name="field_<?php echo esc_attr( $f_type ); ?>" <?php echo esc_attr( $f_req ); ?> style="padding: 10px 5px !important;" />
                        
                        <?php elseif ( 'phone' === $f_type ) : ?>
                            <input type="tel" 
                                   name="field_phone" 
                                   pattern="[0-9]{<?php echo esc_attr( $min_dig ); ?>,<?php echo esc_attr( $max_dig ); ?>}" 
                                   minlength="<?php echo esc_attr( $min_dig ); ?>" 
                                   maxlength="<?php echo esc_attr( $max_dig ); ?>" 
                                   placeholder="<?php echo esc_attr( sprintf( __( 'Enter %d-%d digits', 'formcraftor' ), $min_dig, $max_dig ) ); ?>" 
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '');" 
                                   <?php echo esc_attr( $f_req ); ?> 
                                   style="padding: 10px 5px !important;" />

                        <?php elseif ( 'email' === $f_type ) : ?>
                            <input type="email" name="field_email" <?php echo esc_attr( $f_req ); ?> placeholder="name@example.com" style="padding: 10px 5px !important;" />
                        
                        <?php elseif ( 'description' === $f_type ) : ?>
                            <textarea name="field_description" rows="4" <?php echo esc_attr( $f_req ); ?> style="padding: 10px 5px !important;"></textarea>
                        
                        <?php elseif ( 'file' === $f_type ) : ?>
                            <input type="file" name="field_file_<?php echo esc_attr( $idx ); ?>" <?php echo esc_attr( $f_req ); ?> />
                        
                        <?php elseif ( 'dropdown' === $f_type ) : ?>
                            <select name="field_dropdown" <?php echo esc_attr( $f_req ); ?> style="padding: 10px 5px !important;">
                                <option value=""><?php esc_html_e( 'Choose option...', 'formcraftor' ); ?></option>
                                <option value="option1"><?php esc_html_e( 'Option 1', 'formcraftor' ); ?></option>
                                <option value="option2"><?php esc_html_e( 'Option 2', 'formcraftor' ); ?></option>
                            </select>
                        
                        <?php elseif ( 'gender' === $f_type ) : ?>
                            <div class="formcraftor-radio-group">
                                <label><input type="radio" name="field_gender" value="male" /> <?php esc_html_e( 'Male', 'formcraftor' ); ?></label>
                                <label><input type="radio" name="field_gender" value="female" /> <?php esc_html_e( 'Female', 'formcraftor' ); ?></label>
                                <label><input type="radio" name="field_gender" value="other" /> <?php esc_html_e( 'Other', 'formcraftor' ); ?></label>
                            </div>
                        
                        <?php elseif ( 'checkbox' === $f_type ) : ?>
                            <label><input type="checkbox" name="field_checkbox" value="1" <?php echo esc_attr( $f_req ); ?> /> <?php esc_html_e( 'I agree', 'formcraftor' ); ?></label>
                        
                        <?php elseif ( 'toggle' === $f_type ) : ?>
                            <label><input type="checkbox" name="field_toggle" value="1" class="formcraftor-toggle" <?php echo esc_attr( $f_req ); ?> /> <?php esc_html_e( 'Enable Setting', 'formcraftor' ); ?></label>
                        
                        <?php elseif ( 'submit' === $f_type ) : ?>
                            <button type="submit" class="formcraftor-submit-btn"><?php echo esc_html( $f_label ); ?></button>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else : ?>
            <p><?php esc_html_e( 'No fields configured for this form yet.', 'formcraftor' ); ?></p>
        <?php endif; ?>
    </form>
</div>