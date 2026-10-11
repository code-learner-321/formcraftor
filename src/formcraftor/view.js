/**
 * Frontend Form Handler for Formcraftor Forms
 */
document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('.formcraftor-form');

    forms.forEach((form) => {
        if (form.dataset.ajaxBound === 'true') {
            return;
        }
        form.dataset.ajaxBound = 'true';

        // 1. Live character counter for textareas
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            const counter = textarea.closest('.formcraftor-field-group')?.querySelector('.current-chars');
            if (counter) {
                textarea.addEventListener('input', () => {
                    counter.textContent = textarea.value.length;
                });
            }
        });

        // 2. Phone input filtering
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach((phoneInput) => {
            const allowed = phoneInput.dataset.allowedChars || 'digits_plus';
            phoneInput.addEventListener('input', function () {
                if (allowed === 'digits_only') {
                    this.value = this.value.replace(/[^0-9]/g, '');
                } else {
                    this.value = this.value.replace(/[^0-9+]/g, '');
                }
            });
        });

        // 3. Drag and drop file upload handling
        const dropzones = form.querySelectorAll('.formcraftor-file-dropzone');
        dropzones.forEach((dropzone) => {
            const fileInput = dropzone.querySelector('input[type="file"]');
            const previewList = dropzone.querySelector('.formcraftor-file-preview-list');

            if (!fileInput) {
                return;
            }

            const updatePreviews = (files) => {
                if (!previewList) {
                    return;
                }
                previewList.innerHTML = '';
                Array.from(files).forEach((file) => {
                    const item = document.createElement('div');
                    item.style.padding = '4px 8px';
                    item.style.background = '#fff';
                    item.style.border = '1px solid #dcdcde';
                    item.style.borderRadius = '4px';
                    item.style.fontSize = '12px';
                    item.style.display = 'flex';
                    item.style.justifyContent = 'space-between';
                    item.style.alignItems = 'center';
                    item.innerHTML = `<span>📄 <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>`;
                    previewList.appendChild(item);
                });
            };

            fileInput.addEventListener('change', () => {
                if (fileInput.files) {
                    updatePreviews(fileInput.files);
                }
            });

            [ 'dragenter', 'dragover' ].forEach((eventName) => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.add('is-dragover');
                });
            });

            [ 'dragleave', 'drop' ].forEach((eventName) => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.remove('is-dragover');
                });
            });

            dropzone.addEventListener('drop', (e) => {
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    updatePreviews(fileInput.files);
                }
            });
        });

        // 4. Form Submit handler
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            let responseNotice = form.querySelector('.formcraftor-ajax-notice');
            if (!responseNotice) {
                responseNotice = document.createElement('div');
                responseNotice.className = 'formcraftor-ajax-notice';
                responseNotice.style.marginTop = '15px';
                responseNotice.style.padding = '12px 16px';
                responseNotice.style.borderRadius = '4px';
                responseNotice.style.transition = 'opacity 0.4s ease';
                form.appendChild(responseNotice);
            }

            const showError = (msg) => {
                responseNotice.style.display = 'block';
                responseNotice.style.background = '#fcf0f0';
                responseNotice.style.color = '#8a1f1d';
                responseNotice.style.border = '1px solid #f5c6cb';
                responseNotice.textContent = msg;
            };

            // Client-side confirmation email check
            const emailFields = form.querySelectorAll('input[type="email"]');
            let emailMismatch = false;
            emailFields.forEach((em) => {
                if (em.id && !em.id.endsWith('_confirm')) {
                    const confirmField = form.querySelector(`#${em.id}_confirm`);
                    if (confirmField && em.value !== confirmField.value) {
                        emailMismatch = true;
                    }
                }
            });
            if (emailMismatch) {
                showError('Email addresses do not match. Please verify your confirmation email.');
                return;
            }

            const submitBtn = form.querySelector('.formcraftor-submit-btn');
            const btnTextSpan = submitBtn ? submitBtn.querySelector('.formcraftor-btn-text') : null;
            const originalBtnText = btnTextSpan ? btnTextSpan.textContent : (submitBtn ? submitBtn.textContent : '');

            const loadingText = submitBtn?.dataset.loadingText || 'Submitting...';
            const showLoading = submitBtn?.dataset.showLoading === '1';
            const disableSubmitting = submitBtn?.dataset.disableSubmitting !== '0';
            const customSuccessMsg = submitBtn?.dataset.successMessage || 'Form submitted successfully!';
            const redirectEnabled = submitBtn?.dataset.redirect === '1';
            const redirectUrl = submitBtn?.dataset.redirectUrl || '';
            const resetFormEnabled = submitBtn?.dataset.resetForm !== '0';

            if (submitBtn) {
                if (disableSubmitting) {
                    submitBtn.disabled = true;
                }
                if (btnTextSpan) {
                    btnTextSpan.textContent = loadingText;
                }
                if (showLoading && !submitBtn.querySelector('.formcraftor-spinner')) {
                    const spinner = document.createElement('span');
                    spinner.className = 'formcraftor-spinner';
                    submitBtn.prepend(spinner);
                }
            }

            const formData = new FormData(form);
            formData.append('action', 'formcraftor_submit');

            const ajaxUrl = window.formcraftor_ajax_obj ? window.formcraftor_ajax_obj.ajax_url : '/wp-admin/admin-ajax.php';

            fetch(ajaxUrl, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        responseNotice.style.display = 'block';
                        responseNotice.style.background = '#e7f4e8';
                        responseNotice.style.color = '#1e4620';
                        responseNotice.style.border = '1px solid #b7e1cd';

                        let messageHtml = `<div><strong>${customSuccessMsg}</strong></div>`;

                        // Append uploaded file URLs if present
                        if (data.data && data.data.files && data.data.files.length > 0) {
                            messageHtml += '<ul style="margin-top: 8px; padding-left: 20px; font-size: 13px;">';
                            data.data.files.forEach((file) => {
                                messageHtml += `<li>Uploaded File: <a href="${file.url}" target="_blank" style="color: #2271b1; text-decoration: underline;">${file.name}</a></li>`;
                            });
                            messageHtml += '</ul>';
                        }

                        responseNotice.innerHTML = messageHtml;

                        if (resetFormEnabled) {
                            form.reset();
                            const previews = form.querySelectorAll('.formcraftor-file-preview-list');
                            previews.forEach((p) => {
                                p.innerHTML = '';
                            });
                        }

                        // Handle redirect if configured
                        if (redirectEnabled && redirectUrl) {
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1200);
                        } else {
                            // Auto-remove notice after 6 seconds
                            setTimeout(() => {
                                responseNotice.style.opacity = '0';
                                setTimeout(() => {
                                    responseNotice.style.display = 'none';
                                    responseNotice.style.opacity = '1';
                                }, 500);
                            }, 6000);
                        }
                    } else {
                        showError(data.data?.message || 'Submission failed. Please check your inputs and try again.');
                    }
                })
                .catch(() => {
                    showError('An unexpected network error occurred. Please try again.');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        if (btnTextSpan) {
                            btnTextSpan.textContent = originalBtnText;
                        }
                        const spinner = submitBtn.querySelector('.formcraftor-spinner');
                        if (spinner) {
                            spinner.remove();
                        }
                    }
                });
        });
    });
});