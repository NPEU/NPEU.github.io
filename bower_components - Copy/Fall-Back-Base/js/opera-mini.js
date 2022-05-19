/*
    Adds the Opera Mini class name and provides tweaks for some of the odd Opera Mini behaviour.
    I've not managed to disable JS on Opera Mini, so I guess this is safe.
*/
var isOperaMini  = (navigator.userAgent.indexOf('Opera Mini') > -1
                 || navigator.userAgent.indexOf('OPiOS') > -1);
/*var isOperaMini8 = (navigator.userAgent.indexOf('Opera Mini/8') > -1);*/
if (isOperaMini) {
    var root = document.documentElement;
    root.className += " opera-mini";
    
    /*if (isOperaMini8) {
        var root = document.documentElement;
        root.className += "-8";
    }*/
    
    /* Add input size attribute for Opera Mini so that the input can collapse */
    /* This is no longer needed due to revised CSS in search form 0.6, but keep for reference */
    /*window.onload = (function(onload) {
        return function(event) {
            onload && onload(event);

            var search_fields = document.getElementsByClassName('search-form__field');
            var i = search_fields.length;
            while (i--) {
                search_fields[i].setAttribute("size", "1");
            }
        }
    }(window.onload));*/
}