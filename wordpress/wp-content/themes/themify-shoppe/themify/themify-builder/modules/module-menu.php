<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * Module Name: Menu
 * Description: Display Custom Menu
 */
class TB_Menu_Module extends Themify_Builder_Module {
	function __construct() {
		parent::__construct(array(
			'name' => __( 'Menu', 'themify' ),
			'slug' => 'menu'
		));
	}

	public function get_title( $module ) {
		return isset( $module['mod_settings']['custom_menu'] ) ? $module['mod_settings']['custom_menu'] : '';
	}

	public function get_options() {
		$menus = get_terms( 'nav_menu', array( 'hide_empty' => true ) );
		$options = array(
			array(
				'id' => 'mod_title_menu',
				'type' => 'text',
				'label' => __( 'Module Title', 'themify' ),
				'class' => 'large'
			),
			array(
				'id' => 'layout_menu',
				'type' => 'layout',
				'label' => __( 'Menu Layout', 'themify' ),
				'options' => array(
					array( 'img' => 'menu-bar.png', 'value' => 'menu-bar', 'label' => __( 'Menu Bar', 'themify' ) ),
					array( 'img' => 'menu-fullbar.png', 'value' => 'fullwidth', 'label' => __( 'Menu Fullbar', 'themify' ) ),
					array( 'img' => 'menu-vertical.png', 'value' => 'vertical', 'label' => __( 'Menu Vertical', 'themify' ) )
				)
			),
			array(
				'id' => 'custom_menu',
				'type' => 'select_menu',
				'label' => __( 'Custom Menu', 'themify' ),
				'options' => $menus,
				'help' => sprintf( __( 'Add more <a href="%s" target="_blank">menu</a>', 'themify' ), admin_url( 'nav-menus.php' ) ),
				'break' => true,
				'render_callback' => array(
					'control_type' => 'select'
				)
			),
			array(
				'id' => 'allow_menu_breakpoint',
				'pushed' => 'pushed',
				'type' => 'checkbox',
				'label' => false,
				'options' => array(
					array( 'name' => 'allow_menu', 'value' => __( 'Enable mobile menu', 'themify' ) )
				),
				'option_js' => true,
			),
			array(
				'id' => 'menu_breakpoint',
				'pushed' => 'pushed',
				'type' => 'text',
				'label' => false,
				'class' => 'small',
				'after' => __( 'Mobile menu breakpoint (px)', 'themify' ),
				'binding' => array(
					'empty' => array(
						'hide' => array( 'menu_slide_direction' )
					),
					'not_empty' => array(
						'show' => array( 'menu_slide_direction' )
					)
				),
				'wrap_with_class' => 'ui-helper-hidden tf-group-element tf-checkbox-element tf-checkbox-element-allow_menu'
			),
			array(
				'id' => 'menu_slide_direction',
				'pushed' => 'pushed',
				'type' => 'select',
				'label' => false,
				'after' => __( 'Mobile slide direction', 'themify' ),
				'options' => array(
					'right' => __( 'Right', 'themify' ),
					'left' => __( 'Left', 'themify' )
				),
				'wrap_with_class' => 'ui-helper-hidden tf-group-element tf-checkbox-element tf-checkbox-element-allow_menu',
			),
			array(
				'id' => 'color_menu',
				'type' => 'layout',
				'label' => __('Menu Color', 'themify'),
				'options' => array(
					array('img' => 'color-default.png', 'value' => 'default', 'label' => __('default', 'themify')),
					array('img' => 'color-black.png', 'value' => 'black', 'label' => __('black', 'themify')),
					array('img' => 'color-grey.png', 'value' => 'gray', 'label' => __('gray', 'themify')),
					array('img' => 'color-blue.png', 'value' => 'blue', 'label' => __('blue', 'themify')),
					array('img' => 'color-light-blue.png', 'value' => 'light-blue', 'label' => __('light-blue', 'themify')),
					array('img' => 'color-green.png', 'value' => 'green', 'label' => __('green', 'themify')),
					array('img' => 'color-light-green.png', 'value' => 'light-green', 'label' => __('light-green', 'themify')),
					array('img' => 'color-purple.png', 'value' => 'purple', 'label' => __('purple', 'themify')),
					array('img' => 'color-light-purple.png', 'value' => 'light-purple', 'label' => __('light-purple', 'themify')),
					array('img' => 'color-brown.png', 'value' => 'brown', 'label' => __('brown', 'themify')),
					array('img' => 'color-orange.png', 'value' => 'orange', 'label' => __('orange', 'themify')),
					array('img' => 'color-yellow.png', 'value' => 'yellow', 'label' => __('yellow', 'themify')),
					array('img' => 'color-red.png', 'value' => 'red', 'label' => __('red', 'themify')),
					array('img' => 'color-pink.png', 'value' => 'pink', 'label' => __('pink', 'themify')),
					array('img' => 'color-transparent.png', 'value' => 'transparent', 'label' => __('Transparent', 'themify'))
				)
			),
			array(
				'id' => 'according_style_menu',
				'type' => 'checkbox',
				'label' => __( 'According Styles', 'themify' ),
				'options' => Themify_Builder_Model::get_appearance()
			),
			// Additional CSS
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr/>')
			),
			array(
				'id' => 'css_menu',
				'type' => 'text',
				'label' => __( 'Additional CSS Class', 'themify' ),
				'class' => 'large exclude-from-reset-field',
				'help' => sprintf( '<br/><small>%s</small>', __( 'Add additional CSS class(es) for custom styling', 'themify' ) )
			)
		);
		return $options;
	}

	public function get_animation() {
		$animation = array(
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . esc_html__( 'Appearance Animation', 'themify' ) . '</h4>')
			),
			array(
				'id' => 'multi_Animation Effect',
				'type' => 'multi',
				'label' => __( 'Effect', 'themify' ),
				'fields' => array(
					array(
						'id' => 'animation_effect',
						'type' => 'animation_select',
						'label' => __( 'Effect', 'themify' )
					),
					array(
						'id' => 'animation_effect_delay',
						'type' => 'text',
						'label' => __( 'Delay', 'themify' ),
						'class' => 'xsmall',
						'description' => __( 'Delay (s)', 'themify' ),
					),
					array(
						'id' => 'animation_effect_repeat',
						'type' => 'text',
						'label' => __( 'Repeat', 'themify' ),
						'class' => 'xsmall',
						'description' => __( 'Repeat (x)', 'themify' ),
					),
				)
			)
		);

		return $animation;
	}

	public function get_styling() {
		$general = array(
			// Background
			array(
				'id' => 'separator_image_background',
				'title' => '',
				'description' => '',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Background', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'background_color',
				'type' => 'color',
				'label' => __( 'Background Color', 'themify' ),
				'class' => 'small',
				'prop' => 'background-color',
				'selector' => '.module-menu .nav li'
			),
			// Font
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr />' )
			),
			array(
				'id' => 'separator_font',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Font', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'font_family',
				'type' => 'font_select',
				'label' => __( 'Font Family', 'themify' ),
				'class' => 'font-family-select',
				'prop' => 'font-family',
				'selector' => '.module-menu .nav li'
			),
			array(
				'id' => 'font_color',
				'type' => 'color',
				'label' => __( 'Font Color', 'themify' ),
				'class' => 'small',
				'prop' => 'color',
				'selector' => '.module-menu .nav li'
			),
			array(
				'id' => 'multi_font_size',
				'type' => 'multi',
				'label' => __( 'Font Size', 'themify' ),
				'fields' => array(
					array(
						'id' => 'font_size',
						'type' => 'text',
						'class' => 'xsmall',
						'prop' => 'font-size',
						'selector' => '.module-menu .nav li'
					),
					array(
						'id' => 'font_size_unit',
						'type' => 'select',
						'meta' => Themify_Builder_Model::get_css_units()
					)
				)
			),
			array(
				'id' => 'multi_line_height',
				'type' => 'multi',
				'label' => __( 'Line Height', 'themify' ),
				'fields' => array(
					array(
						'id' => 'line_height',
						'type' => 'text',
						'class' => 'xsmall',
						'prop' => 'line-height',
						'selector' => '.module-menu .nav li'
					),
					array(
						'id' => 'line_height_unit',
						'type' => 'select',
						'meta' => Themify_Builder_Model::get_css_units()
					)
				)
			),
			array(
				'id' => 'multi_letter_spacing',
				'type' => 'multi',
				'label' => __( 'Letter Spacing', 'themify' ),
				'fields' => array(
					array(
						'id' => 'letter_spacing',
						'type' => 'text',
						'class' => 'xsmall',
						'prop' => 'letter-spacing',
						'selector' => '.module_row'
					),
					array(
						'id' => 'letter_spacing_unit',
						'type' => 'select',
						'meta' => Themify_Builder_Model::get_css_units(),
						'default' => 'px',
					)
				)
			),
			array(
				'id' => 'text_align',
				'label' => __( 'Text Align', 'themify' ),
				'type' => 'icon_radio',
				'meta' => Themify_Builder_Model::get_text_align(),
				'prop' => 'text-align',
				'selector' => '.module-menu .nav'
			),
			array(
				'id' => 'text_transform',
				'label' => __( 'Text Transform', 'themify' ),
				'type' => 'icon_radio',
				'meta' => Themify_Builder_Model::get_text_transform(),
				'prop' => 'text-transform',
				'selector' => '.module-menu .nav'
			),
			array(
				'id' => 'multi_font_style',
				'type' => 'multi',
				'label' => __( 'Font Style', 'themify' ),
				'fields' => array(
					array(
						'id' => 'font_style_regular',
						'type' => 'icon_radio',
						'meta' => Themify_Builder_Model::get_font_style(),
						'prop' => 'font-style',
						'class' => 'inline',
						'selector' => '.module-menu .nav'
					),
					array(
						'id' => 'text_decoration_regular',
						'type' => 'icon_radio',
						'meta' => Themify_Builder_Model::get_text_decoration(),
						'prop' => 'text-decoration',
						'class' => 'inline',
						'selector' => '.module-menu .nav'
					),
				)
			),
			// Padding
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr />' )
			),
			array(
				'id' => 'separator_padding',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Padding', 'themify' ) . '</h4>' ),
			),
			Themify_Builder_Model::get_field_group( 'padding', '.module-menu .nav li', 'top' ),
			Themify_Builder_Model::get_field_group( 'padding', '.module-menu .nav li', 'right' ),
			Themify_Builder_Model::get_field_group( 'padding', '.module-menu .nav li', 'bottom' ),
			Themify_Builder_Model::get_field_group( 'padding', '.module-menu .nav li', 'left' ),
			Themify_Builder_Model::get_field_group( 'padding', '.module-menu .nav li', 'all' ),
			// Margin
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr />' )
			),
			array(
				'id' => 'separator_margin',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Margin', 'themify') . '</h4>' ),
			),
			Themify_Builder_Model::get_field_group( 'margin', '.module-menu', 'top' ),
			Themify_Builder_Model::get_field_group( 'margin', '.module-menu', 'right' ),
			Themify_Builder_Model::get_field_group( 'margin', '.module-menu', 'bottom' ),
			Themify_Builder_Model::get_field_group( 'margin', '.module-menu', 'left' ),
			Themify_Builder_Model::get_field_group( 'margin', '.module-menu', 'all' ),
			// Border
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr />' )
			),
			array(
				'id' => 'separator_border',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Border', 'themify' ) . '</h4>' )
			),
			Themify_Builder_Model::get_field_group( 'border', '.module-menu .nav li', 'top' ),
			Themify_Builder_Model::get_field_group( 'border', '.module-menu .nav li', 'right' ),
			Themify_Builder_Model::get_field_group( 'border', '.module-menu .nav li', 'bottom' ),
			Themify_Builder_Model::get_field_group( 'border', '.module-menu .nav li', 'left' ),
			Themify_Builder_Model::get_field_group( 'border', '.module-menu .nav li', 'all' )
		);

		$menu_links = array (
			// Background
			array(
				'id' => 'separator_link',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Background', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'link_background_color',
				'type' => 'color',
				'label' => __( 'Background Color', 'themify' ),
				'class' => 'small',
				'prop' => 'background-color',
				'selector' => '.module-menu a'
			),
			array(
				'id' => 'link_hover_background_color',
				'type' => 'color',
				'label' => __( 'Background Hover', 'themify' ),
				'class' => 'small',
				'prop' => 'background-color',
				'selector' => '.module-menu a:hover'
			),
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr/>')
			),
			array(
				'id' => 'separator_link',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Font', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'link_color',
				'type' => 'color',
				'label' => __( 'Color', 'themify' ),
				'class' => 'small',
				'prop' => 'color',
				'selector' => '.module-menu a'
			),
			array(
				'id' => 'link_hover_color',
				'type' => 'color',
				'label' => __( 'Color Hover', 'themify' ),
				'class' => 'small',
				'prop' => 'color',
				'selector' => '.module-menu a:hover'
			),
			array(
				'id' => 'text_decoration',
				'type' => 'select',
				'label' => __( 'Text Decoration', 'themify' ),
				'meta'	=> Themify_Builder_Model::get_text_decoration(),
				'prop' => 'text-decoration',
				'selector' => '.module-menu a'
			),
		);

		$menu_dropdown = array (
			// Background
			array(
				'id' => 'separator_link',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Background', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'dropdown_background_color',
				'type' => 'color',
				'label' => __( 'Background Color', 'themify' ),
				'class' => 'small',
				'prop' => 'background-color',
				'selector' => '.module-menu li > ul a'
			),
			array(
				'id' => 'dropdown_hover_background_color',
				'type' => 'color',
				'label' => __( 'Background Hover', 'themify' ),
				'class' => 'small',
				'prop' => 'background-color',
				'selector' => '.module-menu li > ul a:hover'
			),
			array(
				'type' => 'separator',
				'meta' => array( 'html' => '<hr/>')
			),
			array(
				'id' => 'separator_link',
				'type' => 'separator',
				'meta' => array( 'html' => '<h4>' . __( 'Font', 'themify' ) . '</h4>' )
			),
			array(
				'id' => 'dropdown_color',
				'type' => 'color',
				'label' => __( 'Color', 'themify' ),
				'class' => 'small',
				'prop' => 'color',
				'selector' => '.module-menu li > ul a'
			),
			array(
				'id' => 'dropdown_hover_color',
				'type' => 'color',
				'label' => __( 'Color Hover', 'themify' ),
				'class' => 'small',
				'prop' => 'color',
				'selector' => '.module-menu li > ul a:hover'
			),
		);

		return array(
			array(
				'type' => 'tabs',
				'id' => 'module-styling',
				'tabs' => array(
					'general' => array(
					'label' => __( 'General', 'themify' ),
					'fields' => $general
					),
					'module-title' => array(
						'label' => __( 'Module Title', 'themify' ),
						'fields' => Themify_Builder_Model::module_title_custom_style( $this->slug )
					),
					'links' => array(
						'label' => __( 'Menu Links', 'themify' ),
						'fields' => $menu_links
					),
					'dropdown' => array(
						'label' => __( 'Menu Dropdown', 'themify' ),
						'fields' => $menu_dropdown
					)
				)
			),
		);

	}
}

///////////////////////////////////////
// Module Options
///////////////////////////////////////
Themify_Builder_Model::register_module( 'TB_Menu_Module' );