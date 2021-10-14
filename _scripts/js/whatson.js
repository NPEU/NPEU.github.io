// Always use this in case other scrips also want to add options:
if (typeof slim_options === 'undefined' || slim_options === null) {
    var slim_options = {};
}

slim_options['whatson_filter_staff'] = {
    'placeholder': 'Filter staff ...'
};

function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


ready(function(){

    var filters = [];

    var filter_buttons    = document.querySelectorAll('.whatson-filter-button');
    var staff_select      = document.getElementById('whatson_filter_staff');
    var whatson_filter    = document.getElementById('whatson_filter');
    var new_filter        = document.getElementById('new_filter');
    //var new_filter_button = document.getElementById('add_new_filter');

    Array.prototype.forEach.call(filter_buttons, function(filter_button, i) {

        filters.push(filter_button.value);

        filter_button.addEventListener('click', function(e) {
            var new_value = this.value.split('|');

            staff_select.slim.set([]);
            staff_select.slim.set(new_value);
        });

        var filter_delete_button = filter_button.nextElementSibling;

        if (filter_delete_button !== null) {
            filter_delete_button.addEventListener('click', function(e) {

                if (window.confirm('Are you sure you want to delete this filter?')) {
                    var filter_button = this.previousElementSibling;
                    document.getElementById('whatson_filter').value = filter_button.value;
                    return true;
                } else {
                    e.preventDefault();
                    return false;
                }
            });
        }

    });

    whatson_filter.addEventListener('change', function(e) {

        var filter_string = whatson_filter.value;

        if (filter_string != '' && filters.indexOf(filter_string) === -1) {
            new_filter.removeAttribute('hidden');
        } else {
            new_filter.setAttribute('hidden', '');
        }
    });
});
