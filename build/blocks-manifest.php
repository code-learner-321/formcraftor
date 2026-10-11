<?php
// This file is generated. Do not modify it manually.
return array(
	'formcraftor' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formcraftor/formcraftor',
		'title' => 'Formcraftor Form Widget',
		'category' => 'widgets',
		'icon' => 'feedback',
		'description' => 'Select and display a custom form created in Formcraftor with widget-specific customizations.',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'attributes' => array(
			'selectedFormId' => array(
				'type' => 'string',
				'default' => ''
			),
			'fieldOverrides' => array(
				'type' => 'string',
				'default' => '{}'
			)
		),
		'textdomain' => 'formcraftor',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
