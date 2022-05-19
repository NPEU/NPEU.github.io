/*!
    Fall-Back Content Min-row v1.0.1
    https://github.com/Fall-Back/Patterns/tree/master/Content%20Min%20Row
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/

// Remove polyfill:
(function() {
  function remove() { this.parentNode && this.parentNode.removeChild(this); }
  if (!Element.prototype.remove) Element.prototype.remove = remove;
  if (Text && !Text.prototype.remove) Text.prototype.remove = remove;
})();

(function() {

    //var debug                                = true;
    var debug                                = false;
    var ident                                = 'cmr';
    var css_check_selector                   = "#css_has_loaded";
    var selector                             = '[data-js="' + ident + '"]';
    var js_classname_prefix                  = 'js';
    var container_js_classname_wide_suffix   = 'wide';
    var container_js_classname_narrow_suffix = 'narrow';
    var detector_n                           = 0;

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    var debounce = function(func, wait, immediate) {
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

    var set_style = function(element, style) {
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

    var $cmr = {

        cmrs: null,

        root_font_size: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),

        switcher: function(cmr) {

            // Check for browser font change and reset breakpoints if it has:
            // (Note IE11 does some REALLY strange things with the font size - there's a slight
            // difference in the output depending on whether the page is refreshed or reloaded!
            var cached_font_size   = Math.ceil(parseFloat($cmr.root_font_size));
            var document_font_size = Math.ceil(parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('font-size')));

            if (debug) {
                console.log($cmr.root_font_size, window.getComputedStyle(document.documentElement).getPropertyValue('font-size'));
                console.log(cached_font_size, document_font_size);
            }

            if (cached_font_size != document_font_size) {
                $cmr.root_font_size = document_font_size;
                $cmr.set_breakpoints($cmr.cmrs);
                window.setTimeout(function(){
                    $cmr.do_switch(cmr);
                }, 250);
            } else {
                $cmr.do_switch(cmr);
            }
        },

        do_switch: function(cmr) {
            // Note using getAttribute('data-') instead of dataset so it doesn't fail on older
            // browsers and leave behind the clone.
            // May rethink this as I don't NEED to support older browsers with this - I just don't
            // want it broken. Maybe I should quit out of this if dataset isn't supported, but it's
            // ok for now.
            var wide = cmr.offsetWidth > cmr.getAttribute('data-js-breakpoint');
            // Need to make these classnames dynamic
            if (wide) {
                cmr.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + ident + '--' + container_js_classname_narrow_suffix);

                if (debug) {
                    cmr.style.outline = '3px solid red';
                }
            } else {
                cmr.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_narrow_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);

                if (debug) {
                    cmr.style.outline = '3px solid blue';
                }
            }
        },

        set_breakpoints: function(cmrs) {

            Array.prototype.forEach.call(cmrs, function (cmr, i) {
                //set_style(cmr, {'position': 'relative'});
                var clone = cmr.cloneNode(true);
                clone.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);

                set_style(clone, {
                    'border': '0',
                    'left': '0',
                    'top': '0',
                    'width': 'max-content',
                    'flex-wrap': 'nowrap',
                    'justify-content': 'flex-start',
                    'max-width': 'none'
                });

                cmr.parentNode.appendChild(clone);

                var children   = clone.children;
                var n_children = children.length;
                var breakpoint = 0;

                // Set widths for flexible children:
                Array.prototype.forEach.call(children, function (child, i) {
                    //console.log(child);
                    if (child.getAttribute('data-min-width')) {
                        var w = parseInt(child.getAttribute('data-min-width'));
                        var pLeft  = parseInt(getComputedStyle(child).paddingLeft);
                        var pRight = parseInt(getComputedStyle(child).paddingRight);
                        //console.log(w, pLeft, pRight);
                        set_style(child, {
                            'width': (w + pLeft + pRight) + 'px !important',
                            'max-width': (w + pLeft + pRight) + 'px !important',
                            'min-width': (w + pLeft + pRight) + 'px !important'
                        })
                    }
                });

                // Handle IE separately:
                if (!!window.MSInputMethodContext && !!document.documentMode) {
                    var pLeft  = parseInt(getComputedStyle(clone).paddingLeft);
                    var pRight = parseInt(getComputedStyle(clone).paddingRight);
                    breakpoint += pLeft + pRight;
                    Array.prototype.forEach.call(children, function (child, i) {
                        breakpoint += Math.ceil(child.offsetWidth);
                    });
                    if (debug) {
                        console.log('breakpoint: ', breakpoint);
                    }
                    cmr.setAttribute('data-js-breakpoint', breakpoint);
                    clone.remove();
                } else {
                    if (debug) {
                        console.log('breakpoint: ', clone.offsetWidth);
                    }
                    cmr.setAttribute('data-js-breakpoint', clone.offsetWidth);
                    clone.remove();
                }
            });
        },

        init: function() {

            var css_is_loaded = check_for_css(css_check_selector);

            if (debug) {
                console.log('css_is_loaded:', css_is_loaded);
            }

            if (!css_is_loaded) {
                return false;
            }

            if (debug) {
                console.log('Initialising ' + ident);
            }

            var self = this;

            // Get all the CMR's:
            $cmr.cmrs = document.querySelectorAll(selector);

            $cmr.set_breakpoints($cmr.cmrs);

            var check = window.ResizeObserver;

            if (check) {
                var ro = new ResizeObserver(function (entries) {
                    Array.prototype.forEach.call(entries, function (entry, i) {
                        $cmr.switcher(entry.target);
                    });
                });

                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {
                    ro.observe(cmr);
                    $cmr.switcher(cmr);
                });
            } else {
                if (debug) {
                    console.log('No ResizeObserver support.');
                }

                var style = {
                    'position': 'absolute',
                    'display': 'block',
                    'border': '0',
                    'width': '100%',
                    'height': '100%',
                    'pointerEvents': 'none',
                    'z-index': '-1'
                };

                // Note visibility: hidden prevents the resize event from occurring in FF.
                // Also note that putting the detector iframe in a flex container causes problems
                // for IE11 (it continues to take up space) - so we need to look for a safe non-flex
                // container for it to use, so specify this in the markup as n parent levels above
                // the CMR element.

                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {

                    var detector = document.createElement('iframe');
                    detector.id = 'detector-' + (++detector_n);
                    cmr.detector_id = detector.id;

                    set_style(detector, style);
                    detector.setAttribute('aria-hidden', 'true');

                    var n = cmr.getAttribute('data-ie-safe-parent-level');
                    var safe_parent = cmr;
                    if (n) {
                        while (n-- > 0) {
                            safe_parent = safe_parent.parentNode;
                            if (!safe_parent) {
                                // to avoid a possible "TypeError: Cannot read property 'parentNode' of null" if the requested level is higher than document
                                break;
                            }
                        }
                        set_style(safe_parent, {'position': 'relative'});
                        safe_parent.appendChild(detector);
                    } else {
                        set_style(cmr, {'position': 'relative'});
                        cmr.appendChild(detector);
                    }

                    detector.contentWindow.addEventListener('resize', function() {
                        if (debug) {
                            console.log('Reszing ' + detector.id + ' (1)');
                        }
                        $cmr.switcher(cmr);
                    });
                    $cmr.switcher(cmr);

                });
            }
            return;
        }
    }

    window.setTimeout(function(){ready($cmr.init)}, 50);
})();