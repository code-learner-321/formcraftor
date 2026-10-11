/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
    edit: Edit,
    save: () => {
        // Dynamic block handled server-side via render.php
        return null;
    },
});