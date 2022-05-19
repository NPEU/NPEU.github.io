/*!
    Fall-Back Patterns - Base JS
    https://github.com/Fall-Back/Patterns/tree/master/
    Copyright (c) 2022, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/

// Utilties and Polyfills common to Fall-Back Patterns.
// Creates a single global var called $flbk.
// Must be in the markup AFTER the main stylesheet

// POLYFILLS
// Remove polyfill:
(function() {
    function remove() { this.parentNode && this.parentNode.removeChild(this); }
    if (!Element.prototype.remove) Element.prototype.remove = remove;
    if (Text && !Text.prototype.remove) Text.prototype.remove = remove;
})();


var $flbk = {};


// SETTINGS AND UTILITIES
(function($flbk) {
    $flbk.s = {};
    $flbk.u = {};


    $flbk.u.css_has_rule = function(selector) {

        if ($flbk.s.debug) {
            console.log('Checking for CSS rule:', selector);
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

        if ($flbk.s.debug) {
            console.log(selector + ' ' + (haveRule ? '' : 'not') + ' found');
        }

        return haveRule;
    };


    $flbk.u.css_rule_applied = function(selector, property, value) {
        var el = document.querySelector(selector);
        var style = window.getComputedStyle(el);
        if (property in style) {
            if (style[property] == value) {
                return true;
            }
        }
        return false;
    };
    
    
    $flbk.u.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    
    
    $flbk.u.ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };
    
    
    $flbk.u.set_style = function(element, style) {
        Object.keys(style).forEach(function(key) {
            var val = style[key];
            if (val.indexOf(' !important' ) !== -1) {
                val = val.replace(' !important', '');
                element.style.setProperty(key, val, 'important');
            } else {
                element.style.setProperty(key, val);
            }
        });
    }

    
    

    $flbk.s.debug = true;
    //$flbk.s.debug = false;

    $flbk.s.main_stylesheet_id = 'main_stylesheet';
    $flbk.s.support_ie11 = true;
    $flbk.s.ie11 = $flbk.s.support_ie11 && (!!window.MSInputMethodContext && !!document.documentMode);
    $flbk.s.media_to_match   = false;
    $flbk.s.media_is_matched = false;
    $flbk.s.general_css_check_selector = "#css_has_loaded";
    $flbk.s.general_css_check_property = "visibility";
    $flbk.s.general_css_check_value    = "hidden";
    $flbk.s.general_css_is_loaded = false;
    $flbk.s.general_css_is_present = false;

    var main_stylesheet_el = document.getElementById($flbk.s.main_stylesheet_id);
    if ($flbk.s.debug) {
        console.log('main_stylesheet_el:', main_stylesheet_el);
    }

    if (main_stylesheet_el) {
        $flbk.s.media_to_match = main_stylesheet_el.media;
        var mq = window.matchMedia($flbk.s.media_to_match);
        if ($flbk.s.debug) {
            console.log('mq:', mq.matches);
        }
        $flbk.s.media_is_matched = mq.matches;
    }


    $flbk.s.general_css_is_loaded = $flbk.u.css_has_rule($flbk.s.general_css_check_selector);
    if ($flbk.s.debug) {
        console.log('general_css_is_loaded:', $flbk.s.general_css_is_loaded);
    }

    $flbk.s.general_css_is_present = $flbk.s.general_css_is_loaded && ($flbk.s.media_is_matched || $flbk.s.ie11);

    if ($flbk.s.debug) {
        console.log('general_css_is_present:', $flbk.s.general_css_is_present);
    }

})($flbk);