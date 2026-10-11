/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    Button,
    Notice,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_TEST_FIELDS } from './constants';
import FieldControls from './controls/FieldControls';

export default function Edit( { attributes, setAttributes } ) {
    const { selectedFormId = 'test_form', formTitle = 'Form Test', fieldOverrides } = attributes;

    let parsedOverrides = {};
    try {
        parsedOverrides = typeof fieldOverrides === 'string' ? JSON.parse( fieldOverrides || '{}' ) : ( fieldOverrides || {} );
    } catch ( e ) {
        parsedOverrides = {};
    }
    const [ overrides, setOverrides ] = useState( parsedOverrides );
    const [ activeFieldIdx, setActiveFieldIdx ] = useState( 0 );

    const { formsList, hasResolved } = useSelect( ( select ) => {
        const query = { per_page: -1, status: 'publish' };
        const selector = select( 'core' );
        const records = selector.getEntityRecords( 'postType', 'formcraftor_form', query );
        return {
            formsList: records,
            hasResolved: selector.hasFinishedResolution( 'getEntityRecords', [ 'postType', 'formcraftor_form', query ] ),
        };
    }, [] );

    const blockProps = useBlockProps( {
        className: 'formcraftor-widget-editor',
    } );

    const formOptions = [
        { label: __( 'Form Test (Default Reference Form)', 'formcraftor' ), value: 'test_form' },
    ];

    let currentSelectedForm = null;

    if ( Array.isArray( formsList ) && formsList.length > 0 ) {
        formsList.forEach( ( form ) => {
            formOptions.push( {
                label: form.title?.rendered || __( '(Untitled Form)', 'formcraftor' ),
                value: form.id.toString(),
            } );
            if ( form.id.toString() === selectedFormId?.toString() ) {
                currentSelectedForm = form;
            }
        } );
    }

    // Determine active fields: reference form or CPT form fields
    const activeFields = useMemo( () => {
        if ( selectedFormId === 'test_form' || ! currentSelectedForm ) {
            return DEFAULT_TEST_FIELDS;
        }
        let metaFields = currentSelectedForm.meta?._formcraftor_fields || currentSelectedForm._formcraftor_fields;
        if ( metaFields ) {
            try {
                const parsed = typeof metaFields === 'string' ? JSON.parse( metaFields ) : metaFields;
                if ( Array.isArray( parsed ) && parsed.length > 0 ) {
                    return parsed;
                }
            } catch ( e ) {
                // fall through
            }
        }
        return DEFAULT_TEST_FIELDS;
    }, [ selectedFormId, currentSelectedForm ] );

    const updateFieldOverride = ( fieldIndex, key, value ) => {
        const updated = { ...overrides };
        if ( ! updated[ fieldIndex ] ) {
            updated[ fieldIndex ] = {};
        }
        updated[ fieldIndex ][ key ] = value;
        setOverrides( updated );
        setAttributes( { fieldOverrides: JSON.stringify( updated ) } );
    };

    const getVal = ( idx, key, defaultVal ) => {
        if ( overrides[ idx ] && overrides[ idx ][ key ] !== undefined ) {
            return overrides[ idx ][ key ];
        }
        if ( activeFields[ idx ] && activeFields[ idx ][ key ] !== undefined ) {
            return activeFields[ idx ][ key ];
        }
        return defaultVal;
    };

    const displayFormTitle = formTitle || ( currentSelectedForm ? currentSelectedForm.title?.rendered : 'Form Test' );

    // Quick jump options for inspector
    const fieldSelectOptions = activeFields.map( ( f, idx ) => ( {
        label: `${ idx + 1 }. ${ ( f.type || 'text' ).toUpperCase() }: ${ getVal( idx, 'label', f.label ) }`,
        value: idx.toString(),
    } ) );

    return (
        <div { ...blockProps }>
            <InspectorControls>
                {/* 1. Form Level Settings */}
                <PanelBody title={ __( 'Form Settings', 'formcraftor' ) } initialOpen={ true }>
                    <SelectControl
                        label={ __( 'Choose Form', 'formcraftor' ) }
                        value={ selectedFormId }
                        options={ formOptions }
                        onChange={ ( value ) => {
                            let newTitle = 'Form Test';
                            if ( value !== 'test_form' && Array.isArray( formsList ) ) {
                                const matched = formsList.find( ( f ) => f.id.toString() === value );
                                if ( matched ) {
                                    newTitle = matched.title?.rendered || 'Untitled Form';
                                }
                            }
                            setAttributes( {
                                selectedFormId: value,
                                formTitle: newTitle,
                                fieldOverrides: '{}',
                            } );
                            setOverrides( {} );
                            setActiveFieldIdx( 0 );
                        } }
                    />
                    { ! hasResolved && <p className="description">{ __( 'Loading forms...', 'formcraftor' ) }</p> }

                    <TextControl
                        label={ __( 'Form Name / Title', 'formcraftor' ) }
                        value={ displayFormTitle }
                        onChange={ ( val ) => setAttributes( { formTitle: val } ) }
                    />

                    { Object.keys( overrides ).length > 0 && (
                        <Button
                            variant="secondary"
                            isDestructive
                            isSmall
                            onClick={ () => {
                                setOverrides( {} );
                                setAttributes( { fieldOverrides: '{}' } );
                            } }
                            style={ { marginTop: '8px' } }
                        >
                            { __( 'Reset All Customizations', 'formcraftor' ) }
                        </Button>
                    ) }
                </PanelBody>

                {/* Quick Field Selector */}
                <PanelBody title={ __( 'Active Field Navigator', 'formcraftor' ) } initialOpen={ true }>
                    <SelectControl
                        label={ __( 'Jump to Field to Configure', 'formcraftor' ) }
                        value={ activeFieldIdx.toString() }
                        options={ fieldSelectOptions }
                        onChange={ ( val ) => setActiveFieldIdx( parseInt( val, 10 ) ) }
                    />
                </PanelBody>

                {/* Individual Field Accordions */}
                { activeFields.map( ( field, idx ) => {
                    const fieldType = field.type || 'text';
                    const currentLabel = getVal( idx, 'label', field.label || fieldType );
                    const isCurrent = activeFieldIdx === idx;

                    return (
                        <PanelBody
                            key={ field.id || idx }
                            title={ `${ idx + 1 }. ${ currentLabel } (${ fieldType.toUpperCase() })` }
                            initialOpen={ isCurrent }
                            onToggle={ () => setActiveFieldIdx( idx ) }
                        >
                            <FieldControls
                                field={ field }
                                fieldIndex={ idx }
                                overrides={ overrides[ idx ] || {} }
                                updateOverride={ updateFieldOverride }
                            />
                        </PanelBody>
                    );
                } ) }
            </InspectorControls>

            {/* Live Editor Canvas Preview */}
            <div
                className="formcraftor-wrapper"
                style={ {
                    padding: '24px',
                    border: '1px solid #dcdcde',
                    background: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                } }
            >
                <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f1', paddingBottom: '12px' } }>
                    <h3 className="formcraftor-title" style={ { margin: 0, fontSize: '1.4rem', fontWeight: 600 } }>
                        { displayFormTitle }
                    </h3>
                    <span style={ { fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 } }>
                        { selectedFormId === 'test_form' ? __( 'Reference Form', 'formcraftor' ) : __( 'Saved Form', 'formcraftor' ) }
                    </span>
                </div>

                <div className="formcraftor-fields-grid" style={ { display: 'flex', flexWrap: 'wrap', gap: '0' } }>
                    { activeFields.map( ( field, idx ) => {
                        const fieldType = field.type || 'text';
                        const currentLabel = getVal( idx, 'label', field.label || fieldType );
                        const isRequired = !! getVal( idx, 'required', field.required );
                        const widthSetting = getVal( idx, 'fieldWidth', field.fieldWidth || '100%' );
                        const customWidth = getVal( idx, 'customWidth', field.customWidth || '100%' );
                        const calcWidth = widthSetting === 'custom' ? customWidth : widthSetting;
                        const labelPos = getVal( idx, 'labelPosition', field.labelPosition || 'above' );
                        const helpText = getVal( idx, 'helpText', field.helpText || '' );
                        const isFocused = activeFieldIdx === idx;

                        const outerStyle = {
                            width: calcWidth,
                            padding: '8px 10px',
                            boxSizing: 'border-box',
                            position: 'relative',
                            border: isFocused ? '1px dashed #2271b1' : '1px dashed transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'border 0.2s ease',
                        };

                        const renderLabel = () => {
                            if ( labelPos === 'hidden' ) {
                                return null;
                            }
                            return (
                                <label
                                    style={ {
                                        display: labelPos === 'inline' ? 'inline-block' : 'block',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        marginBottom: '6px',
                                        marginRight: labelPos === 'inline' ? '10px' : '0',
                                        color: '#1d2327',
                                    } }
                                >
                                    { currentLabel } { isRequired && <span style={ { color: '#d63638' } }>*</span> }
                                </label>
                            );
                        };

                        return (
                            <div
                                key={ field.id || idx }
                                style={ outerStyle }
                                onClick={ () => setActiveFieldIdx( idx ) }
                                title={ __( 'Click to configure in Inspector', 'formcraftor' ) }
                            >
                                { renderLabel() }

                                {/* Text & Name fields */}
                                { [ 'text', 'firstname', 'lastname' ].includes( fieldType ) && (
                                    <div style={ { display: 'flex', alignItems: 'center', width: '100%' } }>
                                        { !! getVal( idx, 'enablePrefixSuffix', false ) && getVal( idx, 'prefixText', '' ) && (
                                            <span style={ { padding: '8px 12px', background: '#f0f0f1', border: '1px solid #8c8f94', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px' } }>
                                                { getVal( idx, 'prefixText', '' ) }
                                            </span>
                                        ) }
                                        <input
                                            type={ getVal( idx, 'inputType', 'text' ) }
                                            disabled
                                            placeholder={ getVal( idx, 'placeholder', '' ) }
                                            defaultValue={ getVal( idx, 'defaultValue', '' ) }
                                            style={ {
                                                width: '100%',
                                                padding: '9px 12px',
                                                border: '1px solid #8c8f94',
                                                borderRadius: getVal( idx, 'enablePrefixSuffix', false ) ? '0' : '4px',
                                                background: '#fff',
                                                fontSize: '14px',
                                            } }
                                        />
                                        { !! getVal( idx, 'enablePrefixSuffix', false ) && getVal( idx, 'suffixText', '' ) && (
                                            <span style={ { padding: '8px 12px', background: '#f0f0f1', border: '1px solid #8c8f94', borderLeft: 'none', borderRadius: '0 4px 4px 0', fontSize: '13px' } }>
                                                { getVal( idx, 'suffixText', '' ) }
                                            </span>
                                        ) }
                                    </div>
                                )}

                                {/* Phone Field */}
                                { fieldType === 'phone' && (
                                    <div style={ { display: 'flex', gap: '6px' } }>
                                        <span style={ { padding: '9px 12px', background: '#f0f0f1', border: '1px solid #8c8f94', borderRadius: '4px', fontWeight: 600, fontSize: '13px' } }>
                                            { getVal( idx, 'defaultCountryCode', '+1' ) }
                                        </span>
                                        <input
                                            type="tel"
                                            disabled
                                            placeholder={ getVal( idx, 'placeholder', 'Enter phone number' ) }
                                            defaultValue={ getVal( idx, 'defaultValue', '' ) }
                                            style={ { width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' } }
                                        />
                                    </div>
                                )}

                                {/* Email Field */}
                                { fieldType === 'email' && (
                                    <>
                                        <input
                                            type="email"
                                            disabled
                                            placeholder={ getVal( idx, 'placeholder', 'user@example.com' ) }
                                            defaultValue={ getVal( idx, 'defaultValue', '' ) }
                                            style={ { width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' } }
                                        />
                                        { !! getVal( idx, 'confirmationField', false ) && (
                                            <div style={ { marginTop: '8px' } }>
                                                <label style={ { display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' } }>
                                                    { __( 'Confirm Email', 'formcraftor' ) } *
                                                </label>
                                                <input
                                                    type="email"
                                                    disabled
                                                    placeholder={ __( 'Re-enter your email', 'formcraftor' ) }
                                                    style={ { width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' } }
                                                />
                                            </div>
                                        ) }
                                    </>
                                )}

                                {/* Description Field */}
                                { fieldType === 'description' && (
                                    <div>
                                        <textarea
                                            disabled
                                            rows={ getVal( idx, 'rows', 4 ) }
                                            placeholder={ getVal( idx, 'placeholder', '' ) }
                                            defaultValue={ getVal( idx, 'defaultValue', '' ) }
                                            style={ {
                                                width: '100%',
                                                padding: '9px 12px',
                                                border: '1px solid #8c8f94',
                                                borderRadius: '4px',
                                                background: '#fff',
                                                resize: getVal( idx, 'resizeOption', 'vertical' ),
                                            } }
                                        />
                                        { !! getVal( idx, 'charCounter', true ) && (
                                            <div style={ { textAlign: 'right', fontSize: '11px', color: '#666', marginTop: '2px' } }>
                                                0 / { getVal( idx, 'maxLength', 1000 ) } { __( 'characters', 'formcraftor' ) }
                                            </div>
                                        ) }
                                    </div>
                                )}

                                {/* File Field */}
                                { fieldType === 'file' && (
                                    <div
                                        style={ {
                                            border: '2px dashed #8c8f94',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            textAlign: 'center',
                                            background: '#f9f9fb',
                                        } }
                                    >
                                        <span className="dashicons dashicons-upload" style={ { fontSize: '24px', height: '24px', width: '24px', color: '#2271b1', marginBottom: '6px' } } />
                                        <div style={ { fontSize: '13px', fontWeight: 500, marginBottom: '4px' } }>
                                            { getVal( idx, 'dragAndDrop', true ) ? __( 'Drag & drop files here or', 'formcraftor' ) : '' }
                                        </div>
                                        <button
                                            type="button"
                                            disabled
                                            style={ { padding: '6px 14px', background: '#2271b1', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' } }
                                        >
                                            { getVal( idx, 'buttonText', 'Choose File' ) }
                                        </button>
                                        <div style={ { fontSize: '11px', color: '#757575', marginTop: '6px' } }>
                                            { __( 'Allowed: ', 'formcraftor' ) }
                                            { ( getVal( idx, 'allowedFileTypes', [] ) || [] ).join( ', ' ) || 'All' } (Max { getVal( idx, 'maxFileSize', 10 ) }MB)
                                        </div>
                                    </div>
                                )}

                                {/* Dropdown Field */}
                                { fieldType === 'dropdown' && (
                                    <select
                                        disabled
                                        style={ { width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' } }
                                    >
                                        <option>{ getVal( idx, 'placeholder', 'Select an option...' ) }</option>
                                        { ( getVal( idx, 'options', field.options || [] ) || [] ).map( ( opt, i ) => (
                                            <option key={ i } value={ opt.value } selected={ opt.isDefault }>
                                                { opt.label }
                                            </option>
                                        ) ) }
                                    </select>
                                )}

                                {/* Gender / Radio Field */}
                                { fieldType === 'gender' && (
                                    <div>
                                        <div
                                            style={ {
                                                display: getVal( idx, 'layout', 'horizontal' ) === 'grid' ? 'grid' : 'flex',
                                                flexDirection: getVal( idx, 'layout', 'horizontal' ) === 'vertical' ? 'column' : 'row',
                                                gridTemplateColumns: `repeat(${ getVal( idx, 'gridColumns', 3 ) }, 1fr)`,
                                                gap: '12px',
                                            } }
                                        >
                                            { ( getVal( idx, 'options', field.options || [] ) || [] ).map( ( opt, i ) => (
                                                <label key={ i } style={ { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' } }>
                                                    <input type="radio" disabled checked={ !! opt.isDefault } /> { opt.label }
                                                </label>
                                            ) ) }
                                            { !! getVal( idx, 'allowOtherOption', false ) && (
                                                <label style={ { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' } }>
                                                    <input type="radio" disabled /> { getVal( idx, 'otherOptionText', 'Other' ) }
                                                </label>
                                            ) }
                                        </div>
                                    </div>
                                )}

                                {/* Checkbox Field */}
                                { fieldType === 'checkbox' && (
                                    <label style={ { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } }>
                                        { getVal( idx, 'labelPosition', 'after' ) === 'before' && (
                                            <span>{ currentLabel }</span>
                                        ) }
                                        <input
                                            type="checkbox"
                                            disabled
                                            checked={ !! getVal( idx, 'defaultChecked', false ) }
                                        />
                                        <span>{ getVal( idx, 'checkboxText', 'I agree to the terms and conditions' ) }</span>
                                    </label>
                                )}

                                {/* Toggle Field */}
                                { fieldType === 'toggle' && (
                                    <div style={ { display: 'flex', alignItems: 'center', gap: '10px' } }>
                                        { getVal( idx, 'displayStyle', 'switch' ) === 'switch' ? (
                                            <div
                                                style={ {
                                                    width: '42px',
                                                    height: '24px',
                                                    background: getVal( idx, 'defaultState', false ) ? '#2271b1' : '#ccc',
                                                    borderRadius: '12px',
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                } }
                                            >
                                                <span
                                                    style={ {
                                                        position: 'absolute',
                                                        top: '3px',
                                                        left: getVal( idx, 'defaultState', false ) ? '21px' : '3px',
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        transition: 'left 0.2s ease',
                                                    } }
                                                />
                                            </div>
                                        ) : (
                                            <input type="checkbox" disabled checked={ !! getVal( idx, 'defaultState', false ) } />
                                        ) }
                                        <span style={ { fontSize: '13px', fontWeight: 500 } }>
                                            { getVal( idx, 'toggleText', 'Enable Setting' ) }
                                        </span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                { fieldType === 'submit' && (
                                    <div
                                        style={ {
                                            textAlign: getVal( idx, 'alignment', 'left' ) === 'full' ? 'left' : getVal( idx, 'alignment', 'left' ),
                                            width: '100%',
                                        } }
                                    >
                                        <button
                                            type="button"
                                            disabled
                                            style={ {
                                                background: getVal( idx, 'bgColor', '#2271b1' ),
                                                color: getVal( idx, 'textColor', '#ffffff' ),
                                                borderRadius: `${ getVal( idx, 'borderRadius', 4 ) }px`,
                                                paddingTop: `${ getVal( idx, 'paddingTop', 12 ) }px`,
                                                paddingBottom: `${ getVal( idx, 'paddingBottom', 12 ) }px`,
                                                paddingLeft: `${ getVal( idx, 'paddingLeft', 24 ) }px`,
                                                paddingRight: `${ getVal( idx, 'paddingRight', 24 ) }px`,
                                                fontSize: getVal( idx, 'size', 'medium' ) === 'small' ? '12px' : ( getVal( idx, 'size', 'medium' ) === 'large' ? '16px' : '14px' ),
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                                width: getVal( idx, 'alignment', 'left' ) === 'full' ? '100%' : 'auto',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                            } }
                                        >
                                            { !! getVal( idx, 'showLoadingIndicator', false ) && (
                                                <span className="dashicons dashicons-update" style={ { fontSize: '16px', height: '16px', width: '16px' } } />
                                            ) }
                                            { getVal( idx, 'buttonText', currentLabel || 'Submit Form' ) }
                                        </button>
                                    </div>
                                )}

                                { helpText && (
                                    <p className="description" style={ { margin: '4px 0 0 0', fontSize: '12px', color: '#666' } }>
                                        { helpText }
                                    </p>
                                )}
                            </div>
                        );
                    } ) }
                </div>
            </div>
        </div>
    );
}