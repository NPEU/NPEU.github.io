/*
    Carousel enhancements
*/

(function() {

    var debug = true;
    //var debug = false;

    var ident = 'carousel';

    var carousel = function() {

        if ($flbk.s.debug) {
            console.log(ident + ' started');
        }

        // Get all elements we want to apply this to:
        var elements = document.querySelectorAll('.js-c-carousel');

        Array.prototype.forEach.call(elements, function(el, i) {

            el.classList.add('c-carousel--has-js');

            var nav_links = el.querySelectorAll('.c-hero-carousel__nav a');

            Array.prototype.forEach.call(nav_links, function(nl, i) {
                nl.addEventListener('click', function(e) {

                    if (debug) {
                        console.log('nav link clicked');
                    }

                    // Don't run this if we're not in full support mode:
                    var check = $flbk.u.css_rule_applied($flbk.s.general_css_check_selector, $flbk.s.general_css_check_property, $flbk.s.general_css_check_value);
                    if (!check) {
                        return true;
                    }

                    var x = window.pageXOffset,
                    y = window.pageYOffset,
                    done = false;

                    window.onscroll = function (e) {
                        if (!done) {
                            document.documentElement.scrollTop = document.body.scrollTop = y;
                            document.documentElement.scrollLeft = document.body.scrollLeft = x;
                            done = true;
                        }
                    }

                    return false;
                });
            });



        });
        
        window.addEventListener('hashchange', function() {
            // Add the 'current' class to the link, as this isn't possible in CSS alone:
            var links = document.querySelectorAll('.c-hero-carousel__nav a');
            Array.prototype.forEach.call(links, function(a, i){
                a.classList.remove('current');
            });
            
            var a = document.querySelector('a[href="' + window.location.hash + '"]');
            a.classList.add('current');
        }, false);
    };

    $flbk.u.ready(carousel);
})();
