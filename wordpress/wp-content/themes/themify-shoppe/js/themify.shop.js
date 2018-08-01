; //defensive semicolon
//////////////////////////////
// Test if touch event exists
//////////////////////////////
function is_touch_device() {
    return jQuery('body').hasClass('touch');
}

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Begin jQuery functions
(function ($) {

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    
    $(document).ready(function () {
        if ($('.products.loops-wrapper').length > 0) {
            $('body').addClass('woocommerce woocommerce-page');
        }
        var first_image = $('.images img').first().prop('src');
        $( 'body' ).on( 'woocommerce_update_variation_values', '.variations_form',function(e){
           
            if($('.swiper-wrapper').length>0){
                setTimeout(function(){
                    var $current = $('.swiper-wrapper img').first().prop('src');
                    if($current!==first_image){
                        first_image = $current;
                        $('.product-images-carousel img').first().data('zoom-image',first_image);
                        
                        $('.thumbnails img').first().prop('src',first_image);
                        if( $('.product-images-carousel').data('swiper') ) {
                            $('.product-images-carousel').data('swiper').slideTo(0,1000, false);
                        }
                    }
                },100);
            }
        } );

        // Variation zoom carousel fix for Additional Variation Images by WooCommerce
        if( typeof $.wc_additional_variation_images_frontend === 'object' ) {
            $( 'form.variations_form' ).on( 'wc_additional_variation_images_frontend_image_swap_callback', function( e, response ) {
                themifyProductCarousel( response.main_images );
            } );

            function themifyProductCarousel( response ) {
                var $images = $( response ).find( 'img' );
                if( $images.length ) {
                    var newCarousel = '<div class="swiper-container"><div class="swiper-wrapper"></div></div>',
                        $imgCarousel = '',
                        $thumbCarousel = '';

                    $( '.product-images-carousel, .product-thumbnails-carousel' ).remove();
                    $imgCarousel = $( newCarousel ).addClass( 'product-images-carousel' ).appendTo( '.woocommerce-product-gallery__wrapper' );
                    $thumbCarousel = $( newCarousel ).addClass( 'product-thumbnails-carousel' ).appendTo( '.woocommerce-product-gallery__wrapper' );

                    $images.each( function( i ) {
                        var $this = $( this ),
                            $imgCarouselItem = $( '<div data-zoom-image="' + $this.attr('data-large_image') + '" class="swiper-slide woocommerce-main-image woocommerce-product-gallery__image zoom post-image"></div>' );

                        if( i === 0 ) {
                            $imgCarouselItem.append( this.outerHTML );
                        } else {
                            $imgCarouselItem.append( '<div class="default_img" style="width:' + $this.attr('width') + 'px; " data-width="' + $this.attr('width') + '" data-height="' + $this.attr('height') + '" data-src="' + $this.attr('src') + '" data-title="' + $this.attr('title') + '" data-alt="' + $this.attr('alt') + '">' );
                        }

                        $imgCarousel.find( '.swiper-wrapper' ).append( $imgCarouselItem );
                        $thumbCarousel.find( '.swiper-wrapper' ).append( '<li class="zoom swiper-slide post-image">' + this.outerHTML + '</li>' )
                    } );

                    InitGallery();
                    themify_zoom_image();
                }
            }

        }

       


        /////////////////////////////////////////////
        // Check is_mobile
        /////////////////////////////////////////////
        $('body').addClass(is_touch_device() ? 'is_mobile' : 'is_desktop');
        if (is_touch_device()) {
            $('#cart-icon-count>a').click(function (e) {
                e.preventDefault();
            });
        }
        /////////////////////////////////////////////
        // Product slider
        /////////////////////////////////////////////
        function ThemifyProductSlider() {
            var direction = $('body').hasClass('rtl');
            $('.product-slider').not('.hovered').each(function (index) {
                var $slider = $(this).data('product-slider');
                if ($slider) {
                    var $this = $(this);
                    $this.addClass('hovered').on("mouseover touchstart", function (e) {
                        e.preventDefault();
                        var $product = $this.closest('.product'),
                                cl = 'slider-' + $product.data('product-id') + '-' + index,
                                product = $this.closest('.products'),
                                width = product.data('width'),
                                height = product.data('height'),
                                items = '<span class="themify_spinner"></span><div class="themify_swiper_container">';
                      
                        items += '<a href="javascript:void(0);" class="product-slider-arrow product-slider-prev"></a><a href="javascript:void(0);" class="product-slider-arrow product-slider-next"></a>';
                        items += '<div class="swiper-container swiper-container-big"><div class="swiper-wrapper"></div></div>';
                        items += '<div class="swiper-container swiper-container-thumbs"><div class="swiper-wrapper"></div></div></div>';
                        $this.addClass(cl).off('mouseover touchstart').append(items);

                        $.ajax({
                            url: woocommerce_params.ajax_url,
                            type: 'POST',
                            dataType: 'json',
                            data: {'action': 'themify_product_slider', 'slider': $slider, 'width': width, 'height': height},
                            beforeSend: function () {
                                $this.addClass('slider-loading');
                            },
                            success: function (result) {
                                if (result) {

                                    var top_items = '',
                                        thumb_items = '',
										url = $this.data('product-link')?$this.data('product-link'):false;
                                        big = $this.find('.swiper-container-big').children('.swiper-wrapper'),
                                            thumbs = $this.find('.swiper-container-thumbs').children('.swiper-wrapper');
				
                                    for (var i in result.big) {
                                        top_items += '<div  class="swiper-slide">';
										if(url){
											top_items+='<a href="'+url+'">';
										}
										top_items+='<img src="' + result.big[i] + '"/>';
										if(url){
											top_items+='</a>';
										}
										top_items+='</div>';
                                        thumb_items += '<div class="swiper-slide"><img src="' + result.thumbs[i] + '"/></div>';
                                    }
                                    big.html(top_items);
                                    thumbs.html(thumb_items);
                                    big.imagesLoaded(function () {
                                        var galleryThumbs = false,
                                                galleryTop = false;
                                        galleryTop = new Swiper($('.' + cl).find('.swiper-container-big'), {
                                            nextButton: $('.' + cl).find('.product-slider-next'),
                                            prevButton: $('.' + cl).find('.product-slider-prev'),
                                            loop: 1,
                                            autoplay: 2500,
                                            rtl: direction,
                                            normalizeSlideIndex: false,
                                            autoplayDisableOnInteraction: false,
                                            slidesPerView: 1,
                                            speed: 1500,
                                            zoom: 1,
                                            onSlideChangeStart: function (swiper) {
                                                if (galleryThumbs) {
                                                    galleryThumbs.slideTo(swiper.realIndex, swiper.speed, false);
                                                }
                                            },
                                            onInit: function (top_swiper) {
                                                galleryThumbs = new Swiper($('.' + cl).find('.swiper-container-thumbs'), {
                                                    slidesPerView: 'auto',
                                                    slideToClickedSlide: true,
                                                    normalizeSlideIndex: false,
                                                    virtualTranslate: true,
                                                    rtl: direction,
                                                    spaceBetween: 0,
                                                    onInit: function (swiper) {
                                                        $this.removeClass('slider-loading').addClass('slider-finish');
                                                    },
                                                    onClick: function (swiper, e) {
                                                        if (galleryTop) {
                                                            var index = $('.' + cl).find('.swiper-slide[data-swiper-slide-index="' + swiper.realIndex + '"]').not('.swiper-slide-duplicate').index();
                                                            galleryTop.slideTo(index, galleryTop.speed, false);
                                                        }
                                                    }
                                                });
                                            }
                                        });

                                    });

                                }
                            }
                        });
                    });
                }
            });
        }
        var InitProductSlider = function () {
            if ($('.product-slider').not('.hovered').length > 0 && !$('body').hasClass('wishlist-page')) {
                if (!$.fn.swiper) {
                    Themify.LoadAsync(themifyScript.theme_url + '/js/swiper.jquery.min.js', ThemifyProductSlider,
                            null,
                            null,
                            function () {
                                return ('undefined' !== typeof $.fn.swiper);
                            });
                }
                else {
                    ThemifyProductSlider();
                }

            }
        };



        var InitGallery = function () {

            function ThemifySliderGallery() {
                $('.product-images-carousel:not(.themify_swiper_ready) ').imagesLoaded(function () {
                    var galleryTop = new Swiper('.product-images-carousel:not(.themify_swiper_ready)', {
                        onInit: function (swiper) {
                            $('.product-images-carousel').addClass('themify_swiper_ready').closest('.images').find('.themify_spinner').remove();
                        },
                        onSlideChangeStart: function (swiper) {
                            var top_el = $('.product-images-carousel').find('.swiper-slide-active'),
                                    img = top_el.children('div.default_img');
                            if (img.length > 0) {
                                img.replaceWith('<span class="themify_spinner"></span><img class="swiper_img_progress" src="' + img.data('src') + '" width="' + img.data('width') + '" height="' + img.data('height') + '" alt="' + img.data('alt') + '" title="' + img.data('title') + '" />').imagesLoaded(function () {
                                    top_el.children('img.swiper_img_progress').addClass('swiper_img_loaded').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                                        $(this).prev('.themify_spinner').remove();
                                    });
                                });
                            }

                        }
                    }),
                    galleryThumbs = new Swiper('.product-thumbnails-carousel:not(.themify_swiper_ready)', {
                        direction: "vertical",
                        slidesPerView: 'auto',
                        centeredSlides: true,
                        virtualTranslate: true,
                        slideToClickedSlide: true,
                        onInit: function (swiper) {
                            $('.product-thumbnails-carousel').addClass('themify_swiper_ready');
                        }
                    });

                    galleryTop.params.control = galleryThumbs;
                    galleryThumbs.params.control = galleryTop;
                });
            }
            ;
            if ($('.swiper-container .swiper-slide').length > 0) {
                if (!$.fn.swiper) {
                    Themify.LoadAsync(themifyScript.theme_url + '/js/swiper.jquery.min.js', ThemifySliderGallery,
                            null,
                            null,
                            function () {
                                return ('undefined' !== typeof $.fn.swiper);
                            });
                }
                else {
                    ThemifySliderGallery();
                }
            }
        }

        $(document).ajaxComplete(function (e, request, settings) {
            if ($('.product-slider').not('.hovered').length > 0) {
                InitProductSlider();
            }
        });
        InitGallery();
        InitProductSlider();

        if (typeof themifyShop.wishlist !== 'undefined') {
            Themify.LoadAsync(themifyScript.theme_url + '/js/themify.wishlist.js', null, null, null);
        }

        // Set Slide Cart Menu /////////////////////////
        $('#cart-link').themifySideMenu({
            panel: '#slide-cart',
            close: '#cart-icon-close'
        });

        //Remove brackets
        var product_category_count = $('.widget_product_categories .count');
        if (product_category_count.length > 0) {
            product_category_count.each(function () {
                $(this).text($(this).text().replace('(', '').replace(')', ''));
            });
        }


        $('body').on('wc_fragments_refreshed', function () {
            $('.is_mobile #cart-wrap').show();
        });

        /////////////////////////////////////////////
        // Add to cart ajax
        /////////////////////////////////////////////
        if (woocommerce_params.option_ajax_add_to_cart == 'yes') {

            // Ajax add to cart
            var $loadingIcon;
            $('body').on('adding_to_cart', function (e, $button, data) {
                add_to_cart_spark($button);
                var cart = $('#cart-wrap');
                // hide cart wrap
                cart.hide();
                // This loading icon
                $loadingIcon = $('.loading-product', $button.closest('.product')).first();
                $loadingIcon.show();
            }).on('added_to_cart removed_from_cart', function (e, fragments, cart_hash) {
                $('.is_mobile #cart-wrap').show();

                if (typeof $loadingIcon !== 'undefined') {
                    // Hides loading animation
                    $loadingIcon.hide(300, function () {
                        $(this).addClass('loading-done');
                    });
                    $loadingIcon
                            .fadeIn()
                            .delay(500)
                            .fadeOut(300, function () {
                                $(this).removeClass('loading-done');
                            });
                }

                // close lightbox
                if ($.fn.prettyPhoto && $('.pp_inline').is(':visible')) {
                    $.prettyPhoto.close();
                }
				if ($('.mfp-content.themify_product_ajax').is(':visible')) {
					$.magnificPopup.close();
				}
                $('form.cart').find(':submit').removeAttr('disabled');
            });

            // remove item ajax
            $(document).on('click', '.remove-item-js', function (e) {
                e.preventDefault();
                // AJAX add to cart request
                var $thisbutton = $(this),
                        data = {
                            action: 'theme_delete_cart',
                            remove_item: $thisbutton.attr('data-product-key')
                        };
                $thisbutton.addClass('themify_spinner');
                // Ajax action
                $.post(woocommerce_params.ajax_url, data, function (response) {

                    var this_page = window.location.toString();
                    this_page = this_page.replace('add-to-cart', 'added-to-cart');

                    fragments = response.fragments;
                    cart_hash = response.cart_hash;

                    // Block fragments class
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).addClass('updating');
                        });
                    }

                    // Block widgets and fragments
                    $('.shop_table.cart, .updating, .cart_totals, .widget_shopping_cart').fadeTo('400', '0.6').block({message: null, overlayCSS: {background: 'transparent url(' + woocommerce_params.ajax_loader_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6}});

                    // Changes button classes
                    if ($thisbutton.parent().find('.added_to_cart').size() == 0)
                        $thisbutton.addClass('added');

                    // Replace fragments
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    }

                    // Unblock
                    $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();

                    // Cart page elements
                    $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function () {

                        $('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)').addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

                        $('.shop_table.cart').stop(true).css('opacity', '1').unblock();

                        $('body').trigger('cart_page_refreshed');
                    });

                    $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function () {
                        $('.cart_totals').stop(true).css('opacity', '1').unblock();
                    });

                    // Trigger event so themes can refresh other areas
                    $('body').trigger('removed_from_cart', [fragments, cart_hash]);
                    $thisbutton.removeClass('themify_spinner');
                    if($('#cart-icon-count').hasClass('cart_empty')){
                            $body.addClass('wc-cart-empty');
                    }
                });
            });

            // Ajax add to cart in single page
            ajax_add_to_cart_single_page();

        }

        function add_to_cart_spark(item) {
            if (typeof clickSpark !== 'undefined') {
                clickSpark.setParticleText("\ue60d");
                clickSpark.setParticleColor(window.sparkling_color);
                clickSpark.setParticleDuration(300);
                clickSpark.setParticleCount(15);
                clickSpark.setParticleSpeed(8);
                clickSpark.setAnimationType('splash');
                clickSpark.setParticleRotationSpeed(0);
                clickSpark.fireParticles(item);
            }
        }
        // reply review
        $('.reply-review').click(function () {
            $('#respond').slideToggle('slow');
            return false;
        });

        // add review
        $('.add-reply-js').click(function () {
            $(this).hide();
            $('#respond').slideDown('slow');
            $('#cancel-comment-reply-link').show();
            return false;
        });
        $('#reviews #cancel-comment-reply-link').click(function () {
            $(this).hide();
            $('#respond').slideUp();
            $('.add-reply-js').show();
            return false;
        });

        /*function ajax add to cart in single page */
        function ajax_add_to_cart_single_page() {
            var submitClicked = false;
            $(document).on('click', '.single_add_to_cart_button', function (event) {
                if (!$(this).closest('.product').hasClass('product-type-external')) {
                    event.preventDefault();
                    submitClicked = true;
                    $('form.cart').submit();
                }


            }).on('submit', 'form.cart', function (event) {
                if (submitClicked) {
                    // This loading icon
                    var $loadingIcon = $(this).closest('.product').find('.loading-product').first();
                    $loadingIcon.show();

                    var data = $(this).serializeObject(),
						data2 = {action: 'theme_add_to_cart'};
					if($(this).find('input[name="add-to-cart"]').length===0){
						data2['add-to-cart'] = $(this).find('[name="add-to-cart"]').val();
					}
                    $.extend(true, data, data2);

                    // Trigger event
                    $('body').trigger('adding_to_cart', [$(this), data]);

                    // Ajax action
                    $.post(woocommerce_params.ajax_url, data, function (response) {

                        submitClicked = false;

                        if (!response)
                            return;
                        if (themifyShop.redirect) {
                            window.location.href = themifyShop.redirect;
                        }
                        var this_page = window.location.toString();
                        this_page = this_page.replace('add-to-cart', 'added-to-cart');

                        fragments = response.fragments;
                        cart_hash = response.cart_hash;

                        // Block fragments class
                        if (fragments) {
                            $.each(fragments, function (key, value) {
                                $(key).addClass('updating');
                            });
                        }

                        // Block widgets and fragments
                        $('.shop_table.cart, .updating, .cart_totals, .widget_shopping_cart').fadeTo('400', '0.6').block({message: null, overlayCSS: {background: 'transparent url(' + woocommerce_params.ajax_loader_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6}});

                        // Replace fragments
                        if (fragments) {
                            $.each(fragments, function (key, value) {
                                $(key).replaceWith(value);
                            });
                        }

                        // Unblock
                        $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();

                        // Cart page elements
                        $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function () {

                            $("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

                            $('.shop_table.cart').stop(true).css('opacity', '1').unblock();

                            $('body').trigger('cart_page_refreshed');
                        });

                        $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function () {
                            $('.cart_totals').stop(true).css('opacity', '1').unblock();
                        });

                        // Trigger event so themes can refresh other areas
                        $('body').trigger('added_to_cart', [fragments, cart_hash]);

                    });
                    return false;
                }
            });
        }

        /**
         * Limit the number entered in the quantity field.
         * @param $obj The quantity field object.
         * @param max_qty The max quantity allowed per the inventory current stock.
         */
        function limitQuantityByInventory($obj, max_qty) {
            var qty = $obj.val();
            if (qty > max_qty) {
                $obj.val(max_qty);
            }
        }

        function lightboxCallback(context) {
            $("a.variable-link", context).each(function () {
                $(this).magnificPopup({
                    type: 'ajax',
                    callbacks: {
                        updateStatus: function (data) {
                            $('.mfp-content').addClass('themify_product_ajax themify_variable_product_ajax');
                            ajax_variation_callback();
                        }
                    }
                });
            });
        }
        function ajax_variation_lightbox(context) {
            if ($("a.variable-link", context).length > 0) {
                Themify.LoadCss(themify_vars.url + '/css/lightbox.css', null);
                Themify.LoadAsync(themify_vars.url + '/js/lightbox.min.js', function () {
                    lightboxCallback(context)
                    return ('undefined' !== typeof $.fn.magnificPopup);
                });
            }
        }

		if ( themifyScript.variableLightbox ) {
            ajax_variation_lightbox(document);
            // Ajax variation lightbox for infinite scroll items
            $(document).on('newElements', function () {
                ajax_variation_lightbox($('.infscr_newElements'));
            });
        }
		
        /////////////////////////////////////////////
        // Themibox - Themify Lightbox
        /////////////////////////////////////////////
        var $body = $('body');
        /* Initialize Themibox */
        if ($('.quick-look').length > 0) {
            if ('undefined' === typeof Themibox) {
                Themify.LoadAsync(themifyScript.theme_url + '/js/themibox.js', function () {
                    Themibox.init();
                },
                        null,
                        null,
                        function () {
                            return ('undefined' !== typeof Themibox);
                        });
            }
            else {
                Themibox.init();
            }
        }
        /* Initialize variations when Themibox is loaded */
        $body.on('themiboxloaded', function (e) {
            ajax_variation_callback();
            // Limit number entered manually in quantity field in single view
            if ($body.hasClass('single-product') || $body.hasClass('post-lightbox')) {
                $('.entry-summary').on('keyup', 'input[name="quantity"][max]', function () {
                    limitQuantityByInventory($('input[name="quantity"]'), parseInt($(this).attr('max'), 10));
                });
            }

            if ($.fn.prettyPhoto) {
                // Run WooCommerce PrettyPhoto after Themibox is loaded
                $(".thumbnails a[data-rel^='prettyPhoto']").prettyPhoto({
                    hook: 'data-rel',
                    social_tools: false,
                    theme: 'pp_woocommerce',
                    horizontal_padding: 20,
                    opacity: 0.8,
                    deeplinking: false
                });
            }
            else {
                InitGallery();
            }
            themify_zoom_image();
        });

        $body.on('themiboxclosed themiboxcanceled', function (e) {
            $('#post-lightbox-wrap').removeClass('lightbox-message');
            themify_remove_image_zoom();
        });
        $('.thumbnails a').click(function () {
            $('.product_zoom.zoomed').trigger('click');
        });

        var $lightboxAdded;

        $body.on('added_to_cart', function (e) {
            var $postLightboxContainer = $('#post-lightbox-container');

            if ($('.lightbox-added').length > 0) {
                $lightboxAdded = $('.lightbox-added');
            }

            $('#post-lightbox-wrap').addClass('lightbox-message');
            $postLightboxContainer.slideUp(400, function () {
                var $self = $(this);
                $self.empty();
                $lightboxAdded.appendTo($self).show();
                $self.slideDown();
                themify_remove_image_zoom();
            });

            $body.one('click', $( '.close-themibox', $lightboxAdded ), function (e) {
                Themibox.closeLightBox(e);
            });

            $('.added_to_cart:not(.button)').addClass('button');
            if ($postLightboxContainer.find('#pagewrap').length === 0) {
                if ($('#slide-cart').length > 0) {
                    $('#slide-cart').removeClass('sidemenu-off').addClass('sidemenu-on');
                    setTimeout(function () {
                        $('#slide-cart').removeClass('sidemenu-on').addClass('sidemenu-off')
                    }, 1000);
                }
                else {
                    $('#cart-icon-count').addClass('show_cart');
                    setTimeout(function () {
                        $('#cart-icon-count').removeClass('show_cart');
                    }, 1000);
                }
            }
			$body.removeClass('wc-cart-empty');
        });

        // Routines for single product
        if ($body.hasClass('single-product')) {
            // Limit number entered manually in quantity field in single view
            $('.entry-summary').on('keyup', 'input[name="quantity"][max]', function () {
                limitQuantityByInventory($('input[name="quantity"]'), parseInt($(this).attr('max'), 10));
            });

            // Add +/- plus/minus buttons to quantity input in single view
            $("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

            themify_zoom_image();
        }

        $(document).on('click', '.plus, .minus', function () {

            // Get values
            var $qty = $(this).closest('.quantity').find('.qty'),
                    currentVal = parseFloat($qty.val()),
                    max = parseFloat($qty.prop('max')),
                    min = parseFloat($qty.prop('min')),
                    step = parseFloat($qty.prop('step'));

            // Format values
            if (!currentVal) {
                currentVal = 1;
            }
            if (!max) {
                max = false;
            }
            if (!min) {
                min = false;
            }
            if (!step) {
                step = 1;
            }
            // Change the value
            if ($(this).hasClass('plus')) {
                currentVal = max && currentVal >= max ? max : currentVal + step;
            } else {
                currentVal = min && currentVal <= min ? min : (currentVal > step ? currentVal - step : currentVal);
            }
            // Trigger change event
            $qty.val(currentVal).trigger('change');
        });

        $(document).on('keyup', 'form.cart input[name="quantity"]', function () {
            var $max = parseFloat($(this).prop('max'));
            if ($max > 0) {
                limitQuantityByInventory($(this), parseInt($max, 10));
            }
        });


        function themify_remove_image_zoom() {
            if ($.fn.zoom) {
                $('.woocommerce-main-image.zoom img').trigger('zoom.destroy');
            }
        }

        function themify_zoom_init( el, url ) {
            var productZoom = el.find( '.product_zoom' );

            if( url === undefined ) {
                url = el.data('zoom-image');
            }

            if( ! productZoom.length ) {
                productZoom = $('<span class="product_zoom"></span>').prependTo( el );
            }

            productZoom.one('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                el.addClass('zoom_progress');
                var $zoom = $(this);
                $zoom.after('<span class="themify_spinner"></span>');
                el.prop('href','javascript:void(0)');
                el.zoom({
                    on: 'click',
                    url: url,
                    callback: function () {
                        $zoom.next('.themify_spinner').remove();
                        el.removeClass('zoom_progress').trigger('click.zoom');
                        $(this).css({'top':-($(this).height()/2)+120,'left':-($(this).width()/2)+120});
                    },
                    onZoomIn: function () {
                        $zoom.addClass('zoomed')
                    },
                    onZoomOut: function () {
                        $zoom.removeClass('zoomed');
                    }
                }).trigger('click.zoom');
            });
        }

        function themify_zoom_image() {

            function themify_zoom_image_callback() {
                var $link = $('.woocommerce-main-image.zoom');
                $link.each(function () {
                    var $this = $(this);
                    themify_zoom_init( $this );
                });
            }
            if (!$.fn.zoom) {
                Themify.LoadAsync(themifyShop.theme_url + '/js/jquery.zoom.min.js', themify_zoom_image_callback, themifyShop.version, null, function () {
                    return ('undefined' !== typeof $.fn.zoom);
                });
            }
            else {
                themify_zoom_image_callback();
            }

        }


        /* function ajax variation callback */
        function ajax_variation_callback() {
            var themify_product_variations = $('.variations_form.cart').data( 'product_variations' );

            $( '.product-lightbox .variations_form' ).wc_variation_form();

            //check if two arrays of attributes match
            function variations_match(attrs1, attrs2) {
                var match = true;
                for (name in attrs1) {
                    var val1 = attrs1[name];
                    var val2 = attrs2[name];

                    if (val1.length != 0 && val2.length != 0 && val1 != val2) {
                        match = false;
                    }
                }
                return match;
            }

            //show single variation details (price, stock, image)
            function show_variation(variation) {
                var img = $('div.images img:eq(0)');
                var link = $('div.images a.zoom:eq(0)');
                var o_src = $(img).attr('original-src');
                var o_link = $(link).attr('original-href');

                var variation_image = variation.image_src;
                var variation_link = variation.image_link;

                if (true == variation.is_in_stock) {
                    $('.variations_button').show();
                } else {
                    $('.variations_button').hide();
                }
                $('.single_variation').html(variation.price_html + variation.availability_html);

                if (variation.sku) {
                    $('.product_meta').find('.sku').text(variation.sku);
                } else {
                    $('.product_meta').find('.sku').text('');
                }
                $('.single_variation_wrap').slideDown('200').trigger('variationWrapShown').trigger('show_variation');
            }

            //disable option fields that are unavaiable for current set of attributes
            function update_variation_values(variations) {

                // Loop through selects and disable/enable options based on selections
                $('.variations select').each(function (index, el) {

                    current_attr_select = $(el);

                    // Disable all
                    current_attr_select.find('option:gt(0)').attr('disabled', 'disabled');

                    // Get name
                    var current_attr_name = current_attr_select.attr('name');

                    // Loop through variations
                    for (num in variations) {
                        var attributes = variations[num].attributes;

                        for (attr_name in attributes) {
                            var attr_val = attributes[attr_name];

                            if (attr_name == current_attr_name) {
                                if (attr_val) {

                                    // Decode entities
                                    attr_val = $("<div/>").html(attr_val).text();

                                    // Add slashes
                                    attr_val = attr_val.replace(/'/g, "\\'");
                                    attr_val = attr_val.replace(/"/g, "\\\"");

                                    // Compare the meercat
                                    current_attr_select.find('option[value="' + attr_val + '"]').removeAttr('disabled');

                                } else {
                                    current_attr_select.find('option').removeAttr('disabled');
                                }
                            }
                        }
                    }
                });
            }

            //search for matching variations for given set of attributes
            function find_matching_variations(settings) {
                var matching = [];

                for (var i = 0; i < themify_product_variations.length; i++) {
                    var variation = themify_product_variations[i];
                    if (variations_match(variation.attributes, settings)) {
                        matching.push(variation);
                    }
                }
                return matching;
            }

            //when one of attributes is changed - check everything to show only valid options
            function check_variations(exclude) {
                var all_set = true;
                var current_settings = {};

                $('.variations select').each(function () {

                    if (exclude && $(this).attr('name') == exclude) {

                        all_set = false;
                        current_settings[$(this).attr('name')] = '';

                    } else {
                        if ($(this).val().length == 0)
                            all_set = false;

                        // Add to settings array
                        current_settings[$(this).attr('name')] = $(this).val();
                    }

                });

                var matching_variations = find_matching_variations(current_settings);

                if (all_set) {
                    var variation = matching_variations.pop();
                    if (variation) {
                        $('form input[name="variation_id"]').val(variation.variation_id);
                        show_variation(variation);
                    } else {
                        // Nothing found - reset fields
                        $('.variations select').val('');
                    }
                } else {
                    update_variation_values(matching_variations);
                }
            }

            $('body').off('change', '.variations select');

            $('body').on('change', '.variations select', function (e) {
                $('form input[name="variation_id"]').val('');
                $('.single_variation_wrap').hide();
                $('.single_variation').text('');
                check_variations();
                $(this).blur();
                if ($().uniform && $.isFunction($.uniform.update)) {
                    $.uniform.update();
                }
            });

            $('.variations select').change();

            $("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

        }

        /* Variation fix */
        ( function() {
            var variationImage = $( '.images .woocommerce-main-image.zoom' ).eq(0),
                zoomImage, originalImage;

            $( 'body' ).on( 'found_variation', '.variations_form', function (e, v) {
                if( ! variationImage.length ) {
                    variationImage = $( '.images .woocommerce-main-image.zoom' ).eq(0);
                }

                zoomImage = variationImage.find( '.zoomImg' );

                if( ! originalImage ) {
                    originalImage = variationImage.data( 'zoom-image' );
                }

                if( typeof v.image.full_src === 'string' ) {
                    variationImage.attr( 'data-zoom-image', v.image.full_src );

                    if( zoomImage.length ) {
                        zoomImage.remove();
                    }

                    variationImage.find( '.product_zoom' ).remove();
                    themify_zoom_init( variationImage, v.image.full_src );
                }
            } ).on( 'hide_variation', function() {
                zoomImage = variationImage.find( '.zoomImg' );

                if( originalImage ) {
                    zoomImage.remove();
                    themify_zoom_init( variationImage, originalImage );
                    originalImage = '';
                }
            } );
        } )();
    });

}(jQuery));
