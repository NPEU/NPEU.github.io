/*
    Prevents in-page action link clicks from being added to the browser history.
    If the JS fails to load or doesn't run, the actions still work but history is added to.
    I believe this is an acceptable fallback.
    
    Both plain JS and jQuery versions available
    Un/comment the one you want to use.
    May consider auto-detecting jQuery to decide which one to use.
*/

// Prevent errors in in-supporting browsers (old IE and old FF):
if (document.getElementsByClassName) {
    window.onload = (function(onload) {
        return function(event) {
            onload && onload(event);
            
            // Plain JS version:
            var links = document.getElementsByClassName('js-no-history');
            var l     = links.length;
            for(var i = 0; i < l; i++)
            {
                links.item(i).addEventListener('click', function(e) {
                    e.preventDefault();
                    location.replace(this.href);
                }, false);
            }
            
            // jQuery version:
            /*
            $(".js-no-history").on("click", function(e) {
                e.preventDefault();
                location.replace(e.target.href)
            });
            */
        }
    }(window.onload));
}