/*! --------------------------------------------------------------------------------------------- *\
    
    Fall-Back Over Panel v3.0.0
    https://github.com/Fall-Back/Patterns/tree/master/Over%20Panel
    Copyright (c) 2022, Andy Kirk
    Released under the MIT license https://git.io/vwTVl

    Designed for use with the [PRM CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut#prm-cut-prefers-reduced-motion)
    
    Print (Edge doesn't apply to print otherwise)
    Edge 79+, Chrome 74+, Firefox 63+, Opera 64+, Safari 10.1+, iOS 10.3+, Android 81+  

    PLUS IE11

\* ---------------------------------------------------------------------------------------------- */

(function() {

    //var debug             = true;
    var debug             = false;
    var ident             = 'over-panel';
    var selector          = '[data-js="' + ident + '"]';
    var overlay_selector  = '[data-js="' + ident + '__overlay"]';
    var control_selector  = '[data-js="' + ident + '__control"]';
    var contents_selector = '[data-js="' + ident + '__contents"]';

    var over_panel_js_has_classname       = 'js-has--' + ident;
    //var over_panel_js_classname           = 'js-' + ident;
    //var over_panel_control_js_classname   = 'js-' + ident + '-control';
    var over_panel_is_open_classname      = ident + '--is-open';
    var over_panel_is_animating_classname = ident + '--is-animating';

	var $over_panel = {

        init: function() {

            if (debug) {
                console.log('Initialising ' + ident);
            }

            if (css_has_rule) {

                var over_panels = document.querySelectorAll(selector);

                Array.prototype.forEach.call(over_panels, function(over_panel, i) {

                    // Find corresponding controls:
                    var over_panel_id = over_panel.getAttribute('id');
                    var over_panel_control = document.querySelector('[aria-controls="' + over_panel_id + '"]');
                    var over_panel_overlay = over_panel.querySelector(overlay_selector);

                    // Check we've got a corresponding control. If not we can't proceed so skip:
                    if (!over_panel_control) {
                        return;
                    }

                    // Main toggle button:
                    over_panel_control.addEventListener('click', function() {

                        over_panel.classList.add(over_panel_is_animating_classname);

                        // Invert the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open panels:
                        var expanded_buttons = document.querySelectorAll(control_selector + '[aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            //expanded_button.setAttribute('aria-expanded', 'false');
                            expanded_button.click();
                        });

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Toggle the `is_open` class:
                        if (!expanded) {
                            over_panel.classList.add(over_panel_is_open_classname);
                        } else {
                            over_panel.classList.remove(over_panel_is_open_classname);
                        }
                    });

					// Overlay click action:
					over_panel_overlay.addEventListener('click', function() {
						over_panel_control.click()
					});

                    // Remove `animating` class at transition end.
                    over_panel.addEventListener('transitionend', function() {
                        over_panel.classList.remove(over_panel_is_animating_classname);
                    });

                    // Focus trap inspired by:
					// http://heydonworks.com/practical_aria_examples/progressive-hamburger.html
                    var over_panel_contents = over_panel.querySelector(contents_selector);
                    var focusables          = over_panel_contents.querySelectorAll('a, button, input, select, textarea');

                    if (focusables.length > 0) {
                        var first_focusable     = focusables[0];
                        var last_focusable      = focusables[focusables.length - 1];

                        // At end of navigation block, return focus to navigation menu button
                        last_focusable.addEventListener('keydown', function(e) {
                            if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && !e.shiftKey) {
                                e.preventDefault();
                                over_panel_control.focus();
                            }
                        });

                        // At start of navigation block, refocus close button on SHIFT+TAB
                        over_panel_control.addEventListener('keydown', function(e) {
                            if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && e.shiftKey) {
                                e.preventDefault();
                                last_focusable.focus();
                            }
                        });
                    }
                });
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled OverPanel:
    //var css_is_loaded = check_for_css('.' + over_panel_js_has_classname);
    var css_has_rule = $flbk.u.css_has_rule('.' + over_panel_js_has_classname);

    if (css_has_rule) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        html_el.classList.add(over_panel_js_has_classname);
    }

    $flbk.u.ready($over_panel.init);
})();
