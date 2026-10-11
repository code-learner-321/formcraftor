<?php
/**
 * Server-side rendering for the Formcraftor Widget block.
 *
 * @package Formcraftor
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$selected_form_id  = isset( $attributes['selectedFormId'] ) ? sanitize_text_field( $attributes['selectedFormId'] ) : 'test_form';
$custom_form_title = isset( $attributes['formTitle'] ) ? sanitize_text_field( $attributes['formTitle'] ) : '';
$field_overrides   = isset( $attributes['fieldOverrides'] ) ? json_decode( $attributes['fieldOverrides'], true ) : [];
if ( ! is_array( $field_overrides ) ) {
    $field_overrides = [];
}

// Default reference form fields ("Form Test")
$reference_fields = [
    [
        'id'                 => 'field_text_1',
        'type'               => 'text',
        'label'              => 'Text Label',
        'nameId'             => 'text_field',
        'placeholder'        => 'Enter text...',
        'defaultValue'       => '',
        'helpText'           => 'Enter your text input here.',
        'required'           => true,
        'minLength'          => 0,
        'maxLength'          => 255,
        'inputType'          => 'text',
        'pattern'            => '',
        'fieldWidth'         => '100%',
        'customWidth'        => '100%',
        'labelPosition'      => 'above',
        'enablePrefixSuffix' => false,
        'prefixText'         => '',
        'suffixText'         => '',
    ],
    [
        'id'           => 'field_firstname_2',
        'type'         => 'firstname',
        'label'        => 'Firstname Label',
        'nameId'       => 'first_name',
        'placeholder'  => 'John',
        'defaultValue' => '',
        'required'     => false,
        'minLength'    => 1,
        'maxLength'    => 50,
        'autocomplete' => true,
        'helpText'     => 'Please enter your first name.',
        'fieldWidth'   => '50%',
        'customWidth'  => '50%',
    ],
    [
        'id'           => 'field_lastname_3',
        'type'         => 'lastname',
        'label'        => 'Lastname Label',
        'nameId'       => 'last_name',
        'placeholder'  => 'Doe',
        'defaultValue' => '',
        'required'     => false,
        'minLength'    => 1,
        'maxLength'    => 50,
        'autocomplete' => true,
        'helpText'     => 'Please enter your last name.',
        'fieldWidth'   => '50%',
        'customWidth'  => '50%',
    ],
    [
        'id'                   => 'field_phone_4',
        'type'                 => 'phone',
        'label'                => 'Phone Label',
        'nameId'               => 'phone_number',
        'placeholder'          => 'Enter phone number',
        'defaultCountryCode'   => '+1',
        'defaultValue'         => '',
        'required'             => false,
        'minDigits'            => 7,
        'maxDigits'            => 15,
        'allowedChars'         => 'digits_plus',
        'phoneValidation'      => true,
        'internationalSupport' => true,
        'helpText'             => 'Include country code if applicable.',
        'fieldWidth'           => '100%',
        'customWidth'          => '100%',
    ],
    [
        'id'                     => 'field_email_5',
        'type'                   => 'email',
        'label'                  => 'Email Label',
        'nameId'                 => 'email_address',
        'placeholder'            => 'user@example.com',
        'defaultValue'           => '',
        'required'               => true,
        'emailValidation'        => true,
        'restrictAllowedDomains' => false,
        'allowedDomains'         => '',
        'blockedDomains'         => '',
        'confirmationField'      => false,
        'helpText'               => 'We will never share your email.',
        'fieldWidth'             => '100%',
        'customWidth'            => '100%',
    ],
    [
        'id'           => 'field_desc_6',
        'type'         => 'description',
        'label'        => 'Description Label',
        'nameId'       => 'user_description',
        'placeholder'  => 'Write your message...',
        'defaultValue' => '',
        'required'     => false,
        'minLength'    => 0,
        'maxLength'    => 1000,
        'rows'         => 4,
        'charCounter'  => true,
        'resizeOption' => 'vertical',
        'helpText'     => 'Provide detailed information.',
        'fieldWidth'   => '100%',
        'customWidth'  => '100%',
    ],
    [
        'id'               => 'field_file_7',
        'type'             => 'file',
        'label'            => 'File Label',
        'nameId'           => 'uploaded_file',
        'buttonText'       => 'Choose File',
        'required'         => false,
        'allowedFileTypes' => [ 'PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG', 'WebP', 'ZIP' ],
        'maxFileSize'      => 10,
        'maxFiles'         => 3,
        'multipleFiles'    => false,
        'dragAndDrop'      => true,
        'displayPreview'   => true,
        'helpText'         => 'Supported: PDF, DOC, DOCX, JPG, JPEG, PNG, WebP, ZIP (Max 10MB)',
        'fieldWidth'       => '100%',
        'customWidth'      => '100%',
    ],
    [
        'id'                       => 'field_dropdown_8',
        'type'                     => 'dropdown',
        'label'                    => 'Dropdown Label',
        'nameId'                   => 'inquiry_type',
        'placeholder'              => 'Select an option...',
        'required'                 => false,
        'options'                  => [
            [ 'label' => 'General Inquiry', 'value' => 'general', 'isDefault' => false ],
            [ 'label' => 'Support', 'value' => 'support', 'isDefault' => false ],
            [ 'label' => 'Sales', 'value' => 'sales', 'isDefault' => false ],
        ],
        'allowMultiple'            => false,
        'searchable'               => false,
        'allowCustomOption'        => false,
        'enableConditionalOptions' => false,
        'helpText'                 => 'Choose the subject that best matches your request.',
        'fieldWidth'               => '100%',
        'customWidth'              => '100%',
    ],
    [
        'id'               => 'field_gender_9',
        'type'             => 'gender',
        'label'            => 'Gender Label',
        'nameId'           => 'gender_selection',
        'required'         => false,
        'options'          => [
            [ 'label' => 'Male', 'value' => 'male', 'isDefault' => false ],
            [ 'label' => 'Female', 'value' => 'female', 'isDefault' => false ],
            [ 'label' => 'Other', 'value' => 'other', 'isDefault' => false ],
        ],
        'layout'           => 'horizontal',
        'gridColumns'      => 3,
        'allowOtherOption' => false,
        'otherOptionText'  => 'Please specify',
        'helpText'         => 'Select your preferred option.',
        'fieldWidth'       => '100%',
        'customWidth'      => '100%',
    ],
    [
        'id'             => 'field_checkbox_10',
        'type'           => 'checkbox',
        'label'          => 'Checkbox Label',
        'nameId'         => 'terms_agreement',
        'checkboxText'   => 'I agree to the terms and conditions',
        'required'       => true,
        'defaultChecked' => false,
        'defaultValue'   => 'agree',
        'helpText'       => 'You must agree before submitting.',
        'labelPosition'  => 'after',
        'fieldWidth'     => '100%',
        'customWidth'    => '100%',
    ],
    [
        'id'                  => 'field_toggle_11',
        'type'                => 'toggle',
        'label'               => 'Toggle Label',
        'nameId'              => 'notifications_toggle',
        'toggleText'          => 'Enable Setting',
        'defaultState'        => false,
        'onValue'             => 'yes',
        'offValue'            => 'no',
        'requiredToBeEnabled' => false,
        'disabledState'       => false,
        'helpText'            => 'Toggle this switch to turn the setting on or off.',
        'displayStyle'        => 'switch',
        'fieldWidth'          => '100%',
        'customWidth'         => '100%',
    ],
    [
        'id'                     => 'field_submit_12',
        'type'                   => 'submit',
        'label'                  => 'Submit Label',
        'buttonText'             => 'Submit Form',
        'nameId'                 => 'submit_btn',
        'buttonType'             => 'submit',
        'alignment'              => 'left',
        'size'                   => 'medium',
        'bgColor'                => '#2271b1',
        'textColor'              => '#ffffff',
        'borderRadius'           => 4,
        'paddingTop'             => 12,
        'paddingBottom'          => 12,
        'paddingLeft'            => 24,
        'paddingRight'           => 24,
        'loadingText'            => 'Submitting...',
        'showLoadingIndicator'   => true,
        'disableWhileSubmitting' => true,
        'successMessage'         => 'Thank you! Your submission has been received.',
        'redirectAfterSubmit'    => false,
        'redirectUrl'            => '',
        'resetFormAfterSubmit'   => true,
        'fieldWidth'             => '100%',
        'customWidth'            => '100%',
    ],
];

// Determine fields and form title
$form_post = null;
if ( 'test_form' !== $selected_form_id && is_numeric( $selected_form_id ) ) {
    $form_post = get_post( absint( $selected_form_id ) );
}

if ( $form_post && 'formcraftor_form' === $form_post->post_type ) {
    $form_title_default = $form_post->post_title;
    $raw_meta           = get_post_meta( $form_post->ID, '_formcraftor_fields', true );
    $fields             = ! empty( $raw_meta ) ? json_decode( $raw_meta, true ) : [];
    if ( ! is_array( $fields ) || empty( $fields ) ) {
        $fields = $reference_fields;
    }
} else {
    $form_title_default = 'Form Test';
    $fields             = $reference_fields;
    $selected_form_id   = 'test_form';
}

$final_title = ! empty( $custom_form_title ) ? $custom_form_title : $form_title_default;
$instance_id = 'fc-inst-' . ( is_numeric( $selected_form_id ) ? $selected_form_id : 'ref' ) . '-' . wp_rand( 1000, 9999 );
$nonce       = wp_create_nonce( 'formcraftor_frontend_nonce' );
?>

<div class="formcraftor-wrapper <?php echo esc_attr( $instance_id ); ?>">
    <form id="<?php echo esc_attr( $instance_id ); ?>-form" class="formcraftor-form" method="POST" enctype="multipart/form-data">
        <h3 class="formcraftor-title"><?php echo esc_html( $final_title ); ?></h3>
        
        <input type="hidden" name="formcraftor_nonce" value="<?php echo esc_attr( $nonce ); ?>" />
        <input type="hidden" name="instance_id" value="<?php echo esc_attr( $instance_id ); ?>" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $selected_form_id ); ?>" />
        <input type="hidden" name="form_title" value="<?php echo esc_attr( $final_title ); ?>" />

        <div class="formcraftor-fields-flex-container" style="display: flex; flex-wrap: wrap; gap: 0;">
            <?php foreach ( $fields as $idx => $field ) : 
                $f_type = sanitize_text_field( $field['type'] ?? 'text' );
                $ov     = $field_overrides[ $idx ] ?? [];

                // Safe fallback helper functions that never trigger undefined index notices
                $get_val = function( $key, $default = '' ) use ( &$ov, &$field ) {
                    return $ov[ $key ] ?? $field[ $key ] ?? $default;
                };

                $is_checked = function( $key, $default = false ) use ( &$ov, &$field ) {
                    return ! empty( $ov[ $key ] ?? $field[ $key ] ?? $default );
                };

                $f_label       = sanitize_text_field( $get_val( 'label', ucfirst( $f_type ) . ' Label' ) );
                $f_name_id     = sanitize_text_field( $get_val( 'nameId', 'field_' . $f_type . '_' . $idx ) );
                $f_placeholder = sanitize_text_field( $get_val( 'placeholder', '' ) );
                $f_default     = sanitize_text_field( $get_val( 'defaultValue', '' ) );
                $f_help        = sanitize_text_field( $get_val( 'helpText', '' ) );
                $f_req         = $is_checked( 'required', false );

                // Width calculation
                $width_setting = sanitize_text_field( $get_val( 'fieldWidth', '100%' ) );
                $custom_width  = sanitize_text_field( $get_val( 'customWidth', '100%' ) );
                $f_width       = ( 'custom' === $width_setting ) ? $custom_width : $width_setting;

                // Label position
                $f_label_pos   = sanitize_text_field( $get_val( 'labelPosition', 'above' ) );

                $group_style = sprintf(
                    'width: %s; padding: 8px 10px; box-sizing: border-box;',
                    esc_attr( $f_width )
                );
            ?>
                <div class="formcraftor-field-group formcraftor-type-<?php echo esc_attr( $f_type ); ?>" style="<?php echo esc_attr( $group_style ); ?>" data-field-index="<?php echo esc_attr( $idx ); ?>">
                    <?php if ( 'submit' !== $f_type ) : ?>
                        <input type="hidden" name="_fc_field_labels[<?php echo esc_attr( $f_name_id ); ?>]" value="<?php echo esc_attr( $f_label ); ?>" />
                    <?php endif; ?>
                    
                    <?php if ( 'hidden' !== $f_label_pos && 'checkbox' !== $f_type && 'submit' !== $f_type ) : ?>
                        <label for="<?php echo esc_attr( $f_name_id ); ?>" style="<?php echo 'inline' === $f_label_pos ? 'display:inline-block; margin-right:10px; font-weight:600;' : 'display:block; margin-bottom:6px; font-weight:600; font-size:14px;'; ?>">
                            <?php echo esc_html( $f_label ); ?>
                            <?php if ( $f_req ) : ?><span class="required" style="color:#d63638;"> *</span><?php endif; ?>
                        </label>
                    <?php endif; ?>

                    <?php // 2. TEXT FIELD ?>
                    <?php if ( 'text' === $f_type ) : 
                        $input_type   = sanitize_text_field( $get_val( 'inputType', 'text' ) );
                        $min_len      = absint( $get_val( 'minLength', 0 ) );
                        $max_len      = absint( $get_val( 'maxLength', 255 ) );
                        $pattern      = sanitize_text_field( $get_val( 'pattern', '' ) );
                        $has_prefix   = $is_checked( 'enablePrefixSuffix', false );
                        $prefix_text  = sanitize_text_field( $get_val( 'prefixText', '' ) );
                        $suffix_text  = sanitize_text_field( $get_val( 'suffixText', '' ) );
                    ?>
                        <div class="formcraftor-input-wrapper" style="display: flex; align-items: stretch; width: 100%;">
                            <?php if ( $has_prefix && ! empty( $prefix_text ) ) : ?>
                                <span class="formcraftor-prefix" style="padding: 10px 14px; background: #f0f0f1; border: 1px solid #dcdcde; border-right: none; border-radius: 4px 0 0 4px; font-size: 14px; display: flex; align-items: center;"><?php echo esc_html( $prefix_text ); ?></span>
                            <?php endif; ?>
                            <input type="<?php echo esc_attr( $input_type ); ?>" 
                                   id="<?php echo esc_attr( $f_name_id ); ?>" 
                                   name="<?php echo esc_attr( $f_name_id ); ?>" 
                                   placeholder="<?php echo esc_attr( $f_placeholder ); ?>" 
                                   value="<?php echo esc_attr( $f_default ); ?>" 
                                   minlength="<?php echo esc_attr( $min_len ); ?>" 
                                   maxlength="<?php echo esc_attr( $max_len ); ?>" 
                                   <?php if ( ! empty( $pattern ) ) : ?>pattern="<?php echo esc_attr( $pattern ); ?>"<?php endif; ?>
                                   <?php echo $f_req ? 'required' : ''; ?> 
                                   style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: <?php echo ( $has_prefix || ! empty( $suffix_text ) ) ? '0' : '4px'; ?>; font-size: 14px;" />
                            <?php if ( $has_prefix && ! empty( $suffix_text ) ) : ?>
                                <span class="formcraftor-suffix" style="padding: 10px 14px; background: #f0f0f1; border: 1px solid #dcdcde; border-left: none; border-radius: 0 4px 4px 0; font-size: 14px; display: flex; align-items: center;"><?php echo esc_html( $suffix_text ); ?></span>
                            <?php endif; ?>
                        </div>

                    <?php // 3. FIRSTNAME FIELD ?>
                    <?php elseif ( 'firstname' === $f_type ) : 
                        $min_len = absint( $get_val( 'minLength', 1 ) );
                        $max_len = absint( $get_val( 'maxLength', 50 ) );
                        $auto_c  = $is_checked( 'autocomplete', true ) ? 'given-name' : 'off';
                    ?>
                        <input type="text" 
                               id="<?php echo esc_attr( $f_name_id ); ?>" 
                               name="<?php echo esc_attr( $f_name_id ); ?>" 
                               autocomplete="<?php echo esc_attr( $auto_c ); ?>"
                               placeholder="<?php echo esc_attr( $f_placeholder ?: 'John' ); ?>" 
                               value="<?php echo esc_attr( $f_default ); ?>" 
                               minlength="<?php echo esc_attr( $min_len ); ?>" 
                               maxlength="<?php echo esc_attr( $max_len ); ?>" 
                               <?php echo $f_req ? 'required' : ''; ?> 
                               style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px;" />

                    <?php // 4. LASTNAME FIELD ?>
                    <?php elseif ( 'lastname' === $f_type ) : 
                        $min_len = absint( $get_val( 'minLength', 1 ) );
                        $max_len = absint( $get_val( 'maxLength', 50 ) );
                        $auto_c  = $is_checked( 'autocomplete', true ) ? 'family-name' : 'off';
                    ?>
                        <input type="text" 
                               id="<?php echo esc_attr( $f_name_id ); ?>" 
                               name="<?php echo esc_attr( $f_name_id ); ?>" 
                               autocomplete="<?php echo esc_attr( $auto_c ); ?>"
                               placeholder="<?php echo esc_attr( $f_placeholder ?: 'Doe' ); ?>" 
                               value="<?php echo esc_attr( $f_default ); ?>" 
                               minlength="<?php echo esc_attr( $min_len ); ?>" 
                               maxlength="<?php echo esc_attr( $max_len ); ?>" 
                               <?php echo $f_req ? 'required' : ''; ?> 
                               style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px;" />

                    <?php // 5. PHONE FIELD ?>
                    <?php elseif ( 'phone' === $f_type ) : 
                        $min_dig   = absint( $get_val( 'minDigits', 7 ) );
                        $max_dig   = absint( $get_val( 'maxDigits', 15 ) );
                        $cc        = sanitize_text_field( $get_val( 'defaultCountryCode', '+1' ) );
                        $char_mode = sanitize_text_field( $get_val( 'allowedChars', 'digits_plus' ) );
                    ?>
                        <div style="display:flex; gap: 6px; width: 100%;">
                            <span class="formcraftor-phone-cc" style="padding: 10px 12px; background: #f0f0f1; border: 1px solid #dcdcde; border-radius: 4px; font-weight: 600; font-size: 14px; white-space: nowrap;"><?php echo esc_html( $cc ); ?></span>
                            <input type="tel" 
                                   id="<?php echo esc_attr( $f_name_id ); ?>" 
                                   name="<?php echo esc_attr( $f_name_id ); ?>" 
                                   placeholder="<?php echo esc_attr( $f_placeholder ?: sprintf( __( 'Phone number (%d-%d digits)', 'formcraftor' ), $min_dig, $max_dig ) ); ?>" 
                                   value="<?php echo esc_attr( $f_default ); ?>"
                                   minlength="<?php echo esc_attr( $min_dig ); ?>" 
                                   maxlength="<?php echo esc_attr( $max_dig ); ?>" 
                                   data-min-digits="<?php echo esc_attr( $min_dig ); ?>"
                                   data-max-digits="<?php echo esc_attr( $max_dig ); ?>"
                                   data-allowed-chars="<?php echo esc_attr( $char_mode ); ?>"
                                   <?php echo $f_req ? 'required' : ''; ?> 
                                   style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px;" />
                        </div>

                    <?php // 6. EMAIL FIELD ?>
                    <?php elseif ( 'email' === $f_type ) : 
                        $has_confirm = $is_checked( 'confirmationField', false );
                    ?>
                        <input type="email" 
                               id="<?php echo esc_attr( $f_name_id ); ?>" 
                               name="<?php echo esc_attr( $f_name_id ); ?>" 
                               placeholder="<?php echo esc_attr( $f_placeholder ?: 'user@example.com' ); ?>" 
                               value="<?php echo esc_attr( $f_default ); ?>" 
                               <?php echo $f_req ? 'required' : ''; ?> 
                               style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px;" />
                        
                        <?php if ( $has_confirm ) : ?>
                            <div style="margin-top: 10px;">
                                <label for="<?php echo esc_attr( $f_name_id ); ?>_confirm" style="display:block; margin-bottom:4px; font-weight:600; font-size:13px;">
                                    <?php esc_html_e( 'Confirm Email', 'formcraftor' ); ?> <?php if ( $f_req ) : ?><span style="color:#d63638;">*</span><?php endif; ?>
                                </label>
                                <input type="email" 
                                       id="<?php echo esc_attr( $f_name_id ); ?>_confirm" 
                                       name="<?php echo esc_attr( $f_name_id ); ?>_confirm" 
                                       placeholder="<?php esc_attr_e( 'Re-enter your email', 'formcraftor' ); ?>" 
                                       <?php echo $f_req ? 'required' : ''; ?> 
                                       style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px;" />
                            </div>
                        <?php endif; ?>

                    <?php // 7. DESCRIPTION / TEXTAREA ?>
                    <?php elseif ( 'description' === $f_type ) : 
                        $rows     = absint( $get_val( 'rows', 4 ) );
                        $resize   = sanitize_text_field( $get_val( 'resizeOption', 'vertical' ) );
                        $min_len  = absint( $get_val( 'minLength', 0 ) );
                        $max_len  = absint( $get_val( 'maxLength', 1000 ) );
                        $show_cnt = $is_checked( 'charCounter', true );
                    ?>
                        <textarea id="<?php echo esc_attr( $f_name_id ); ?>" 
                                  name="<?php echo esc_attr( $f_name_id ); ?>" 
                                  rows="<?php echo esc_attr( $rows ); ?>" 
                                  placeholder="<?php echo esc_attr( $f_placeholder ); ?>" 
                                  minlength="<?php echo esc_attr( $min_len ); ?>" 
                                  maxlength="<?php echo esc_attr( $max_len ); ?>" 
                                  <?php echo $f_req ? 'required' : ''; ?> 
                                  style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px; resize: <?php echo esc_attr( $resize ); ?>;"><?php echo esc_textarea( $f_default ); ?></textarea>
                        <?php if ( $show_cnt ) : ?>
                            <div class="formcraftor-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 4px;">
                                <span class="current-chars"><?php echo strlen( (string) $f_default ); ?></span> / <?php echo esc_html( $max_len ); ?> <?php esc_html_e( 'characters', 'formcraftor' ); ?>
                            </div>
                        <?php endif; ?>

                    <?php // 8. FILE UPLOAD FIELD ?>
                    <?php elseif ( 'file' === $f_type ) : 
                        $btn_txt   = sanitize_text_field( $get_val( 'buttonText', __( 'Choose File', 'formcraftor' ) ) );
                        $is_multi  = $is_checked( 'multipleFiles', false );
                        $max_files = absint( $get_val( 'maxFiles', 3 ) );
                        $max_mb    = absint( $get_val( 'maxFileSize', 10 ) );
                        $types     = $get_val( 'allowedFileTypes', [ 'PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG', 'WebP', 'ZIP' ] );
                        if ( ! is_array( $types ) ) {
                            $types = explode( ',', (string) $types );
                        }
                        $types_str = implode( ', ', array_map( 'trim', $types ) );
                        $accept    = '.' . implode( ',.', array_map( 'strtolower', array_map( 'trim', $types ) ) );
                    ?>
                        <div class="formcraftor-file-dropzone" style="border: 2px dashed #8c8f94; border-radius: 6px; padding: 20px; text-align: center; background: #f9f9fb;">
                            <input type="file" 
                                   id="<?php echo esc_attr( $f_name_id ); ?>" 
                                   name="<?php echo esc_attr( $f_name_id ); ?><?php echo $is_multi ? '[]' : ''; ?>" 
                                   accept="<?php echo esc_attr( $accept ); ?>"
                                   <?php echo $is_multi ? 'multiple' : ''; ?>
                                   data-max-size-mb="<?php echo esc_attr( $max_mb ); ?>"
                                   data-max-files="<?php echo esc_attr( $max_files ); ?>"
                                   <?php echo $f_req ? 'required' : ''; ?> 
                                   style="display: none;" />
                            <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                                <?php esc_html_e( 'Drag & drop files here or click to browse', 'formcraftor' ); ?>
                            </div>
                            <button type="button" class="button button-secondary formcraftor-browse-btn" onclick="this.previousElementSibling.previousElementSibling.click();" style="padding: 6px 16px; font-size: 13px; cursor: pointer;">
                                <?php echo esc_html( $btn_txt ); ?>
                            </button>
                            <div style="font-size: 12px; color: #757575; margin-top: 8px;">
                                <?php esc_html_e( 'Supported formats: ', 'formcraftor' ); ?><?php echo esc_html( $types_str ); ?> (<?php echo sprintf( esc_html__( 'Max %dMB', 'formcraftor' ), $max_mb ); ?>)
                            </div>
                            <div class="formcraftor-file-preview-list" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;"></div>
                        </div>

                    <?php // 9. DROPDOWN / SELECT FIELD ?>
                    <?php elseif ( 'dropdown' === $f_type ) : 
                        $opts     = $get_val( 'options', [ [ 'label' => 'General Inquiry', 'value' => 'general' ], [ 'label' => 'Support', 'value' => 'support' ], [ 'label' => 'Sales', 'value' => 'sales' ] ] );
                        $is_multi = $is_checked( 'allowMultiple', false );
                    ?>
                        <select id="<?php echo esc_attr( $f_name_id ); ?>" 
                                name="<?php echo esc_attr( $f_name_id ); ?><?php echo $is_multi ? '[]' : ''; ?>" 
                                <?php echo $is_multi ? 'multiple size="4"' : ''; ?> 
                                <?php echo $f_req ? 'required' : ''; ?> 
                                style="width: 100%; padding: 10px 12px; border: 1px solid #dcdcde; border-radius: 4px; font-size: 14px; background: #fff;">
                            <?php if ( ! $is_multi ) : ?>
                                <option value=""><?php echo esc_html( $f_placeholder ?: __( 'Select an option...', 'formcraftor' ) ); ?></option>
                            <?php endif; ?>
                            <?php if ( is_array( $opts ) ) : ?>
                                <?php foreach ( $opts as $opt ) : ?>
                                    <option value="<?php echo esc_attr( $opt['value'] ?? '' ); ?>" <?php echo ! empty( $opt['isDefault'] ) ? 'selected' : ''; ?>>
                                        <?php echo esc_html( $opt['label'] ?? '' ); ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </select>

                    <?php // 10. GENDER / RADIO BUTTON FIELD ?>
                    <?php elseif ( 'gender' === $f_type ) : 
                        $opts        = $get_val( 'options', [ [ 'label' => 'Male', 'value' => 'male' ], [ 'label' => 'Female', 'value' => 'female' ], [ 'label' => 'Other', 'value' => 'other' ] ] );
                        $layout      = sanitize_text_field( $get_val( 'layout', 'horizontal' ) );
                        $cols        = absint( $get_val( 'gridColumns', 3 ) );
                        $allow_other = $is_checked( 'allowOtherOption', false );
                        $other_text  = sanitize_text_field( $get_val( 'otherOptionText', __( 'Other', 'formcraftor' ) ) );

                        $grid_style = 'display: flex; flex-wrap: wrap; gap: 14px;';
                        if ( 'vertical' === $layout ) {
                            $grid_style = 'display: flex; flex-direction: column; gap: 8px;';
                        } elseif ( 'grid' === $layout ) {
                            $grid_style = sprintf( 'display: grid; grid-template-columns: repeat(%d, 1fr); gap: 12px;', max( 1, $cols ) );
                        }
                    ?>
                        <div class="formcraftor-radio-container" style="<?php echo esc_attr( $grid_style ); ?>">
                            <?php if ( is_array( $opts ) ) : ?>
                                <?php foreach ( $opts as $o_idx => $opt ) : ?>
                                    <label style="display: inline-flex; align-items: center; gap: 6px; font-weight: normal; font-size: 14px; cursor: pointer;">
                                        <input type="radio" 
                                               name="<?php echo esc_attr( $f_name_id ); ?>" 
                                               value="<?php echo esc_attr( $opt['value'] ?? '' ); ?>" 
                                               <?php echo ! empty( $opt['isDefault'] ) ? 'checked' : ''; ?> 
                                               <?php echo $f_req ? 'required' : ''; ?> />
                                        <?php echo esc_html( $opt['label'] ?? '' ); ?>
                                    </label>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            <?php if ( $allow_other ) : ?>
                                <label style="display: inline-flex; align-items: center; gap: 6px; font-weight: normal; font-size: 14px; cursor: pointer;">
                                    <input type="radio" name="<?php echo esc_attr( $f_name_id ); ?>" value="other" <?php echo $f_req ? 'required' : ''; ?> />
                                    <span><?php echo esc_html( $other_text ); ?></span>
                                </label>
                            <?php endif; ?>
                        </div>

                    <?php // 11. CHECKBOX FIELD ?>
                    <?php elseif ( 'checkbox' === $f_type ) : 
                        $chk_text  = sanitize_text_field( $get_val( 'checkboxText', __( 'I agree to the terms and conditions', 'formcraftor' ) ) );
                        $chk_def   = $is_checked( 'defaultChecked', false );
                        $chk_val   = sanitize_text_field( $get_val( 'defaultValue', 'agree' ) );
                        $pos_label = sanitize_text_field( $get_val( 'labelPosition', 'after' ) );
                    ?>
                        <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; font-weight: 500;">
                            <?php if ( 'before' === $pos_label ) : ?>
                                <span><?php echo esc_html( $f_label ); ?></span>
                            <?php endif; ?>
                            <input type="checkbox" 
                                   id="<?php echo esc_attr( $f_name_id ); ?>" 
                                   name="<?php echo esc_attr( $f_name_id ); ?>" 
                                   value="<?php echo esc_attr( $chk_val ); ?>" 
                                   <?php echo $chk_def ? 'checked' : ''; ?> 
                                   <?php echo $f_req ? 'required' : ''; ?> />
                            <span><?php echo esc_html( $chk_text ); ?></span>
                            <?php if ( $f_req ) : ?><span style="color:#d63638;">*</span><?php endif; ?>
                        </label>

                    <?php // 12. TOGGLE / SWITCH FIELD ?>
                    <?php elseif ( 'toggle' === $f_type ) : 
                        $t_text      = sanitize_text_field( $get_val( 'toggleText', __( 'Enable Setting', 'formcraftor' ) ) );
                        $t_state     = $is_checked( 'defaultState', false );
                        $on_val      = sanitize_text_field( $get_val( 'onValue', 'yes' ) );
                        $req_enabled = $is_checked( 'requiredToBeEnabled', false );
                        $disabled    = $is_checked( 'disabledState', false );
                        $style_mode  = sanitize_text_field( $get_val( 'displayStyle', 'switch' ) );
                    ?>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <?php if ( 'switch' === $style_mode ) : ?>
                                <label class="formcraftor-switch" style="position: relative; display: inline-block; width: 44px; height: 24px; margin: 0; cursor: <?php echo $disabled ? 'not-allowed' : 'pointer'; ?>;">
                                    <input type="checkbox" 
                                           id="<?php echo esc_attr( $f_name_id ); ?>" 
                                           name="<?php echo esc_attr( $f_name_id ); ?>" 
                                           value="<?php echo esc_attr( $on_val ); ?>" 
                                           <?php echo $t_state ? 'checked' : ''; ?> 
                                           <?php echo $disabled ? 'disabled' : ''; ?> 
                                           <?php echo $req_enabled ? 'required' : ''; ?> 
                                           style="opacity: 0; width: 0; height: 0;" />
                                    <span class="formcraftor-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: <?php echo $t_state ? '#2271b1' : '#ccc'; ?>; transition: .3s; border-radius: 24px;"></span>
                                </label>
                            <?php else : ?>
                                <input type="checkbox" 
                                       id="<?php echo esc_attr( $f_name_id ); ?>" 
                                       name="<?php echo esc_attr( $f_name_id ); ?>" 
                                       value="<?php echo esc_attr( $on_val ); ?>" 
                                       <?php echo $t_state ? 'checked' : ''; ?> 
                                       <?php echo $disabled ? 'disabled' : ''; ?> 
                                       <?php echo $req_enabled ? 'required' : ''; ?> />
                            <?php endif; ?>
                            <span style="font-size: 14px; font-weight: 500;"><?php echo esc_html( $t_text ); ?></span>
                        </div>

                    <?php // 13. SUBMIT BUTTON ?>
                    <?php elseif ( 'submit' === $f_type ) : 
                        $btn_text     = sanitize_text_field( $get_val( 'buttonText', $f_label ?: __( 'Submit Form', 'formcraftor' ) ) );
                        $btn_align    = sanitize_text_field( $get_val( 'alignment', 'left' ) );
                        $btn_type     = sanitize_text_field( $get_val( 'buttonType', 'submit' ) );
                        $btn_size     = sanitize_text_field( $get_val( 'size', 'medium' ) );
                        $btn_bg       = sanitize_text_field( $get_val( 'bgColor', '#2271b1' ) );
                        $btn_color    = sanitize_text_field( $get_val( 'textColor', '#ffffff' ) );
                        $btn_rad      = absint( $get_val( 'borderRadius', 4 ) );
                        $pad_top      = absint( $get_val( 'paddingTop', 12 ) );
                        $pad_right    = absint( $get_val( 'paddingRight', 24 ) );
                        $pad_bottom   = absint( $get_val( 'paddingBottom', 12 ) );
                        $pad_left     = absint( $get_val( 'paddingLeft', 24 ) );
                        $loading_text = sanitize_text_field( $get_val( 'loadingText', __( 'Submitting...', 'formcraftor' ) ) );
                        $show_load    = $is_checked( 'showLoadingIndicator', true ) ? '1' : '0';
                        $dis_submit   = $is_checked( 'disableWhileSubmitting', true ) ? '1' : '0';
                        $succ_msg     = sanitize_text_field( $get_val( 'successMessage', __( 'Thank you! Your submission has been received.', 'formcraftor' ) ) );
                        $redirect     = $is_checked( 'redirectAfterSubmit', false ) ? '1' : '0';
                        $redir_url    = esc_url_raw( $get_val( 'redirectUrl', '' ) );
                        $reset_form   = $is_checked( 'resetFormAfterSubmit', true ) ? '1' : '0';

                        $align_style = 'text-align: left;';
                        if ( 'center' === $btn_align ) {
                            $align_style = 'text-align: center;';
                        } elseif ( 'right' === $btn_align ) {
                            $align_style = 'text-align: right;';
                        } elseif ( 'full' === $btn_align ) {
                            $align_style = 'width: 100%;';
                        }

                        $btn_css = sprintf(
                            'background: %s; color: %s; border-radius: %dpx; padding: %dpx %dpx %dpx %dpx; border: none; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; %s',
                            esc_attr( $btn_bg ),
                            esc_attr( $btn_color ),
                            esc_attr( $btn_rad ),
                            esc_attr( $pad_top ),
                            esc_attr( $pad_right ),
                            esc_attr( $pad_bottom ),
                            esc_attr( $pad_left ),
                            'full' === $btn_align ? 'width: 100%;' : ''
                        );
                    ?>
                        <div style="<?php echo esc_attr( $align_style ); ?>">
                            <button type="<?php echo esc_attr( $btn_type ); ?>" 
                                    class="formcraftor-submit-btn btn-<?php echo esc_attr( $btn_size ); ?>" 
                                    id="<?php echo esc_attr( $f_name_id ); ?>" 
                                    name="<?php echo esc_attr( $f_name_id ); ?>" 
                                    data-loading-text="<?php echo esc_attr( $loading_text ); ?>"
                                    data-show-loading="<?php echo esc_attr( $show_load ); ?>"
                                    data-disable-submitting="<?php echo esc_attr( $dis_submit ); ?>"
                                    data-success-message="<?php echo esc_attr( $succ_msg ); ?>"
                                    data-redirect="<?php echo esc_attr( $redirect ); ?>"
                                    data-redirect-url="<?php echo esc_attr( $redir_url ); ?>"
                                    data-reset-form="<?php echo esc_attr( $reset_form ); ?>"
                                    style="<?php echo esc_attr( $btn_css ); ?>">
                                <span class="formcraftor-btn-text"><?php echo esc_html( $btn_text ); ?></span>
                            </button>
                        </div>
                    <?php endif; ?>

                    <?php if ( ! empty( $f_help ) ) : ?>
                        <p class="formcraftor-help-text" style="margin: 5px 0 0 0; font-size: 12px; color: #666;"><?php echo esc_html( $f_help ); ?></p>
                    <?php endif; ?>

                </div>
            <?php endforeach; ?>
        </div>

        <div class="formcraftor-ajax-notice" style="display: none; margin-top: 15px; padding: 12px 16px; border-radius: 4px;"></div>
    </form>
</div>