/*
    Object-fit polyfill.
    Browsers that don't support object-fit:
    IE
    Edge 15-
    FF 35-
    Chrome 30-
    Safari 9.1-
    Opera 18-
    iOS Safari 9.3-
    Android 4.4-
*/

(function() {
    //if(('objectFit' in document.documentElement.style !== false) || !(navigator.userAgent.indexOf('UCBrowser') > -1)) {
    if('objectFit' in document.documentElement.style !== false) {
        return;
    }

    // https://davidwalsh.name/javascript-debounce-function
    // Returns a function, that, as long as it continues to be invoked, will not be triggered. 
    // The function will be called after it stops being called for N milliseconds. If `immediate` 
    // is passed, trigger the function on the leading edge, instead of the trailing.
    var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var compare_heights = function() {
        // Get all elements we want to apply this to:
        var elements = document.querySelectorAll('.js-image-cover');

        Array.prototype.forEach.call(elements, function(el, i) {

            var img = el.querySelector('img');

            // Get the container dimensions:
            var container_rect = el.getBoundingClientRect();

            // Get the image dimensions:
            var image_rect = img.getBoundingClientRect();
            //console.log(container_rect.height, image_rect.height, img.height < container_rect.height);

            // Remove the style. Note the behaviour here isn't ideal, but it's better than the image
            // getting stuck at a small size which can happen otherwise.
            img.removeAttribute('style');

            // If the image is not tall enough to fill the container, swap width/height styles:
            if (img.height <= container_rect.height) {

                img.style.width  = 'auto';
                img.style.height = '100%';
            }
        });
    };

    var polyfill = function() {
        // Run on page load...
        compare_heights();

        var checkresize = debounce(function() {
            compare_heights();
        }, 250);

        // .. and whenever the window resizes:
        window.addEventListener('resize', checkresize);
    };

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(polyfill);
})();
