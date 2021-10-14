/*
    Can't be totally sure what this is for, now...
    It'll come back to me...
*/

(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    var adjustJustifyContent = {
        run: function() {
            var containers = document.querySelectorAll('.js-adjust-me');
            Array.prototype.forEach.call(containers, function(container, i) {
                var item = container.querySelector('.js-adjust-me__reference');
                if (getComputedStyle(container)['height'] > getComputedStyle(item)['height']) {
                    container.style.justifyContent = 'center';
                } else {
                    container.style.justifyContent = 'space-between';
                }
            });
        }
    }



    ready(adjustJustifyContent.run);
    window.onresize = adjustJustifyContent.run;
})();
