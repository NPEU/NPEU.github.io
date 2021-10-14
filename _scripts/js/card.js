/*
    Card enhancements
*/

(function() {

    var card = function() {
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
            var cta = el.querySelector('.c-cta');
            var down = false, up = false;

            el.addEventListener('mousedown', function(e) {
                // Detect left click only:
                var left_click = card.detectLeftButton(e);
                console.log(left_click);
                if (!left_click) {
                    down = false;
                    return false;
                }
                el.classList.add('c-card--is-mousedown');
                down = +new Date();
            });

            el.addEventListener('mouseup', function(e) {
                el.classList.remove('c-card--is-mousedown');
                if (!down) {
                    return;
                }
                up = +new Date();
                if ((up - down) < 200) {
                    //h_link.click();
                }
            });
        });
    };

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(card);
})();
