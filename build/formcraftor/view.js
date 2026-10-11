/******/ (() => { // webpackBootstrap
/*!*********************************!*\
  !*** ./src/formcraftor/view.js ***!
  \*********************************/
/**
 * Frontend Form Handler for Formcraftor Forms
 */
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.formcraftor-form');
  forms.forEach(form => {
    if (form.dataset.ajaxBound === 'true') {
      return;
    }
    form.dataset.ajaxBound = 'true';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const submitBtn = form.querySelector('.formcraftor-submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }
      const formData = new FormData(form);
      formData.append('action', 'formcraftor_submit');
      let responseNotice = form.querySelector('.formcraftor-ajax-notice');
      if (!responseNotice) {
        responseNotice = document.createElement('div');
        responseNotice.className = 'formcraftor-ajax-notice';
        responseNotice.style.marginTop = '15px';
        responseNotice.style.padding = '10px 14px';
        responseNotice.style.borderRadius = '4px';
        responseNotice.style.transition = 'opacity 0.5s ease';
        form.appendChild(responseNotice);
      }
      responseNotice.style.display = 'block';
      responseNotice.style.opacity = '1';
      const ajaxUrl = window.formcraftor_ajax_obj ? window.formcraftor_ajax_obj.ajax_url : '/wp-admin/admin-ajax.php';
      fetch(ajaxUrl, {
        method: 'POST',
        body: formData
      }).then(response => response.json()).then(data => {
        if (data.success) {
          responseNotice.style.background = '#e7f4e8';
          responseNotice.style.color = '#1e4620';
          responseNotice.style.border = '1px solid #b7e1cd';
          let messageHtml = `<div><strong>${data.data.message || 'Form submitted successfully!'}</strong></div>`;

          // Append uploaded file URLs if present
          if (data.data.files && data.data.files.length > 0) {
            messageHtml += '<ul style="margin-top: 5px; padding-left: 20px;">';
            data.data.files.forEach(file => {
              messageHtml += `<li>Uploaded File: <a href="${file.url}" target="_blank" style="color: #2271b1; text-decoration: underline;">${file.name}</a></li>`;
            });
            messageHtml += '</ul>';
          }
          responseNotice.innerHTML = messageHtml;
          form.reset();

          // Auto-remove notice after 5 seconds
          setTimeout(() => {
            responseNotice.style.opacity = '0';
            setTimeout(() => {
              responseNotice.style.display = 'none';
            }, 500);
          }, 5000);
        } else {
          responseNotice.style.background = '#fcf0f0';
          responseNotice.style.color = '#8a1f1d';
          responseNotice.style.border = '1px solid #f5c6cb';
          responseNotice.textContent = data.data.message || 'Submission failed. Please try again.';
        }
      }).catch(error => {
        responseNotice.style.background = '#fcf0f0';
        responseNotice.style.color = '#8a1f1d';
        responseNotice.style.border = '1px solid #f5c6cb';
        responseNotice.textContent = 'An unexpected error occurred.';
      }).finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    });
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map