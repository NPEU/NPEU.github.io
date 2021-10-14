// Always use this in case other scrips also want to add options:
if (typeof slim_options === 'undefined' || slim_options === null) {
    var slim_options = {};
}

function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


ready(function(){
    var selects = document.querySelectorAll('select');
    Array.prototype.forEach.call(selects, function(select, i){
    //document.querySelectorAll('select').forEach(function(select) {

        // Set some useful, intelligent defaults:
        var options = {};
        options['select'] = select;
        options['showSearch'] = (select.length > 5);

        // Allow individual extra options or overrides:
        var select_id = false;
        if ('id' in select) {
            select_id = select.id;

            if (select_id && select_id in slim_options) {
                for (var k in slim_options[select_id]) {
                    options[k] = slim_options[select_id][k];
                }
            }
        }

        var slim = new SlimSelect(options);

        // Store the options so we can rebuild the SLim after a reset:
        slim.options = options;

        // Store the slims on the form itself so we can rebuild the SLim after a reset:
        var parent_form = select.form;
        if (typeof parent_form.slims === 'undefined' || parent_form.slims === null) {
            parent_form.slims = [];
        }
        parent_form.slims.push(slim);

        if (typeof parent_form.slim_reset_listener_added === 'undefined' || parent_form.slim_reset_listener_added === null) {
            parent_form.slim_reset_listener_added = false;
        }

        // Add the reset listener if we havne't already:
        if (parent_form.slim_reset_listener_added === false) {

            parent_form.addEventListener('reset', function(e) {
                //console.log('Calling reset handler: ', select);

                var slimform = this;
                setTimeout(function() {
                    // We need to destroy the the Slim and rebuild it so it uses the underlying HTMLin to
                    // order to reset it. We need the timeout so that it runs AFTER the reset():

                    var slims = slimform.slims;
                    slimform.slims = [];

                    Array.prototype.forEach.call(slims, function(slim, i) {
                        var options = slim.options;
                        slim.destroy();
                        var newslim = new SlimSelect(options);

                        // Store the options so we can rebuild the SLim after a reset:
                        newslim.options = options;

                        slimform.slims.push(newslim);
                    });

                }, 1);

            });

            parent_form.slim_reset_listener_added = true;
        }
    });

});