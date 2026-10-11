<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;
$form_title = '';$form_fields_json = '[]';

if ( $form_id > 0 ) {
    $form_post = get_post($form_id );
    if ( $form_post && 'formcraftor_form' ===$form_post->post_type ) {
        $form_title =$form_post->post_title;
        $form_fields_json = get_post_meta($form_id, '_formcraftor_fields', true );
        if ( empty( $form_fields_json ) ) {$form_fields_json = '[]';
        }
    }
}
?>
<div class="wrap formcraftor-admin-builder">
    <h1 style="display:inline-block; margin-right: 20px;"><?php echo $form_id ? esc_html__( 'Formcraftor > Edit Form', 'formcraftor' ) : esc_html__( 'Formcraftor > Add New Form', 'formcraftor' ); ?></h1>
    
    <form method="POST" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="formcraftor-builder-form">
        <input type="hidden" name="action" value="formcraftor_save_form" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $form_id ); ?>" />
        <input type="hidden" name="form_fields" id="form_fields_payload" value="" />
        <?php wp_nonce_field( 'formcraftor_save_form_action', 'formcraftor_nonce' ); ?>

        <!-- Prominent Save Button at Top -->
        <div style="margin: 10px 0 15px 0;">
            <input type="submit" name="submit_top" class="button button-primary button-large" value="<?php esc_attr_e( 'Save Form', 'formcraftor' ); ?>" />
        </div>

        <!-- Live Form Preview Box -->
        <div class="postbox" style="margin-bottom: 20px; border: 1px solid #2271b1;">
            <h2 class="hndle" style="background: #f0f6fc; border-bottom: 1px solid #c3c4c7;"><span><?php esc_html_e( 'Live Form Preview', 'formcraftor' ); ?></span></h2>
            <div class="inside" id="live-form-preview-container" style="background: #fff; padding: 20px; border-radius: 4px;">
                <h3 id="preview-form-title" style="margin-top:0;"><?php echo esc_html( $form_title ?: 'Untitled Form' ); ?></h3>
                <div id="preview-fields-container"><em><?php esc_html_e( 'Form preview will update as you add fields...', 'formcraftor' ); ?></em></div>
            </div>
        </div>

        <div id="poststuff">
            <div id="post-body" class="metabox-holder columns-2">
                
                <!-- Main Container Area -->
                <div id="post-body-content">
                    <div class="postbox">
                        <h2 class="hndle"><span><?php esc_html_e( 'Form Container & Title', 'formcraftor' ); ?></span></h2>
                        <div class="inside">
                            <p>
                                <label for="form_title"><strong><?php esc_html_e( 'Form Name / Title', 'formcraftor' ); ?></strong></label><br />
                                <input name="form_title" type="text" id="form_title" value="<?php echo esc_attr( $form_title ); ?>" class="widefat" placeholder="Enter form title..." required style="padding: 8px 5px; font-size: 16px;" />
                            </p>
                            <div class="formcraftor-container-dropzone" id="form-container-dropzone">
                                <p class="placeholder-text"><em><?php esc_html_e( 'Drag and drop fields from the sidebar editor or click to add them into your form container.', 'formcraftor' ); ?></em></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Editor Controls -->
                <div id="postbox-container-1" class="postbox-container">
                    <div class="postbox">
                        <h2 class="hndle"><span><?php esc_html_e( 'Sidebar Field Editor', 'formcraftor' ); ?></span></h2>
                        <div class="inside">
                            <p class="description"><?php esc_html_e( 'Drag or click fields to add them:', 'formcraftor' ); ?></p>
                            <ul class="formcraftor-field-list-selector">
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="text"><?php esc_html_e( '↕ Text Field (Required)', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="firstname"><?php esc_html_e( '↕ First Name Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="lastname"><?php esc_html_e( '↕ Last Name Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="phone"><?php esc_html_e( '↕ Phone Field (Validated)', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="email"><?php esc_html_e( '↕ Email Field (Required)', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="description"><?php esc_html_e( '↕ Description Text Area', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="file"><?php esc_html_e( '↕ File Upload Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="dropdown"><?php esc_html_e( '↕ Selectable Dropdown', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="gender"><?php esc_html_e( '↕ Gender Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="checkbox"><?php esc_html_e( '↕ Checkbox Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="toggle"><?php esc_html_e( '↕ Toggle Button Field', 'formcraftor' ); ?></div></li>
                                <li><div class="draggable-field-item button button-secondary" draggable="true" data-type="submit"><?php esc_html_e( '↕ Submit Button Field', 'formcraftor' ); ?></div></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </form>
</div>

<style>
.formcraftor-admin-builder .formcraftor-container-dropzone {
    border: 2px dashed #ccd0d4;
    padding: 20px;
    background: #fff;
    min-height: 250px;
    border-radius: 4px;
}
.formcraftor-field-list-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
}
.draggable-field-item {
    width: 100%;
    text-align: left;
    cursor: grab;
    box-sizing: border-box;
    display: block;
    line-height: 28px;
    padding: 0 5px !important;
}
.form-field-card {
    background: #f0f0f1;
    border: 1px solid #c3c4c7;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: move;
}
.form-field-card label {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
}
.form-field-card input[type="text"],
.form-field-card input[type="number"] {
    width: 100%;
    margin-bottom: 8px;
    padding: 6px 5px !important;
    box-sizing: border-box;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('form-container-dropzone');
    const draggableItems = document.querySelectorAll('.draggable-field-item');
    const builderForm = document.getElementById('formcraftor-builder-form');
    const payloadInput = document.getElementById('form_fields_payload');
    const formTitleInput = document.getElementById('form_title');
    const previewTitle = document.getElementById('preview-form-title');
    const previewFieldsContainer = document.getElementById('preview-fields-container');

    let fieldsState = <?php echo $form_fields_json; ?>;
    if (!Array.isArray(fieldsState)) {
        fieldsState = [];
    }
    renderBuilderFields();
    updateLivePreview();

    formTitleInput.addEventListener('input', function() {
        previewTitle.textContent = this.value || 'Untitled Form';
    });

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-type'));
        });
        item.addEventListener('click', function() {
            addFieldToState(this.getAttribute('data-type'));
        });
    });

    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.style.borderColor = '#2271b1';
    });

    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropzone.style.borderColor = '#ccd0d4';
    });

    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.style.borderColor = '#ccd0d4';
        const type = e.dataTransfer.getData('text/plain');
        if (type) {
            addFieldToState(type);
        }
    });

    function addFieldToState(type) {
        const fieldId = 'field_' + Math.random().toString(36).substr(2, 6);
        const newField = {
            id: fieldId,
            type: type,
            label: type.charAt(0).toUpperCase() + type.slice(1) + ' Label',
            required: type === 'text' || type === 'email' || type === 'description' || type === 'phone',
            minDigits: type === 'phone' ? 5 : undefined,
            maxDigits: type === 'phone' ? 10 : undefined
        };

        fieldsState.push(newField);
        renderBuilderFields();
        updateLivePreview();
    }

    function renderBuilderFields() {
        if (fieldsState.length === 0) {
            dropzone.innerHTML = '<p class="placeholder-text"><em>Drag and drop fields from the sidebar editor or click to add them into your form container.</em></p>';
            return;
        }

        dropzone.innerHTML = '';
        fieldsState.forEach((field, index) => {
            const card = document.createElement('div');
            card.className = 'form-field-card';
            card.draggable = true;
            card.dataset.index = index;

            let extraHtml = '';
            if (field.type === 'phone') {
                extraHtml = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;">
                        <div>
                            <label>Min Digits:</label>
                            <input type="number" class="min-digits-input" data-index="${index}" value="${field.minDigits || 5}" min="1" max="20" style="padding: 4px 5px !important;" />
                        </div>
                        <div>
                            <label>Max Digits:</label>
                            <input type="number" class="max-digits-input" data-index="${index}" value="${field.maxDigits || 10}" min="1" max="20" style="padding: 4px 5px !important;" />
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong>↕ Type: ${field.type.toUpperCase()}</strong>
                    <div>
                        <button type="button" class="button button-small move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>▲</button>
                        <button type="button" class="button button-small move-down" data-index="${index}" ${index === fieldsState.length - 1 ? 'disabled' : ''}>▼</button>
                        <button type="button" class="button-link-delete remove-field" data-index="${index}" style="margin-left: 10px;">Delete</button>
                    </div>
                </div>
                <label>Field Label Name:</label>
                <input type="text" class="field-label-input" data-index="${index}" value="${field.label}" style="padding: 6px 5px !important;" />
                ${extraHtml}
            `;

            card.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', index);
            });
            card.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            card.addEventListener('drop', function(e) {
                e.preventDefault();
                const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const targetIdx = index;
                if (!isNaN(draggedIdx) && draggedIdx !== targetIdx) {
                    const movedItem = fieldsState.splice(draggedIdx, 1)[0];
                    fieldsState.splice(targetIdx, 0, movedItem);
                    renderBuilderFields();
                    updateLivePreview();
                }
            });

            dropzone.appendChild(card);
        });

        document.querySelectorAll('.remove-field').forEach(delBtn => {
            delBtn.addEventListener('click', function() {
                fieldsState.splice(this.getAttribute('data-index'), 1);
                renderBuilderFields();
                updateLivePreview();
            });
        });

        document.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                if (idx > 0) {
                    const temp = fieldsState[idx];
                    fieldsState[idx] = fieldsState[idx - 1];
                    fieldsState[idx - 1] = temp;
                    renderBuilderFields();
                    updateLivePreview();
                }
            });
        });

        document.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                if (idx < fieldsState.length - 1) {
                    const temp = fieldsState[idx];
                    fieldsState[idx] = fieldsState[idx + 1];
                    fieldsState[idx + 1] = temp;
                    renderBuilderFields();
                    updateLivePreview();
                }
            });
        });

        document.querySelectorAll('.field-label-input').forEach(input => {
            input.addEventListener('input', function() {
                fieldsState[this.getAttribute('data-index')].label = this.value;
                updateLivePreview();
            });
        });

        document.querySelectorAll('.min-digits-input').forEach(input => {
            input.addEventListener('input', function() {
                fieldsState[this.getAttribute('data-index')].minDigits = parseInt(this.value, 10) || 5;
                updateLivePreview();
            });
        });

        document.querySelectorAll('.max-digits-input').forEach(input => {
            input.addEventListener('input', function() {
                fieldsState[this.getAttribute('data-index')].maxDigits = parseInt(this.value, 10) || 10;
                updateLivePreview();
            });
        });
    }

    function updateLivePreview() {
        if (fieldsState.length === 0) {
            previewFieldsContainer.innerHTML = '<em>Form preview will update as you add fields...</em>';
            return;
        }

        let html = '';
        fieldsState.forEach(field => {
            const reqMark = (field.required) ? ' <span style="color:red;">*</span>' : '';
            
            html += `<div style="padding-bottom:10px; width:100%; box-sizing:border-box;">`;
            html += `<label style="display:block; font-weight:500; margin-bottom:4px;">${field.label}${reqMark}</label>`;
            
            if (field.type === 'text' || field.type === 'firstname' || field.type === 'lastname') {
                html += `<input type="text" disabled style="width:100%; padding:8px 5px; border:1px solid #ccc; background:#f9f9f9;" />`;
            } else if (field.type === 'phone') {
                html += `<input type="tel" disabled placeholder="Phone number (${field.minDigits || 5}-${field.maxDigits || 10} digits)" style="width:100%; padding:8px 5px; border:1px solid #ccc; background:#f9f9f9;" />`;
            } else if (field.type === 'email') {
                html += `<input type="email" disabled placeholder="name@example.com" style="width:100%; padding:8px 5px; border:1px solid #ccc; background:#f9f9f9;" />`;
            } else if (field.type === 'description') {
                html += `<textarea disabled rows="3" style="width:100%; padding:8px 5px; border:1px solid #ccc; background:#f9f9f9;"></textarea>`;
            } else if (field.type === 'file') {
                html += `<input type="file" disabled style="width:100%;" />`;
            } else if (field.type === 'dropdown') {
                html += `<select disabled style="width:100%; padding:8px 5px;"><option>Choose option...</option></select>`;
            } else if (field.type === 'gender') {
                html += `<div><label><input type="radio" disabled /> Male</label> &nbsp; <label><input type="radio" disabled /> Female</label></div>`;
            } else if (field.type === 'checkbox' || field.type === 'toggle') {
                html += `<label><input type="checkbox" disabled /> ${field.label}</label>`;
            } else if (field.type === 'submit') {
                html += `<button type="button" disabled style="background:#2271b1; color:#fff; border:none; padding:10px 20px; border-radius:4px;">${field.label}</button>`;
            }
            html += `</div>`;
        });
        previewFieldsContainer.innerHTML = html;
    }

    builderForm.addEventListener('submit', function() {
        payloadInput.value = JSON.stringify(fieldsState);
    });
});
</script>