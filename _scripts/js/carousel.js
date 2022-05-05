/*
    Carousel enhancements
    
    * Prevent page just when links activated.
    * Add 'current' class to links that match current hash.
    * Update hash if user scrolls rather than uses links.
    * Activate link that matches hash on page load so correct slide is visisble.
*/

(function() {

    //var debug = true;
    var debug = false;

    var ident = 'carousel';

    var carousel = function() {

        if ($flbk.s.debug) {
            console.log(ident + ' started');
        }

        // A list of carousel slide names for later checks:
        var slide_names = [];

        // Get all elements we want to apply this to:
        var elements = document.querySelectorAll('.js-c-carousel');

        Array.prototype.forEach.call(elements, function(el, i) {

            var slide_name = el.dataset.slideName;
            slide_names.push(slide_name);

            // We're good to proceed so tell CSS this by adding the 'has' class:
            el.classList.add('c-carousel--has-js');

            // On page load we need to make sure any :target-ed slide is scrolled into view and it's
            // corresponding link is marked as 'current':
            // @TODO look into adding aria-current for this. Note since this is designed to be
            // accessible from the start and presented as a list of linked sections, I'm not sure
            // there's value in adding aria-current, because ordinary hash/:target-ed sections don't
            //have this. It's not because I'm too lazy to add it.
            var a = document.querySelector('a[href="' + window.location.hash + '"]');
            if (a == null) {
                a = document.querySelector('a[href="#' + slide_name + '-1"]');
            }

            if (a) {
                // Create a sshort delay to make sure click is registered:
                window.setTimeout(function(){
                    a.classList.add('current');
                    a.click();
                }, 400);
            }

            var nav_links = el.querySelectorAll('.c-hero-carousel__nav a');

            Array.prototype.forEach.call(nav_links, function(nl, i) {
                nl.addEventListener('click', function(e) {

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

            // There are multiple ways the Carousel can be scrolled - mouse, keyboard etc.
            // In these scenarios the hash or current link isn't updated, so fix that here:
            // (from https://stackoverflow.com/questions/65952068/determine-if-a-snap-scroll-elements-snap-scrolling-event-is-complete)
            el.querySelector('.c-hero-carousel__scroll-area').addEventListener('scroll', function(e) {
                var atSnappingPoint = Math.ceil(e.target.scrollLeft) % e.target.offsetWidth === 0;
                var timeOut         = atSnappingPoint ? 0 : 150;

                clearTimeout(e.target.scrollTimeout);

                e.target.scrollTimeout = setTimeout(function() {
                    if (!timeOut) {
                        var x = window.pageXOffset,
                        y = window.pageYOffset;
                        window.location.hash = slide_name + '-' + (1 + Math.ceil(e.target.scrollLeft) / e.target.offsetWidth);
                        document.documentElement.scrollTop = document.body.scrollTop = y;
                        document.documentElement.scrollLeft = document.body.scrollLeft = x;

                    }
                }, timeOut);
            });

        });

        window.addEventListener('hashchange', function() {
            // Check the hash change actually pertains to a carousel:
            var hash = window.location.hash;
            var slide_name = hash.replace('#', '').replace(/-[0-9]+$/, '');

            if (slide_names.indexOf(slide_name) === -1) {
                return;
            }

            // Add the 'current' class to the link, as this isn't possible in CSS alone:
            var links = document.querySelectorAll('.c-hero-carousel__nav a');
            Array.prototype.forEach.call(links, function(a, i){
                a.classList.remove('current');
            });

            var a = document.querySelector('a[href="' + hash + '"]');
            if (a) {
                a.classList.add('current');
            }
        }, false);
    };

    // IE doesn't work well with these enhancements and I don't have time to sort it out, so it's
    // better if IE just uses the basic experience:
    if (
        (!(!!window.MSInputMethodContext && !!document.documentMode))
    ) {
        $flbk.u.ready(carousel);
    }
})();
