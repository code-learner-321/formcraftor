/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    TextareaControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    Button,
    ColorPalette,
    TabPanel,
    __experimentalNumberControl as ExpNumberControl,
    NumberControl as StdNumberControl,
} from '@wordpress/components';
import {
    COUNTRY_CODES,
    ALLOWED_FILE_TYPES,
    WIDTH_OPTIONS,
    COLOR_PALETTE_DEFAULTS,
} from '../constants';

// Safe NumberControl fallback
const NumberInput = ( props ) => {
    const Component = StdNumberControl || ExpNumberControl;
    if ( Component ) {
        return <Component { ...props } />;
    }
    return (
        <TextControl
            type="number"
            { ...props }
            onChange={ ( val ) => props.onChange( val === '' ? '' : Number( val ) ) }
        />
    );
};

// Repeatable Options Manager Component (for Dropdown & Gender/Radio)
function OptionsManager( { options = [], onChange, allowDefaultToggle = true } ) {
    const opts = Array.isArray( options ) && options.length > 0 ? options : [
        { label: 'Option 1', value: 'opt_1', isDefault: false },
    ];

    const handleUpdate = ( idx, key, val ) => {
        const next = [ ...opts ];
        next[ idx ] = { ...next[ idx ], [ key ]: val };
        onChange( next );
    };

    const handleSetDefault = ( idx ) => {
        const next = opts.map( ( o, i ) => ( {
            ...o,
            isDefault: i === idx ? ! o.isDefault : false,
        } ) );
        onChange( next );
    };

    const handleAdd = () => {
        const id = opts.length + 1;
        onChange( [
            ...opts,
            { label: `Option ${ id }`, value: `option_${ id }`, isDefault: false },
        ] );
    };

    const handleDelete = ( idx ) => {
        if ( opts.length <= 1 ) {
            return;
        }
        const next = opts.filter( ( _, i ) => i !== idx );
        onChange( next );
    };

    const handleMove = ( idx, direction ) => {
        const targetIdx = idx + direction;
        if ( targetIdx < 0 || targetIdx >= opts.length ) {
            return;
        }
        const next = [ ...opts ];
        const temp = next[ idx ];
        next[ idx ] = next[ targetIdx ];
        next[ targetIdx ] = temp;
        onChange( next );
    };

    return (
        <div className="formcraftor-options-manager" style={ { marginTop: '10px', marginBottom: '15px' } }>
            <label style={ { display: 'block', fontWeight: 600, marginBottom: '8px' } }>
                { __( 'Options Manager', 'formcraftor' ) }
            </label>
            <div style={ { display: 'flex', flexDirection: 'column', gap: '8px' } }>
                { opts.map( ( opt, idx ) => (
                    <div
                        key={ idx }
                        style={ {
                            background: '#f6f7f7',
                            border: '1px solid #dcdcde',
                            borderRadius: '4px',
                            padding: '10px',
                        } }
                    >
                        <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } }>
                            <strong style={ { fontSize: '12px' } }>#{ idx + 1 }</strong>
                            <div style={ { display: 'flex', gap: '4px' } }>
                                <Button
                                    icon="arrow-up-alt2"
                                    isSmall
                                    disabled={ idx === 0 }
                                    onClick={ () => handleMove( idx, -1 ) }
                                    label={ __( 'Move Up', 'formcraftor' ) }
                                />
                                <Button
                                    icon="arrow-down-alt2"
                                    isSmall
                                    disabled={ idx === opts.length - 1 }
                                    onClick={ () => handleMove( idx, 1 ) }
                                    label={ __( 'Move Down', 'formcraftor' ) }
                                />
                                <Button
                                    icon="trash"
                                    isDestructive
                                    isSmall
                                    disabled={ opts.length <= 1 }
                                    onClick={ () => handleDelete( idx ) }
                                    label={ __( 'Delete Option', 'formcraftor' ) }
                                />
                            </div>
                        </div>
                        <TextControl
                            label={ __( 'Option Label', 'formcraftor' ) }
                            value={ opt.label || '' }
                            onChange={ ( val ) => handleUpdate( idx, 'label', val ) }
                        />
                        <TextControl
                            label={ __( 'Option Value', 'formcraftor' ) }
                            value={ opt.value || '' }
                            onChange={ ( val ) => handleUpdate( idx, 'value', val ) }
                        />
                        { allowDefaultToggle && (
                            <ToggleControl
                                label={ __( 'Default Option', 'formcraftor' ) }
                                checked={ !! opt.isDefault }
                                onChange={ () => handleSetDefault( idx ) }
                            />
                        ) }
                    </div>
                ) ) }
            </div>
            <Button
                variant="secondary"
                icon="plus-alt2"
                onClick={ handleAdd }
                style={ { marginTop: '8px', width: '100%', justifyContent: 'center' } }
            >
                { __( 'Add Option', 'formcraftor' ) }
            </Button>
        </div>
    );
}

// Multi-Select Pill Control for Allowed File Types
function AllowedFileTypesControl( { value = [], onChange } ) {
    const selected = Array.isArray( value ) ? value : ALLOWED_FILE_TYPES;

    const toggleType = ( type ) => {
        let updated;
        if ( selected.includes( type ) ) {
            updated = selected.filter( ( t ) => t !== type );
        } else {
            updated = [ ...selected, type ];
        }
        onChange( updated );
    };

    return (
        <div style={ { marginBottom: '14px' } }>
            <label style={ { display: 'block', fontWeight: 500, marginBottom: '6px' } }>
                { __( 'Allowed File Types (Multi-Select)', 'formcraftor' ) }
            </label>
            <div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px' } }>
                { ALLOWED_FILE_TYPES.map( ( type ) => {
                    const isSelected = selected.includes( type );
                    return (
                        <button
                            type="button"
                            key={ type }
                            onClick={ () => toggleType( type ) }
                            style={ {
                                padding: '4px 10px',
                                borderRadius: '12px',
                                border: isSelected ? '1px solid #2271b1' : '1px solid #ccc',
                                background: isSelected ? '#2271b1' : '#fff',
                                color: isSelected ? '#fff' : '#333',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 600,
                            } }
                        >
                            { type } { isSelected ? '✓' : '+' }
                        </button>
                    );
                } ) }
            </div>
        </div>
    );
}

// Width Control Helper
function FieldWidthControl( { value, customWidth, onChange, onCustomChange } ) {
    return (
        <>
            <SelectControl
                label={ __( 'Field Width', 'formcraftor' ) }
                value={ value || '100%' }
                options={ WIDTH_OPTIONS }
                onChange={ onChange }
            />
            { value === 'custom' && (
                <TextControl
                    label={ __( 'Custom Width (e.g. 75% or 400px)', 'formcraftor' ) }
                    value={ customWidth || '100%' }
                    onChange={ onCustomChange }
                />
            ) }
        </>
    );
}

/**
 * Main Field Controls Component
 */
export default function FieldControls( { field, fieldIndex, overrides, updateOverride } ) {
    const fType = field.type || 'text';

    const getVal = ( key, defaultVal ) => {
        if ( overrides[ key ] !== undefined ) {
            return overrides[ key ];
        }
        if ( field[ key ] !== undefined ) {
            return field[ key ];
        }
        return defaultVal;
    };

    const update = ( key, val ) => {
        updateOverride( fieldIndex, key, val );
    };

    // Shared field width handler
    const widthControl = (
        <FieldWidthControl
            value={ getVal( 'fieldWidth', field.fieldWidth || '100%' ) }
            customWidth={ getVal( 'customWidth', field.customWidth || '100%' ) }
            onChange={ ( val ) => update( 'fieldWidth', val ) }
            onCustomChange={ ( val ) => update( 'customWidth', val ) }
        />
    );

    // ==========================================
    // 2. TEXT FIELD (General / Validation / Appearance tabs)
    // ==========================================
    if ( fType === 'text' ) {
        return (
            <TabPanel
                className="formcraftor-field-tabs"
                activeClass="is-active"
                tabs={ [
                    { name: 'general', title: __( 'General', 'formcraftor' ) },
                    { name: 'validation', title: __( 'Validation', 'formcraftor' ) },
                    { name: 'appearance', title: __( 'Appearance', 'formcraftor' ) },
                ] }
            >
                { ( tab ) => {
                    if ( tab.name === 'general' ) {
                        return (
                            <div style={ { paddingTop: '10px' } }>
                                <TextControl
                                    label={ __( 'Field Label', 'formcraftor' ) }
                                    value={ getVal( 'label', field.label || 'Text Label' ) }
                                    onChange={ ( val ) => update( 'label', val ) }
                                />
                                <TextControl
                                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                                    help={ __( 'Auto-generated or custom field identifier.', 'formcraftor' ) }
                                    value={ getVal( 'nameId', field.nameId || 'text_field' ) }
                                    onChange={ ( val ) => update( 'nameId', val ) }
                                />
                                <TextControl
                                    label={ __( 'Placeholder', 'formcraftor' ) }
                                    value={ getVal( 'placeholder', field.placeholder || '' ) }
                                    onChange={ ( val ) => update( 'placeholder', val ) }
                                />
                                <TextControl
                                    label={ __( 'Default Value', 'formcraftor' ) }
                                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                                    onChange={ ( val ) => update( 'defaultValue', val ) }
                                />
                                <TextareaControl
                                    label={ __( 'Help Text', 'formcraftor' ) }
                                    value={ getVal( 'helpText', field.helpText || '' ) }
                                    onChange={ ( val ) => update( 'helpText', val ) }
                                />
                            </div>
                        );
                    }
                    if ( tab.name === 'validation' ) {
                        return (
                            <div style={ { paddingTop: '10px' } }>
                                <ToggleControl
                                    label={ __( 'Required', 'formcraftor' ) }
                                    checked={ !! getVal( 'required', field.required ?? true ) }
                                    onChange={ ( val ) => update( 'required', val ) }
                                />
                                <NumberInput
                                    label={ __( 'Minimum Length', 'formcraftor' ) }
                                    value={ getVal( 'minLength', field.minLength ?? 0 ) }
                                    min={ 0 }
                                    onChange={ ( val ) => update( 'minLength', Number( val ) ) }
                                />
                                <NumberInput
                                    label={ __( 'Maximum Length', 'formcraftor' ) }
                                    value={ getVal( 'maxLength', field.maxLength ?? 255 ) }
                                    min={ 0 }
                                    onChange={ ( val ) => update( 'maxLength', Number( val ) ) }
                                />
                                <SelectControl
                                    label={ __( 'Input Type', 'formcraftor' ) }
                                    value={ getVal( 'inputType', field.inputType || 'text' ) }
                                    options={ [
                                        { label: 'Text', value: 'text' },
                                        { label: 'Password', value: 'password' },
                                        { label: 'Search', value: 'search' },
                                    ] }
                                    onChange={ ( val ) => update( 'inputType', val ) }
                                />
                                <TextControl
                                    label={ __( 'Pattern / Regex', 'formcraftor' ) }
                                    help={ __( 'e.g. ^[A-Za-z]+$', 'formcraftor' ) }
                                    value={ getVal( 'pattern', field.pattern || '' ) }
                                    onChange={ ( val ) => update( 'pattern', val ) }
                                />
                            </div>
                        );
                    }
                    if ( tab.name === 'appearance' ) {
                        return (
                            <div style={ { paddingTop: '10px' } }>
                                { widthControl }
                                <SelectControl
                                    label={ __( 'Label Position', 'formcraftor' ) }
                                    value={ getVal( 'labelPosition', field.labelPosition || 'above' ) }
                                    options={ [
                                        { label: 'Above Field', value: 'above' },
                                        { label: 'Inline / Beside Field', value: 'inline' },
                                        { label: 'Hidden', value: 'hidden' },
                                    ] }
                                    onChange={ ( val ) => update( 'labelPosition', val ) }
                                />
                                <ToggleControl
                                    label={ __( 'Enable Prefix / Suffix', 'formcraftor' ) }
                                    checked={ !! getVal( 'enablePrefixSuffix', field.enablePrefixSuffix ?? false ) }
                                    onChange={ ( val ) => update( 'enablePrefixSuffix', val ) }
                                />
                                { getVal( 'enablePrefixSuffix', false ) && (
                                    <>
                                        <TextControl
                                            label={ __( 'Prefix Text / Icon', 'formcraftor' ) }
                                            value={ getVal( 'prefixText', field.prefixText || '' ) }
                                            onChange={ ( val ) => update( 'prefixText', val ) }
                                        />
                                        <TextControl
                                            label={ __( 'Suffix Text / Icon', 'formcraftor' ) }
                                            value={ getVal( 'suffixText', field.suffixText || '' ) }
                                            onChange={ ( val ) => update( 'suffixText', val ) }
                                        />
                                    </>
                                ) }
                            </div>
                        );
                    }
                } }
            </TabPanel>
        );
    }

    // ==========================================
    // 3. FIRSTNAME FIELD
    // ==========================================
    if ( fType === 'firstname' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Firstname Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'first_name' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'John' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <TextControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <NumberInput
                    label={ __( 'Minimum Length', 'formcraftor' ) }
                    value={ getVal( 'minLength', field.minLength ?? 1 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'minLength', Number( val ) ) }
                />
                <NumberInput
                    label={ __( 'Maximum Length', 'formcraftor' ) }
                    value={ getVal( 'maxLength', field.maxLength ?? 50 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'maxLength', Number( val ) ) }
                />
                <ToggleControl
                    label={ __( 'Autocomplete', 'formcraftor' ) }
                    help={ __( 'Enables browser autocomplete (given-name).', 'formcraftor' ) }
                    checked={ !! getVal( 'autocomplete', field.autocomplete ?? true ) }
                    onChange={ ( val ) => update( 'autocomplete', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 4. LASTNAME FIELD
    // ==========================================
    if ( fType === 'lastname' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Lastname Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'last_name' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'Doe' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <TextControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <NumberInput
                    label={ __( 'Minimum Length', 'formcraftor' ) }
                    value={ getVal( 'minLength', field.minLength ?? 1 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'minLength', Number( val ) ) }
                />
                <NumberInput
                    label={ __( 'Maximum Length', 'formcraftor' ) }
                    value={ getVal( 'maxLength', field.maxLength ?? 50 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'maxLength', Number( val ) ) }
                />
                <ToggleControl
                    label={ __( 'Autocomplete', 'formcraftor' ) }
                    help={ __( 'Enables browser autocomplete (family-name).', 'formcraftor' ) }
                    checked={ !! getVal( 'autocomplete', field.autocomplete ?? true ) }
                    onChange={ ( val ) => update( 'autocomplete', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 5. PHONE FIELD
    // ==========================================
    if ( fType === 'phone' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Phone Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'phone_number' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'Enter phone number' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <SelectControl
                    label={ __( 'Default Country Code', 'formcraftor' ) }
                    value={ getVal( 'defaultCountryCode', field.defaultCountryCode || '+1' ) }
                    options={ COUNTRY_CODES }
                    onChange={ ( val ) => update( 'defaultCountryCode', val ) }
                />
                <TextControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <NumberInput
                    label={ __( 'Minimum Digits', 'formcraftor' ) }
                    value={ getVal( 'minDigits', field.minDigits ?? 7 ) }
                    min={ 1 }
                    max={ 20 }
                    onChange={ ( val ) => update( 'minDigits', Number( val ) ) }
                />
                <NumberInput
                    label={ __( 'Maximum Digits', 'formcraftor' ) }
                    value={ getVal( 'maxDigits', field.maxDigits ?? 15 ) }
                    min={ 1 }
                    max={ 20 }
                    onChange={ ( val ) => update( 'maxDigits', Number( val ) ) }
                />
                <SelectControl
                    label={ __( 'Allowed Characters', 'formcraftor' ) }
                    value={ getVal( 'allowedChars', field.allowedChars || 'digits_plus' ) }
                    options={ [
                        { label: 'Digits Only (0-9)', value: 'digits_only' },
                        { label: 'Digits and +', value: 'digits_plus' },
                    ] }
                    onChange={ ( val ) => update( 'allowedChars', val ) }
                />
                <ToggleControl
                    label={ __( 'Phone Validation', 'formcraftor' ) }
                    checked={ !! getVal( 'phoneValidation', field.phoneValidation ?? true ) }
                    onChange={ ( val ) => update( 'phoneValidation', val ) }
                />
                <ToggleControl
                    label={ __( 'International Number Support', 'formcraftor' ) }
                    help={ __( 'Supports international length (up to 15 digits) and country prefixes.', 'formcraftor' ) }
                    checked={ !! getVal( 'internationalSupport', field.internationalSupport ?? true ) }
                    onChange={ ( val ) => update( 'internationalSupport', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 6. EMAIL FIELD
    // ==========================================
    if ( fType === 'email' ) {
        const restrictDomains = !! getVal( 'restrictAllowedDomains', field.restrictAllowedDomains ?? false );

        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Email Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'email_address' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'user@example.com' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <TextControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? true ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <ToggleControl
                    label={ __( 'Email Format Validation', 'formcraftor' ) }
                    checked={ !! getVal( 'emailValidation', field.emailValidation ?? true ) }
                    onChange={ ( val ) => update( 'emailValidation', val ) }
                />
                <ToggleControl
                    label={ __( 'Restrict Allowed Domains', 'formcraftor' ) }
                    help={ __( 'Limit submissions to specific email domain names.', 'formcraftor' ) }
                    checked={ restrictDomains }
                    onChange={ ( val ) => update( 'restrictAllowedDomains', val ) }
                />
                { restrictDomains && (
                    <TextareaControl
                        label={ __( 'Allowed Domains', 'formcraftor' ) }
                        help={ __( 'Comma-separated domains, e.g. company.com, gmail.com', 'formcraftor' ) }
                        value={ getVal( 'allowedDomains', field.allowedDomains || '' ) }
                        onChange={ ( val ) => update( 'allowedDomains', val ) }
                    />
                ) }
                <TextareaControl
                    label={ __( 'Blocked Domains', 'formcraftor' ) }
                    help={ __( 'Comma-separated domains to block, e.g. mailinator.com, tempmail.com', 'formcraftor' ) }
                    value={ getVal( 'blockedDomains', field.blockedDomains || '' ) }
                    onChange={ ( val ) => update( 'blockedDomains', val ) }
                />
                <ToggleControl
                    label={ __( 'Confirmation Field', 'formcraftor' ) }
                    help={ __( 'Show a second email field to confirm matching address.', 'formcraftor' ) }
                    checked={ !! getVal( 'confirmationField', field.confirmationField ?? false ) }
                    onChange={ ( val ) => update( 'confirmationField', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 7. DESCRIPTION / TEXTAREA FIELD
    // ==========================================
    if ( fType === 'description' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Description Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'user_description' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'Write your message...' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <TextareaControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || '' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <NumberInput
                    label={ __( 'Minimum Length', 'formcraftor' ) }
                    value={ getVal( 'minLength', field.minLength ?? 0 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'minLength', Number( val ) ) }
                />
                <NumberInput
                    label={ __( 'Maximum Length', 'formcraftor' ) }
                    value={ getVal( 'maxLength', field.maxLength ?? 1000 ) }
                    min={ 0 }
                    onChange={ ( val ) => update( 'maxLength', Number( val ) ) }
                />
                <NumberInput
                    label={ __( 'Rows / Height', 'formcraftor' ) }
                    value={ getVal( 'rows', field.rows ?? 4 ) }
                    min={ 1 }
                    max={ 20 }
                    onChange={ ( val ) => update( 'rows', Number( val ) ) }
                />
                <ToggleControl
                    label={ __( 'Character Counter', 'formcraftor' ) }
                    help={ __( 'Displays live remaining character counter under textarea.', 'formcraftor' ) }
                    checked={ !! getVal( 'charCounter', field.charCounter ?? true ) }
                    onChange={ ( val ) => update( 'charCounter', val ) }
                />
                <SelectControl
                    label={ __( 'Resize Option', 'formcraftor' ) }
                    value={ getVal( 'resizeOption', field.resizeOption || 'vertical' ) }
                    options={ [
                        { label: 'None', value: 'none' },
                        { label: 'Vertical Only', value: 'vertical' },
                        { label: 'Both (Horizontal & Vertical)', value: 'both' },
                    ] }
                    onChange={ ( val ) => update( 'resizeOption', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 8. FILE UPLOAD FIELD
    // ==========================================
    if ( fType === 'file' ) {
        const multipleFiles = !! getVal( 'multipleFiles', field.multipleFiles ?? false );

        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'File Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'uploaded_file' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Button Text', 'formcraftor' ) }
                    value={ getVal( 'buttonText', field.buttonText || 'Choose File' ) }
                    onChange={ ( val ) => update( 'buttonText', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <AllowedFileTypesControl
                    value={ getVal( 'allowedFileTypes', field.allowedFileTypes || ALLOWED_FILE_TYPES ) }
                    onChange={ ( val ) => update( 'allowedFileTypes', val ) }
                />
                <NumberInput
                    label={ __( 'Maximum File Size (MB)', 'formcraftor' ) }
                    value={ getVal( 'maxFileSize', field.maxFileSize ?? 10 ) }
                    min={ 1 }
                    max={ 100 }
                    onChange={ ( val ) => update( 'maxFileSize', Number( val ) ) }
                />
                <ToggleControl
                    label={ __( 'Multiple File Upload', 'formcraftor' ) }
                    checked={ multipleFiles }
                    onChange={ ( val ) => update( 'multipleFiles', val ) }
                />
                { multipleFiles && (
                    <NumberInput
                        label={ __( 'Maximum Number of Files', 'formcraftor' ) }
                        value={ getVal( 'maxFiles', field.maxFiles ?? 3 ) }
                        min={ 1 }
                        max={ 20 }
                        onChange={ ( val ) => update( 'maxFiles', Number( val ) ) }
                    />
                ) }
                <ToggleControl
                    label={ __( 'Drag-and-Drop Upload', 'formcraftor' ) }
                    checked={ !! getVal( 'dragAndDrop', field.dragAndDrop ?? true ) }
                    onChange={ ( val ) => update( 'dragAndDrop', val ) }
                />
                <ToggleControl
                    label={ __( 'Display File Preview', 'formcraftor' ) }
                    checked={ !! getVal( 'displayPreview', field.displayPreview ?? true ) }
                    onChange={ ( val ) => update( 'displayPreview', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 9. DROPDOWN / SELECT FIELD
    // ==========================================
    if ( fType === 'dropdown' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Dropdown Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'inquiry_type' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Placeholder', 'formcraftor' ) }
                    value={ getVal( 'placeholder', field.placeholder || 'Select an option...' ) }
                    onChange={ ( val ) => update( 'placeholder', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <OptionsManager
                    options={ getVal( 'options', field.options || [] ) }
                    onChange={ ( val ) => update( 'options', val ) }
                    allowDefaultToggle={ true }
                />
                <ToggleControl
                    label={ __( 'Allow Multiple Selection', 'formcraftor' ) }
                    checked={ !! getVal( 'allowMultiple', field.allowMultiple ?? false ) }
                    onChange={ ( val ) => update( 'allowMultiple', val ) }
                />
                <ToggleControl
                    label={ __( 'Searchable Dropdown', 'formcraftor' ) }
                    help={ __( 'Allows typing to filter options quickly.', 'formcraftor' ) }
                    checked={ !! getVal( 'searchable', field.searchable ?? false ) }
                    onChange={ ( val ) => update( 'searchable', val ) }
                />
                <ToggleControl
                    label={ __( 'Allow Custom Option', 'formcraftor' ) }
                    help={ __( 'Permits users to type their own custom choice.', 'formcraftor' ) }
                    checked={ !! getVal( 'allowCustomOption', field.allowCustomOption ?? false ) }
                    onChange={ ( val ) => update( 'allowCustomOption', val ) }
                />
                <ToggleControl
                    label={ __( 'Enable Conditional Options', 'formcraftor' ) }
                    checked={ !! getVal( 'enableConditionalOptions', field.enableConditionalOptions ?? false ) }
                    onChange={ ( val ) => update( 'enableConditionalOptions', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 10. GENDER / RADIO FIELD
    // ==========================================
    if ( fType === 'gender' ) {
        const layout = getVal( 'layout', field.layout || 'horizontal' );
        const allowOther = !! getVal( 'allowOtherOption', field.allowOtherOption ?? false );

        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Gender Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'gender_selection' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? false ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <OptionsManager
                    options={ getVal( 'options', field.options || [] ) }
                    onChange={ ( val ) => update( 'options', val ) }
                    allowDefaultToggle={ true }
                />
                <SelectControl
                    label={ __( 'Layout', 'formcraftor' ) }
                    value={ layout }
                    options={ [
                        { label: 'Horizontal (Inline)', value: 'horizontal' },
                        { label: 'Vertical (Stacked)', value: 'vertical' },
                        { label: 'Grid', value: 'grid' },
                    ] }
                    onChange={ ( val ) => update( 'layout', val ) }
                />
                { layout === 'grid' && (
                    <NumberInput
                        label={ __( 'Number of Columns', 'formcraftor' ) }
                        value={ getVal( 'gridColumns', field.gridColumns ?? 3 ) }
                        min={ 1 }
                        max={ 6 }
                        onChange={ ( val ) => update( 'gridColumns', Number( val ) ) }
                    />
                ) }
                <ToggleControl
                    label={ __( 'Allow Other Option', 'formcraftor' ) }
                    checked={ allowOther }
                    onChange={ ( val ) => update( 'allowOtherOption', val ) }
                />
                { allowOther && (
                    <TextControl
                        label={ __( 'Other Option Text', 'formcraftor' ) }
                        value={ getVal( 'otherOptionText', field.otherOptionText || 'Please specify' ) }
                        onChange={ ( val ) => update( 'otherOptionText', val ) }
                    />
                ) }
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 11. CHECKBOX FIELD
    // ==========================================
    if ( fType === 'checkbox' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Checkbox Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'terms_agreement' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Checkbox Text', 'formcraftor' ) }
                    value={ getVal( 'checkboxText', field.checkboxText || 'I agree to the terms and conditions' ) }
                    onChange={ ( val ) => update( 'checkboxText', val ) }
                />
                <ToggleControl
                    label={ __( 'Required', 'formcraftor' ) }
                    checked={ !! getVal( 'required', field.required ?? true ) }
                    onChange={ ( val ) => update( 'required', val ) }
                />
                <ToggleControl
                    label={ __( 'Default Checked', 'formcraftor' ) }
                    checked={ !! getVal( 'defaultChecked', field.defaultChecked ?? false ) }
                    onChange={ ( val ) => update( 'defaultChecked', val ) }
                />
                <TextControl
                    label={ __( 'Default Value', 'formcraftor' ) }
                    value={ getVal( 'defaultValue', field.defaultValue || 'agree' ) }
                    onChange={ ( val ) => update( 'defaultValue', val ) }
                />
                <SelectControl
                    label={ __( 'Label Position', 'formcraftor' ) }
                    value={ getVal( 'labelPosition', field.labelPosition || 'after' ) }
                    options={ [
                        { label: 'After Checkbox', value: 'after' },
                        { label: 'Before Checkbox', value: 'before' },
                    ] }
                    onChange={ ( val ) => update( 'labelPosition', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 12. TOGGLE / SWITCH FIELD
    // ==========================================
    if ( fType === 'toggle' ) {
        return (
            <div>
                <TextControl
                    label={ __( 'Field Label', 'formcraftor' ) }
                    value={ getVal( 'label', field.label || 'Toggle Label' ) }
                    onChange={ ( val ) => update( 'label', val ) }
                />
                <TextControl
                    label={ __( 'Field Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'notifications_toggle' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <TextControl
                    label={ __( 'Toggle Text', 'formcraftor' ) }
                    value={ getVal( 'toggleText', field.toggleText || 'Enable Setting' ) }
                    onChange={ ( val ) => update( 'toggleText', val ) }
                />
                <ToggleControl
                    label={ __( 'Default State', 'formcraftor' ) }
                    checked={ !! getVal( 'defaultState', field.defaultState ?? false ) }
                    onChange={ ( val ) => update( 'defaultState', val ) }
                />
                <TextControl
                    label={ __( 'On Value', 'formcraftor' ) }
                    value={ getVal( 'onValue', field.onValue || 'yes' ) }
                    onChange={ ( val ) => update( 'onValue', val ) }
                />
                <TextControl
                    label={ __( 'Off Value', 'formcraftor' ) }
                    value={ getVal( 'offValue', field.offValue || 'no' ) }
                    onChange={ ( val ) => update( 'offValue', val ) }
                />
                <ToggleControl
                    label={ __( 'Required to Be Enabled', 'formcraftor' ) }
                    checked={ !! getVal( 'requiredToBeEnabled', field.requiredToBeEnabled ?? false ) }
                    onChange={ ( val ) => update( 'requiredToBeEnabled', val ) }
                />
                <ToggleControl
                    label={ __( 'Disabled State', 'formcraftor' ) }
                    checked={ !! getVal( 'disabledState', field.disabledState ?? false ) }
                    onChange={ ( val ) => update( 'disabledState', val ) }
                />
                <SelectControl
                    label={ __( 'Display Style', 'formcraftor' ) }
                    value={ getVal( 'displayStyle', field.displayStyle || 'switch' ) }
                    options={ [
                        { label: 'Modern Switch', value: 'switch' },
                        { label: 'Checkbox', value: 'checkbox' },
                    ] }
                    onChange={ ( val ) => update( 'displayStyle', val ) }
                />
                <TextareaControl
                    label={ __( 'Help Text', 'formcraftor' ) }
                    value={ getVal( 'helpText', field.helpText || '' ) }
                    onChange={ ( val ) => update( 'helpText', val ) }
                />
                { widthControl }
            </div>
        );
    }

    // ==========================================
    // 13. SUBMIT BUTTON
    // ==========================================
    if ( fType === 'submit' ) {
        const redirect = !! getVal( 'redirectAfterSubmit', field.redirectAfterSubmit ?? false );

        return (
            <div>
                <TextControl
                    label={ __( 'Button Text', 'formcraftor' ) }
                    value={ getVal( 'buttonText', field.buttonText || field.label || 'Submit Form' ) }
                    onChange={ ( val ) => {
                        update( 'buttonText', val );
                        update( 'label', val );
                    } }
                />
                <TextControl
                    label={ __( 'Button Name / ID', 'formcraftor' ) }
                    value={ getVal( 'nameId', field.nameId || 'submit_btn' ) }
                    onChange={ ( val ) => update( 'nameId', val ) }
                />
                <SelectControl
                    label={ __( 'Button Type', 'formcraftor' ) }
                    value={ getVal( 'buttonType', field.buttonType || 'submit' ) }
                    options={ [
                        { label: 'Submit Button', value: 'submit' },
                        { label: 'Reset Button', value: 'reset' },
                    ] }
                    onChange={ ( val ) => update( 'buttonType', val ) }
                />
                <SelectControl
                    label={ __( 'Button Alignment', 'formcraftor' ) }
                    value={ getVal( 'alignment', field.alignment || 'left' ) }
                    options={ [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Full Width', value: 'full' },
                    ] }
                    onChange={ ( val ) => update( 'alignment', val ) }
                />
                <SelectControl
                    label={ __( 'Button Size', 'formcraftor' ) }
                    value={ getVal( 'size', field.size || 'medium' ) }
                    options={ [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                    ] }
                    onChange={ ( val ) => update( 'size', val ) }
                />

                <div style={ { marginTop: '12px', marginBottom: '12px' } }>
                    <label style={ { display: 'block', fontWeight: 600, marginBottom: '6px' } }>
                        { __( 'Button Background Color', 'formcraftor' ) }
                    </label>
                    <ColorPalette
                        colors={ COLOR_PALETTE_DEFAULTS }
                        value={ getVal( 'bgColor', field.bgColor || '#2271b1' ) }
                        onChange={ ( val ) => update( 'bgColor', val || '#2271b1' ) }
                    />
                </div>

                <div style={ { marginTop: '12px', marginBottom: '12px' } }>
                    <label style={ { display: 'block', fontWeight: 600, marginBottom: '6px' } }>
                        { __( 'Button Text Color', 'formcraftor' ) }
                    </label>
                    <ColorPalette
                        colors={ COLOR_PALETTE_DEFAULTS }
                        value={ getVal( 'textColor', field.textColor || '#ffffff' ) }
                        onChange={ ( val ) => update( 'textColor', val || '#ffffff' ) }
                    />
                </div>

                <RangeControl
                    label={ __( 'Border Radius (px)', 'formcraftor' ) }
                    value={ getVal( 'borderRadius', field.borderRadius ?? 4 ) }
                    min={ 0 }
                    max={ 50 }
                    onChange={ ( val ) => update( 'borderRadius', val ) }
                />

                {/* Dimensions / Padding Control */}
                <div style={ { background: '#f6f7f7', border: '1px solid #dcdcde', borderRadius: '4px', padding: '10px', marginBottom: '14px' } }>
                    <label style={ { display: 'block', fontWeight: 600, marginBottom: '8px' } }>
                        { __( 'Padding (Dimensions Control)', 'formcraftor' ) }
                    </label>
                    <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
                        <NumberInput
                            label={ __( 'Top (px)', 'formcraftor' ) }
                            value={ getVal( 'paddingTop', field.paddingTop ?? 12 ) }
                            min={ 0 }
                            max={ 60 }
                            onChange={ ( val ) => update( 'paddingTop', Number( val ) ) }
                        />
                        <NumberInput
                            label={ __( 'Right (px)', 'formcraftor' ) }
                            value={ getVal( 'paddingRight', field.paddingRight ?? 24 ) }
                            min={ 0 }
                            max={ 100 }
                            onChange={ ( val ) => update( 'paddingRight', Number( val ) ) }
                        />
                        <NumberInput
                            label={ __( 'Bottom (px)', 'formcraftor' ) }
                            value={ getVal( 'paddingBottom', field.paddingBottom ?? 12 ) }
                            min={ 0 }
                            max={ 60 }
                            onChange={ ( val ) => update( 'paddingBottom', Number( val ) ) }
                        />
                        <NumberInput
                            label={ __( 'Left (px)', 'formcraftor' ) }
                            value={ getVal( 'paddingLeft', field.paddingLeft ?? 24 ) }
                            min={ 0 }
                            max={ 100 }
                            onChange={ ( val ) => update( 'paddingLeft', Number( val ) ) }
                        />
                    </div>
                </div>

                <TextControl
                    label={ __( 'Loading Text', 'formcraftor' ) }
                    value={ getVal( 'loadingText', field.loadingText || 'Submitting...' ) }
                    onChange={ ( val ) => update( 'loadingText', val ) }
                />
                <ToggleControl
                    label={ __( 'Show Loading Indicator', 'formcraftor' ) }
                    checked={ !! getVal( 'showLoadingIndicator', field.showLoadingIndicator ?? true ) }
                    onChange={ ( val ) => update( 'showLoadingIndicator', val ) }
                />
                <ToggleControl
                    label={ __( 'Disable While Submitting', 'formcraftor' ) }
                    checked={ !! getVal( 'disableWhileSubmitting', field.disableWhileSubmitting ?? true ) }
                    onChange={ ( val ) => update( 'disableWhileSubmitting', val ) }
                />
                <TextareaControl
                    label={ __( 'Success Message', 'formcraftor' ) }
                    value={ getVal( 'successMessage', field.successMessage || 'Thank you! Your submission has been received.' ) }
                    onChange={ ( val ) => update( 'successMessage', val ) }
                />
                <ToggleControl
                    label={ __( 'Redirect After Submission', 'formcraftor' ) }
                    checked={ redirect }
                    onChange={ ( val ) => update( 'redirectAfterSubmit', val ) }
                />
                { redirect && (
                    <TextControl
                        label={ __( 'Redirect URL', 'formcraftor' ) }
                        help={ __( 'https://example.com/thank-you', 'formcraftor' ) }
                        value={ getVal( 'redirectUrl', field.redirectUrl || '' ) }
                        onChange={ ( val ) => update( 'redirectUrl', val ) }
                    />
                ) }
                <ToggleControl
                    label={ __( 'Reset Form After Submission', 'formcraftor' ) }
                    checked={ !! getVal( 'resetFormAfterSubmit', field.resetFormAfterSubmit ?? true ) }
                    onChange={ ( val ) => update( 'resetFormAfterSubmit', val ) }
                />
                { widthControl }
            </div>
        );
    }

    return null;
}
