/*
    Card enhancements
*/

(function() {

    //var debug = true;
    var debug = false;

    var ident = 'card';

    var card = function() {

        if ($flbk.s.debug) {
            console.log(ident + ' started');
        }

        // Get all elements we want to apply this to:
        var elements = document.querySelectorAll('.js-c-card');

        var detectLeftButton = function(event) {
            if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
                return false;
            } else if ('buttons' in event) {
                return event.buttons === 1;
            } else if ('which' in event) {
                return event.which === 1;
            } else {
                return (event.button == 1 || event.type == 'click');
            }
        }

        Array.prototype.forEach.call(elements, function(el, i) {

            el.classList.add('c-card--has-js');

            var h_link = el.querySelector('.c-card__title > a');
            var down = false, up = false;

            el.addEventListener('mousedown', function(e) {
                // Don't run this if we're not in full support mode:
                var check = $flbk.u.css_rule_applied($flbk.s.general_css_check_selector, $flbk.s.general_css_check_property, $flbk.s.general_css_check_value);
                if (!check) {
                    return true;
                }

                // Detect left click only:
                var left_click = detectLeftButton(e);
                console.log(left_click);
                if (!left_click) {
                    down = false;
                    return false;
                }
                el.classList.add('c-card--is-mousedown');
                down = +new Date();
            });

            el.addEventListener('mouseup', function(e) {
                // Don't run this if we're not in full support mode:
                var check = $flbk.u.css_rule_applied($flbk.s.general_css_check_selector, $flbk.s.general_css_check_property, $flbk.s.general_css_check_value);
                if (!check) {
                    return true;
                }

                el.classList.remove('c-card--is-mousedown');
                if (!down) {
                    return;
                }
                up = +new Date();
                if ((up - down) < 200) {
                    h_link.click();
                }
            });
        });
    };

    $flbk.u.ready(card);
})();
