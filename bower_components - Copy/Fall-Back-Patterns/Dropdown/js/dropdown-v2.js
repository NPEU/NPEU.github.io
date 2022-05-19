/*! --------------------------------------------------------------------------------------------- *\
    
    Fall-Back Dropdown v2.0.0
    https://github.com/Fall-Back/Patterns/tree/master/Dropdown
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl

    Designed for use with the EM2 [CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut)
    Edge, Chrome 39+, Opera 26+, Safari 9+, iOS 9+, Android ~5+, Android UCBrowser ~11.8+
    FF 47+

    PLUS IE11

\* ---------------------------------------------------------------------------------------------- */

(function() {

    //var debug                 = true;
    var debug                 = false;
    var ident                 = 'dropdown';
    var selector              = '[data-js="' + ident + '"]';

    var dropdown_js_has_classname = 'js-has--' + ident;
    
    var dropdown_is_open_classname      = ident + '__area--is-open';
    var dropdown_is_animating_classname = ident + '__area--is-animating';

    var check_for_css = function(selector) {

        if (debug) {
            console.log('Checking for CSS: ' + selector);
        }

        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") { // is this supported
            var cssSheets = document.styleSheets;

            // IE doesn't have document.location.origin, so fix that:
            if (!document.location.origin) {
                document.location.origin = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
            }
            var domain_regex  = RegExp('^' + document.location.origin);

            outerloop:
            for (var i = 0; i < cssSheets.length; i++) {
                var sheet = cssSheets[i];

                // Some browsers don't allow checking of rules if not on the same domain (CORS), so
                // checking for that here:
                if (sheet.href !== null && domain_regex.exec(sheet.href) === null) {
                    continue;
                }

                // Check for IE or standards:
                rules = (typeof sheet.cssRules != "undefined") ? sheet.cssRules : sheet.rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == selector) {
                        haveRule = true;
                        break outerloop;
                    }
                }
            }
        }

        if (debug) {
            console.log(selector + ' ' + (haveRule ? '' : 'not') + ' found');
        }

        return haveRule;
    }

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

	var dropdown = {

        init: function() {

            if (debug) {
                console.log('Initialising ' + ident);
            }

            if (css_is_loaded) {

                var dropdowns = document.querySelectorAll(selector);

                // ... and control actions:
                var controls = document.querySelectorAll('[data-js="dropdown__control"]');
                Array.prototype.forEach.call(controls, function(control, i) {
                    var control_id = control.getAttribute('id');
                    var area       = document.getElementById(control_id + '--target');

                    control.setAttribute('aria-expanded', 'false');

                    // Main control:
                    control.addEventListener('click', function() {

                        area.classList.add(dropdown_is_animating_classname);


                        // Switch the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open dropdown:
                        var expanded_controls = document.querySelectorAll('[data-js="dropdown__control"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_controls, function(expanded_control, i) {
                            expanded_control.setAttribute('aria-expanded', 'false');
                            var expanded_area = document.getElementById(expanded_control.getAttribute('id') + '--target');
                            expanded_area.classList.remove(dropdown_is_open_classname);
                        });

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);
                        
                        // Toggle the `is_open` class:
                        if (!expanded) {
                            area.classList.add(dropdown_is_open_classname);
                        } else {
                            area.classList.remove(dropdown_is_open_classname);
                        }

                        // Set the focus to the first link if submenu newly opened:
                        if (!expanded) {
                            var first_link = document.querySelector('#' + control_id + '--target [data-js="dropdown__focus-start"]');
                            if (first_link) {
                                first_link.focus();
                            }
                        }
                    });

                    // Remove `animating` class at transition end.
                    area.addEventListener('transitionend', function() {
                        area.classList.remove(dropdown_is_animating_classname);
                    });

                });

            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled Dropdown:
    var css_is_loaded = check_for_css('.' + dropdown_js_has_classname);

    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        html_el.classList.add(dropdown_js_has_classname);
    }

	ready(dropdown.init);
})();
