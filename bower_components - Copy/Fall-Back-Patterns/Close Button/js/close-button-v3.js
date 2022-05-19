/*! --------------------------------------------------------------------------------------------- *\

    Fall-Back Close Button v3.0.0
    https://github.com/Fall-Back/Patterns/tree/master/Close%20Button
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl

    Designed for use with the EM2 [CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut)
    Edge, Chrome 39+, Opera 26+, Safari 9+, iOS 9+, Android ~5+, Android UCBrowser ~11.8+
    FF 47+

    PLUS IE11

\* ---------------------------------------------------------------------------------------------- */

(function() {

    var close_button_container_selector    = '[data-js="close-button"]';
    var close_button_focus_target_selector = 'h1[tabindex=\'-1\']';
    var close_button_class                 = 'close-button';
    var close_button_id                    = '';
    var close_button_effect_duration       = 1000;

    var close_button_container_class       = 'js-close-button-container';

    var close_button_class_string = '';
    if (close_button_class) {
        close_button_class_string = ' class="' + close_button_class +'"';
    }

    var close_button_id_string = '';
    if (close_button_id) {
        close_button_id_string = ' class="' + close_button_id +'"';
    }
    
    // Focus HAS to move somewhere so default to h1. May rethink this...
    if (!close_button_focus_target_selector) {
        close_button_focus_target_selector = 'h1';
    }

    var close_button_focus_target_selector_string = ' data-js-focus-target="' + close_button_focus_target_selector +'"';


    var close_button_html  =
'<button' + close_button_id_string + close_button_class_string + close_button_focus_target_selector_string + '>' +
'    <span hidden="" aria-hidden="false">Close</span>' +
'    <svg focusable="false" width="24" height="24"><use xlink:href="#icon-cross"></use></svg></button>' +
'</button>' + "\n";


    var $close_button = {

        close_buttons: null,
        close_button_containers: null,

        init: function() {
			var self = this;

            $close_button.close_button_containers = document.querySelectorAll(close_button_container_selector);

            Array.prototype.forEach.call($close_button.close_button_containers, function (close_button_container, i) {

                close_button_container.className += '  ' + close_button_container_class;

                close_button_container.innerHTML += close_button_html;

                var close_button = close_button_container.lastElementChild;

                close_button.addEventListener('click', function(e) {
                    e.preventDefault();

                    close_button_container.setAttribute('data-close', true);

                    setTimeout(function(){
                        close_button_container.parentNode.removeChild(close_button_container);
                    }, close_button_effect_duration);
                    
                    document.querySelector(this.getAttribute('data-js-focus-target')).focus();
                });
            });
        }
    }

    $flbk.u.ready($close_button.init);
})();
