/*! --------------------------------------------------------------------------------------------- *\
    
    Fall-Back Nav Bar v2.0.0
    https://github.com/Fall-Back/Patterns/tree/master/Nav%20Bar
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl

    Designed for use with the EM2 [CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut)
    Edge, Chrome 39+, Opera 26+, Safari 9+, iOS 9+, Android ~5+, Android UCBrowser ~11.8+
    FF 47+

    PLUS IE11

\* ---------------------------------------------------------------------------------------------- */

// Remove polyfill:
(function() { 
  function remove() { this.parentNode && this.parentNode.removeChild(this); }
  if (!Element.prototype.remove) Element.prototype.remove = remove;
  if (Text && !Text.prototype.remove) Text.prototype.remove = remove;
})();

(function() {

    var nav_bar_js_classname = 'js-nav-bar';
    var nav_bar_classname    = 'nav-bar';

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
    
    var set_style = function(element, style) {
        Object.keys(style).forEach(function(key) {
            element.style[key] = style[key];
        });
    }

	var $navbar = {
        
        navbars: null,
        
        root_font_size: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),

		switcher: function(navbar) {
            //console.log(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'));
			//console.log(navbar);
            
            // Check for browser font chnage and reset breakpoints if it has:
            if ($navbar.root_font_size != window.getComputedStyle(document.documentElement).getPropertyValue('font-size')) {
                $navbar.set_breakpoints($navbar.navbars);
            }
            
			var expanded = navbar.offsetWidth > navbar.dataset.breakpoint;
			
			if (expanded) {
				navbar.classList.add('js-nav-bar--expanded');
				navbar.classList.remove('js-nav-bar--collapsed');
				navbar.style.outline = '3px solid red';
			} else {
				navbar.classList.add('js-nav-bar--collapsed');
				navbar.classList.remove('js-nav-bar--expanded');
				navbar.style.outline = '3px solid blue';
			}
		},
        
        set_breakpoints: function(navbars) {
            Array.prototype.forEach.call(navbars, function (navbar, i) {
                var clone = navbar.cloneNode(true);
                clone.classList.add('js-nav-bar--expanded');
                set_style(clone, {
					position: 'absolute',
					border: '0',
					left: '0',
					top: '0',
				});
                navbar.parentNode.appendChild(clone);

                var nav_link = clone.querySelector('.nav-bar__link');

                //console.log(window.getComputedStyle(nav_link).getPropertyValue('font-size'));

                navbar_start_width = 0;
                navbar_main_width = 0;
                navbar_end_width = 0;

                var clone_navbar_start = clone.querySelector('.nav-bar__start');
                if (clone_navbar_start) {
                    var navbar_start_width = Math.ceil(clone_navbar_start.offsetWidth);
                }

                var clone_navbar_main = clone.querySelector('.nav-bar__main');
                if (clone_navbar_main) {
                    var navbar_main_width = Math.ceil(clone_navbar_main.offsetWidth);
                }

                // Note this will need special handling as it's designed to be a flexible
                // container (e.g. for a search input) so will need to discover min-width.
                var clone_navbar_end = clone.querySelector('.nav-bar__end');
                if (clone_navbar_end) {
                    var navbar_end_width = Math.ceil(clone_navbar_end.offsetWidth);
                }

                navbar.dataset.breakpoint = navbar_start_width
                                          + navbar_main_width
                                          + navbar_end_width;
                clone.remove();
            });
        },

        init: function() {
			var self = this;
            
            /*var nav_bar = document.querySelector('.nav-bar');

            // Note that `getComputedStyle` on pseudo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the un-enhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(nav_bar, ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );*/

            if (css_is_loaded) {
                // Add the JS class names ...
                /*if (nav_bar.classList) {
                    nav_bar.classList.add(nav_bar_js_classname);
                } else {
                    nav_bar.className += ' ' + nav_bar_js_classname;
                }*/

                $navbar.navbars = document.querySelectorAll('.' + nav_bar_js_classname + ' .' + nav_bar_classname);

				$navbar.set_breakpoints($navbar.navbars);

				//return;

				var check = window.ResizeObserver;
				//var check = false;

				if (check) {
                    var ro = new ResizeObserver(function (entries) {
                        Array.prototype.forEach.call(entries, function (entry, i) {
                            var cr = entry.contentRect;
                            var item_height = entry.target.querySelector('li').offsetHeight;
                            $navbar.switcher(entry.target, cr.height < item_height);
                        });
                    });

                    Array.prototype.forEach.call($navbar.navbars, function (navbar, i) {
                        ro.observe(navbar);
						$navbar.switcher(navbar);
                    });
                } else {
                    console.log('No ResizeObserver support.');

					var style = {
						position: 'absolute',
						display: 'block',
						border: '0',
						left: '0',
						top: '0',
						width: '100%',
						height: '100%',
						pointerEvents: 'none',
						zIndex: '-1'
                    };

					// Note visibility: hidden prevents the resize event from occuring in FF.

					Array.prototype.forEach.call($navbar.navbars, function (navbar, i) {
						var detector = document.createElement('iframe');
                        set_style(detector, style);
						detector.setAttribute('aria-hidden', 'true');

						navbar.appendChild(detector);

						detector.contentWindow.addEventListener('resize', function() {
							$navbar.switcher(navbar);
                        });
						$navbar.switcher(navbar);
					});
                }

				return;
			}
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled $navbar:
    var css_is_loaded = check_for_css('.' + nav_bar_js_classname);

    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        if (html_el.classList) {
            html_el.classList.add(nav_bar_js_classname);
        } else {
            html_el.className += ' ' + nav_bar_js_classname;
        }
    }

	ready($navbar.init);
})();
