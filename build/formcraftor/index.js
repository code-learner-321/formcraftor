/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/formcraftor/edit.js"
/*!*********************************!*\
  !*** ./src/formcraftor/edit.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */






function Edit({
  attributes,
  setAttributes
}) {
  const {
    selectedFormId,
    fieldOverrides
  } = attributes;
  let parsedOverrides = {};
  try {
    parsedOverrides = typeof fieldOverrides === 'string' ? JSON.parse(fieldOverrides || '{}') : fieldOverrides || {};
  } catch (e) {
    parsedOverrides = {};
  }
  const [overrides, setOverrides] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(parsedOverrides);
  const {
    formsList,
    hasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const query = {
      per_page: -1,
      status: 'publish'
    };
    const selector = select('core');
    const records = selector.getEntityRecords('postType', 'formcraftor_form', query);
    return {
      formsList: records,
      hasResolved: selector.hasFinishedResolution('getEntityRecords', ['postType', 'formcraftor_form', query])
    };
  }, []);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'formcraftor-widget-editor'
  });
  const options = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a Form...', 'formcraftor'),
    value: ''
  }];
  let currentSelectedForm = null;
  if (Array.isArray(formsList) && formsList.length > 0) {
    formsList.forEach(form => {
      options.push({
        label: form.title?.rendered || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('(Untitled Form)', 'formcraftor'),
        value: form.id.toString()
      });
      if (form.id.toString() === selectedFormId?.toString()) {
        currentSelectedForm = form;
      }
    });
  }
  let savedFields = [];
  if (currentSelectedForm) {
    let metaFields = currentSelectedForm.meta?._formcraftor_fields || currentSelectedForm._formcraftor_fields;
    if (metaFields) {
      try {
        savedFields = typeof metaFields === 'string' ? JSON.parse(metaFields) : metaFields;
      } catch (e) {
        savedFields = [];
      }
    }
  }
  const updateFieldOverride = (fieldIndex, key, value) => {
    const updated = {
      ...overrides
    };
    if (!updated[fieldIndex]) {
      updated[fieldIndex] = {};
    }
    updated[fieldIndex][key] = value;
    setOverrides(updated);
    setAttributes({
      fieldOverrides: JSON.stringify(updated)
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Form Selection', 'formcraftor'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose Form', 'formcraftor'),
          value: selectedFormId,
          options: options,
          onChange: value => {
            setAttributes({
              selectedFormId: value,
              fieldOverrides: '{}'
            });
            setOverrides({});
          }
        }), !hasResolved && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading forms...', 'formcraftor')
        })]
      }), selectedFormId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Widget Field & Validation Settings', 'formcraftor'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Customize labels, padding, and validation for this widget instance:', 'formcraftor')
        }), Array.isArray(savedFields) && savedFields.length > 0 ? savedFields.map((field, idx) => {
          const currentLabel = overrides[idx]?.label !== undefined ? overrides[idx].label : field.label || field.type;
          const minDig = overrides[idx]?.minDigits !== undefined ? overrides[idx].minDigits : field.minDigits || 5;
          const maxDig = overrides[idx]?.maxDigits !== undefined ? overrides[idx].maxDigits : field.maxDigits || 10;
          const padTop = overrides[idx]?.paddingTop !== undefined ? overrides[idx].paddingTop : field.paddingTop || '0px';
          const padBot = overrides[idx]?.paddingBottom !== undefined ? overrides[idx].paddingBottom : field.paddingBottom || '10px';
          const padLeft = overrides[idx]?.paddingLeft !== undefined ? overrides[idx].paddingLeft : field.paddingLeft || '0px';
          const padRight = overrides[idx]?.paddingRight !== undefined ? overrides[idx].paddingRight : field.paddingRight || '0px';
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("strong", {
              children: [(field.type || 'TEXT').toUpperCase(), " Field"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label Name', 'formcraftor'),
              value: currentLabel,
              onChange: val => updateFieldOverride(idx, 'label', val)
            }), field.type === 'phone' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5px',
                marginBottom: '8px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Min Digits', 'formcraftor'),
                type: "number",
                value: minDig,
                onChange: val => updateFieldOverride(idx, 'minDigits', val)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max Digits', 'formcraftor'),
                type: "number",
                value: maxDig,
                onChange: val => updateFieldOverride(idx, 'maxDigits', val)
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Top', 'formcraftor'),
                value: padTop,
                onChange: val => updateFieldOverride(idx, 'paddingTop', val)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Bottom', 'formcraftor'),
                value: padBot,
                onChange: val => updateFieldOverride(idx, 'paddingBottom', val)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Left', 'formcraftor'),
                value: padLeft,
                onChange: val => updateFieldOverride(idx, 'paddingLeft', val)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Right', 'formcraftor'),
                value: padRight,
                onChange: val => updateFieldOverride(idx, 'paddingRight', val)
              })]
            })]
          }, field.id || idx);
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "description",
          style: {
            color: '#d63638'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No fields configured in this form.', 'formcraftor')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "formcraftor-wrapper",
      style: {
        padding: '24px',
        border: '1px solid #dcdcde',
        background: '#fff',
        borderRadius: '8px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
        className: "formcraftor-title",
        style: {
          marginTop: 0
        },
        children: currentSelectedForm ? currentSelectedForm.title?.rendered : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Formcraftor Widget', 'formcraftor')
      }), selectedFormId ? Array.isArray(savedFields) && savedFields.length > 0 ? savedFields.map((field, idx) => {
        const currentLabel = overrides[idx]?.label !== undefined ? overrides[idx].label : field.label || field.type;
        const minDig = overrides[idx]?.minDigits !== undefined ? overrides[idx].minDigits : field.minDigits || 5;
        const maxDig = overrides[idx]?.maxDigits !== undefined ? overrides[idx].maxDigits : field.maxDigits || 10;
        const padTop = overrides[idx]?.paddingTop !== undefined ? overrides[idx].paddingTop : field.paddingTop || '0px';
        const padBot = overrides[idx]?.paddingBottom !== undefined ? overrides[idx].paddingBottom : field.paddingBottom || '10px';
        const padLeft = overrides[idx]?.paddingLeft !== undefined ? overrides[idx].paddingLeft : field.paddingLeft || '0px';
        const padRight = overrides[idx]?.paddingRight !== undefined ? overrides[idx].paddingRight : field.paddingRight || '0px';
        const fieldStyle = {
          paddingTop: padTop,
          paddingBottom: padBot,
          paddingLeft: padLeft,
          paddingRight: padRight,
          boxSizing: 'border-box',
          width: '100%'
        };
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "formcraftor-field-group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: fieldStyle,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
              style: {
                display: 'block',
                fontWeight: 500,
                marginBottom: '6px'
              },
              children: [currentLabel, " ", field.required && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                style: {
                  color: '#d63638'
                },
                children: "*"
              })]
            }), field.type === 'text' || field.type === 'firstname' || field.type === 'lastname' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "text",
              disabled: true,
              style: {
                width: '100%',
                padding: '10px 5px',
                border: '1px solid #dcdcde',
                background: '#fff'
              }
            }) : field.type === 'phone' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "tel",
              disabled: true,
              placeholder: `Phone number (${minDig}-${maxDig} digits)`,
              style: {
                width: '100%',
                padding: '10px 5px',
                border: '1px solid #dcdcde',
                background: '#fff'
              }
            }) : field.type === 'email' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "email",
              disabled: true,
              placeholder: "name@example.com",
              style: {
                width: '100%',
                padding: '10px 5px',
                border: '1px solid #dcdcde',
                background: '#fff'
              }
            }) : field.type === 'description' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("textarea", {
              disabled: true,
              rows: "3",
              style: {
                width: '100%',
                padding: '10px 5px',
                border: '1px solid #dcdcde',
                background: '#fff'
              }
            }) : field.type === 'file' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              type: "file",
              disabled: true,
              style: {
                width: '100%'
              }
            }) : field.type === 'dropdown' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("select", {
              disabled: true,
              style: {
                width: '100%',
                padding: '10px 5px'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose option...', 'formcraftor')
              })
            }) : field.type === 'gender' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                  type: "radio",
                  disabled: true
                }), " Male"]
              }), " \xA0 ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                  type: "radio",
                  disabled: true
                }), " Female"]
              })]
            }) : field.type === 'checkbox' || field.type === 'toggle' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                type: "checkbox",
                disabled: true
              }), " ", currentLabel]
            }) : field.type === 'submit' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              type: "button",
              disabled: true,
              className: "formcraftor-submit-btn",
              style: {
                background: '#2271b1',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px'
              },
              children: currentLabel
            }) : null]
          })
        }, field.id || idx);
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        style: {
          color: '#d63638'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Selected form has no fields configured.', 'formcraftor')
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        style: {
          color: '#d63638'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please select a form from the block settings sidebar.', 'formcraftor')
      })]
    })]
  });
}

/***/ },

/***/ "./src/formcraftor/index.js"
/*!**********************************!*\
  !*** ./src/formcraftor/index.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/formcraftor/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/formcraftor/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/formcraftor/style.scss");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => {
    // Dynamic block handled server-side via render.php
    return null;
  }
});

/***/ },

/***/ "./src/formcraftor/style.scss"
/*!************************************!*\
  !*** ./src/formcraftor/style.scss ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./src/formcraftor/block.json"
/*!************************************!*\
  !*** ./src/formcraftor/block.json ***!
  \************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"formcraftor/formcraftor","title":"Formcraftor Form Widget","category":"widgets","icon":"feedback","description":"Select and display a custom form created in Formcraftor with widget-specific customizations.","supports":{"html":false,"align":["wide","full"]},"attributes":{"selectedFormId":{"type":"string","default":""},"fieldOverrides":{"type":"string","default":"{}"}},"textdomain":"formcraftor","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","viewScript":"file:./view.js"}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		const deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn) => {
/******/ 			if(chunkIds) {
/******/ 				deferred.push([chunkIds, fn]);
/******/ 				return;
/******/ 			}
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				let [chunkIds, fn] = deferred[i];
/******/ 				let fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if (__webpack_require__.O.j(chunkIds[j])) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					const r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"formcraftor/index": 0,
/******/ 			"formcraftor/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = globalThis["webpackChunkformcraftor"] ||= [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["formcraftor/style-index"], () => (__webpack_require__("./src/formcraftor/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map