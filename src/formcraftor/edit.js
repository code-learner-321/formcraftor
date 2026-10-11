/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
    const { selectedFormId, fieldOverrides } = attributes;

    let parsedOverrides = {};
    try {
        parsedOverrides = typeof fieldOverrides === 'string' ? JSON.parse( fieldOverrides || '{}' ) : ( fieldOverrides || {} );
    } catch ( e ) {
        parsedOverrides = {};
    }
    const [ overrides, setOverrides ] = useState( parsedOverrides );

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

    const options = [
        { label: __( 'Select a Form...', 'formcraftor' ), value: '' },
    ];

    let currentSelectedForm = null;

    if ( Array.isArray( formsList ) && formsList.length > 0 ) {
        formsList.forEach( ( form ) => {
            options.push( {
                label: form.title?.rendered || __( '(Untitled Form)', 'formcraftor' ),
                value: form.id.toString(),
            } );
            if ( form.id.toString() === selectedFormId?.toString() ) {
                currentSelectedForm = form;
            }
        } );
    }

    let savedFields = [];
    if ( currentSelectedForm ) {
        let metaFields = currentSelectedForm.meta?._formcraftor_fields || currentSelectedForm._formcraftor_fields;
        if ( metaFields ) {
            try {
                savedFields = typeof metaFields === 'string' ? JSON.parse( metaFields ) : metaFields;
            } catch ( e ) {
                savedFields = [];
            }
        }
    }

    const updateFieldOverride = ( fieldIndex, key, value ) => {
        const updated = { ...overrides };
        if ( ! updated[ fieldIndex ] ) {
            updated[ fieldIndex ] = {};
        }
        updated[ fieldIndex ][ key ] = value;
        setOverrides( updated );
        setAttributes( { fieldOverrides: JSON.stringify( updated ) } );
    };

    return (
        <div { ...blockProps }>
            <InspectorControls>
                <PanelBody title={ __( 'Form Selection', 'formcraftor' ) } initialOpen={ true }>
                    <SelectControl
                        label={ __( 'Choose Form', 'formcraftor' ) }
                        value={ selectedFormId }
                        options={ options }
                        onChange={ ( value ) => {
                            setAttributes( { selectedFormId: value, fieldOverrides: '{}' } );
                            setOverrides( {} );
                        } }
                    />
                    { ! hasResolved && <p className="description">{ __( 'Loading forms...', 'formcraftor' ) }</p> }
                </PanelBody>

                { selectedFormId && (
                    <PanelBody title={ __( 'Widget Field & Validation Settings', 'formcraftor' ) } initialOpen={ true }>
                        <p className="description">
                            { __( 'Customize labels, padding, and validation for this widget instance:', 'formcraftor' ) }
                        </p>
                        { Array.isArray( savedFields ) && savedFields.length > 0 ? (
                            savedFields.map( ( field, idx ) => {
                                const currentLabel = overrides[ idx ]?.label !== undefined ? overrides[ idx ].label : ( field.label || field.type );
                                const minDig = overrides[ idx ]?.minDigits !== undefined ? overrides[ idx ].minDigits : ( field.minDigits || 5 );
                                const maxDig = overrides[ idx ]?.maxDigits !== undefined ? overrides[ idx ].maxDigits : ( field.maxDigits || 10 );
                                const padTop = overrides[ idx ]?.paddingTop !== undefined ? overrides[ idx ].paddingTop : ( field.paddingTop || '0px' );
                                const padBot = overrides[ idx ]?.paddingBottom !== undefined ? overrides[ idx ].paddingBottom : ( field.paddingBottom || '10px' );
                                const padLeft = overrides[ idx ]?.paddingLeft !== undefined ? overrides[ idx ].paddingLeft : ( field.paddingLeft || '0px' );
                                const padRight = overrides[ idx ]?.paddingRight !== undefined ? overrides[ idx ].paddingRight : ( field.paddingRight || '0px' );

                                return (
                                    <div key={ field.id || idx } style={ { marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #ddd' } }>
                                        <strong>{ ( field.type || 'TEXT' ).toUpperCase() } Field</strong>
                                        <TextControl
                                            label={ __( 'Label Name', 'formcraftor' ) }
                                            value={ currentLabel }
                                            onChange={ ( val ) => updateFieldOverride( idx, 'label', val ) }
                                        />
                                        { field.type === 'phone' && (
                                            <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '8px' } }>
                                                <TextControl
                                                    label={ __( 'Min Digits', 'formcraftor' ) }
                                                    type="number"
                                                    value={ minDig }
                                                    onChange={ ( val ) => updateFieldOverride( idx, 'minDigits', val ) }
                                                />
                                                <TextControl
                                                    label={ __( 'Max Digits', 'formcraftor' ) }
                                                    type="number"
                                                    value={ maxDig }
                                                    onChange={ ( val ) => updateFieldOverride( idx, 'maxDigits', val ) }
                                                />
                                            </div>
                                        ) }
                                        <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' } }>
                                            <TextControl
                                                label={ __( 'Padding Top', 'formcraftor' ) }
                                                value={ padTop }
                                                onChange={ ( val ) => updateFieldOverride( idx, 'paddingTop', val ) }
                                            />
                                            <TextControl
                                                label={ __( 'Padding Bottom', 'formcraftor' ) }
                                                value={ padBot }
                                                onChange={ ( val ) => updateFieldOverride( idx, 'paddingBottom', val ) }
                                            />
                                            <TextControl
                                                label={ __( 'Padding Left', 'formcraftor' ) }
                                                value={ padLeft }
                                                onChange={ ( val ) => updateFieldOverride( idx, 'paddingLeft', val ) }
                                            />
                                            <TextControl
                                                label={ __( 'Padding Right', 'formcraftor' ) }
                                                value={ padRight }
                                                onChange={ ( val ) => updateFieldOverride( idx, 'paddingRight', val ) }
                                            />
                                        </div>
                                    </div>
                                );
                            } )
                        ) : (
                            <p className="description" style={ { color: '#d63638' } }>
                                { __( 'No fields configured in this form.', 'formcraftor' ) }
                            </p>
                        ) }
                    </PanelBody>
                ) }
            </InspectorControls>

            {/* Live Editor Canvas Preview */}
            <div className="formcraftor-wrapper" style={ { padding: '24px', border: '1px solid #dcdcde', background: '#fff', borderRadius: '8px' } }>
                <h3 className="formcraftor-title" style={ { marginTop: 0 } }>
                    { currentSelectedForm ? currentSelectedForm.title?.rendered : __( 'Formcraftor Widget', 'formcraftor' ) }
                </h3>

                { selectedFormId ? (
                    Array.isArray( savedFields ) && savedFields.length > 0 ? (
                        savedFields.map( ( field, idx ) => {
                            const currentLabel = overrides[ idx ]?.label !== undefined ? overrides[ idx ].label : ( field.label || field.type );
                            const minDig = overrides[ idx ]?.minDigits !== undefined ? overrides[ idx ].minDigits : ( field.minDigits || 5 );
                            const maxDig = overrides[ idx ]?.maxDigits !== undefined ? overrides[ idx ].maxDigits : ( field.maxDigits || 10 );
                            const padTop = overrides[ idx ]?.paddingTop !== undefined ? overrides[ idx ].paddingTop : ( field.paddingTop || '0px' );
                            const padBot = overrides[ idx ]?.paddingBottom !== undefined ? overrides[ idx ].paddingBottom : ( field.paddingBottom || '10px' );
                            const padLeft = overrides[ idx ]?.paddingLeft !== undefined ? overrides[ idx ].paddingLeft : ( field.paddingLeft || '0px' );
                            const padRight = overrides[ idx ]?.paddingRight !== undefined ? overrides[ idx ].paddingRight : ( field.paddingRight || '0px' );

                            const fieldStyle = {
                                paddingTop: padTop,
                                paddingBottom: padBot,
                                paddingLeft: padLeft,
                                paddingRight: padRight,
                                boxSizing: 'border-box',
                                width: '100%',
                            };

                            return (
                                <div key={ field.id || idx } className="formcraftor-field-group">
                                    <div style={ fieldStyle }>
                                        <label style={ { display: 'block', fontWeight: 500, marginBottom: '6px' } }>
                                            { currentLabel } { field.required && <span style={ { color: '#d63638' } }>*</span> }
                                        </label>
                                        { field.type === 'text' || field.type === 'firstname' || field.type === 'lastname' ? (
                                            <input type="text" disabled style={ { width: '100%', padding: '10px 5px', border: '1px solid #dcdcde', background: '#fff' } } />
                                        ) : field.type === 'phone' ? (
                                            <input type="tel" disabled placeholder={ `Phone number (${minDig}-${maxDig} digits)` } style={ { width: '100%', padding: '10px 5px', border: '1px solid #dcdcde', background: '#fff' } } />
                                        ) : field.type === 'email' ? (
                                            <input type="email" disabled placeholder="name@example.com" style={ { width: '100%', padding: '10px 5px', border: '1px solid #dcdcde', background: '#fff' } } />
                                        ) : field.type === 'description' ? (
                                            <textarea disabled rows="3" style={ { width: '100%', padding: '10px 5px', border: '1px solid #dcdcde', background: '#fff' } }></textarea>
                                        ) : field.type === 'file' ? (
                                            <input type="file" disabled style={ { width: '100%' } } />
                                        ) : field.type === 'dropdown' ? (
                                            <select disabled style={ { width: '100%', padding: '10px 5px' } }><option>{ __( 'Choose option...', 'formcraftor' ) }</option></select>
                                        ) : field.type === 'gender' ? (
                                            <div><label><input type="radio" disabled /> Male</label> &nbsp; <label><input type="radio" disabled /> Female</label></div>
                                        ) : field.type === 'checkbox' || field.type === 'toggle' ? (
                                            <label><input type="checkbox" disabled /> { currentLabel }</label>
                                        ) : field.type === 'submit' ? (
                                            <button type="button" disabled className="formcraftor-submit-btn" style={ { background: '#2271b1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px' } }>{ currentLabel }</button>
                                        ) : null }
                                    </div>
                                </div>
                            );
                        } )
                    ) : (
                        <p style={ { color: '#d63638' } }>{ __( 'Selected form has no fields configured.', 'formcraftor' ) }</p>
                    )
                ) : (
                    <p style={ { color: '#d63638' } }>{ __( 'Please select a form from the block settings sidebar.', 'formcraftor' ) }</p>
                ) }
            </div>
        </div>
    );
}