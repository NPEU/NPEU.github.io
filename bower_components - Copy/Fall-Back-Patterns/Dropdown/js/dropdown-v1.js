/*! --------------------------------------------------------------------------------------------- *\
    
    Fall-Back Dropdown v2.0.0
    https://github.com/Fall-Back/Patterns/tree/master/Dropdown
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl

    Designed for use with the basic [CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut)
    IE 9+, FF 8+, Opera 12, Chrome 29+, Android ~4.4+
    Chrome 29+, Opera 16+, Safari 6.1+, iOS 7+, Android ~4.4+

\* ---------------------------------------------------------------------------------------------- */

(function() {

    var dropdown_js_classname = 'js-dropdown';

    var check_for_css = function(selector) {

        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") {// is this supported
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
            var dropdowns = document.querySelectorAll('.dropdown');
            /*var dropdown_js_classname = 'js-dropdown';
            // Note that `getComputedStyle` on pseudo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the un-enhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(dropdown, ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );*/

            if (css_is_loaded) {
                Array.prototype.forEach.call(dropdowns, function(dropdown, i) {
                    // Add the JS class names ...
                    if (dropdown.classList) {
                        dropdown.classList.add(dropdown_js_classname);
                    } else {
                        dropdown.className += ' ' + dropdown_js_classname;
                    }
                });
                
                // ... and button actions:
                var buttons = document.querySelectorAll('[data-js="dropdown__button"]');
                Array.prototype.forEach.call(buttons, function(button, i) {
                    var button_id = button.getAttribute('id');

                    button.setAttribute('aria-expanded', 'false');

                    // Main button:
                    button.addEventListener('click', function() {
                        // Switch the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open dropdown:
                        var expanded_buttons = document.querySelectorAll('[data-js="dropdown__button"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            expanded_button.setAttribute('aria-expanded', 'false');
                        });
                        
                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Set the focus to the first link if submenu newly opened:
                        if (!expanded) {
                            var first_link = document.querySelector('#' + button_id + '--target [data-js="dropdown__focus-start"]');
                            if (first_link) {
                                first_link.focus();
                            }
                        }
                    });
                });
                
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled Dropdown:
    var css_is_loaded = check_for_css('.' + dropdown_js_classname);

    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        if (html_el.classList) {
            html_el.classList.add(dropdown_js_classname);
        } else {
            html_el.className += ' ' + dropdown_js_classname;
        }
    }

	ready(dropdown.init);
})();
