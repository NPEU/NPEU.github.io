/*!
    Sortability v0.0.1
    https://github.com/Fall-Back/Sortability
    Copyright (c) 2022, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };


    var sortability = {

        init: function() {
            // Look for all `sortable_group`:
            var sortable_groups = document.querySelectorAll('[sortable_group]');

            Array.prototype.forEach.call(sortable_groups, function(sortable_group, i) {
                // Store items:
                //sortable_group.items = sortable_group.querySelectorAll('[sortable_item]');

                //var sortable_list = sortable_group.querySelector('[sortable_list]');

                // Expose the form if necessary:
                var sortable_form_template = sortable_group.querySelector('[sortable_form_template]');
                var sortable_form;
                var form_added = false;
                if (sortable_form_template) {
                    sortable_form = sortable_form_template.innerHTML;

                    // Check for a replace selector, and put the form there, otherwise keep it in
                    // place:
                    var replace_selector = sortable_group.getAttribute('sortable_replace');
                    if (replace_selector) {
                        var replace_el = document.querySelector(replace_selector);
                        var form_el = document.createElement('div');
                        form_el.id  = 'sortable_form_' + i;
                        form_el.innerHTML = sortable_form;
                        if (replace_el.parentNode.replaceChild(form_el, replace_el)) {
                            form_added = form_el.id;
                        }
                    } else {
                        sortable_form_template.insertAdjacentHTML('afterend', sortable_form);
                        form_added = true;
                    }
                }

                // If the form hasn't been added, we can't go any further.
                if (!form_added) {
                    return;
                }

                if (typeof form_added  === 'string') {
                    sortable_form = document.querySelector('#' + form_added);
                } else {
                    sortable_form = sortable_group;
                }

                if (!sortable_form) {
                    console.error('Could not find form.');
                    return;
                }

                // Form controls and default sort order:
                // (just a set of radios for now - other inputs like select can be added later)
                var control_group = sortable_group.querySelector('[sortable_form_controls]');
                var default_sort  = control_group.querySelector('[sortable_choice][checked]');
                var default_dir   = (default_sort.hasAttribute('sortable_dir') ? default_sort.getAttribute('sortable_dir') : 'asc');
                sortability.sortList(sortable_group, default_sort.value, default_dir);

                var form_controls = control_group.querySelectorAll('[sortable_choice]');
                Array.prototype.forEach.call(form_controls, function(form_control, i) {
                    form_control.addEventListener('change', function(e) {
                        e.preventDefault();

                        // sort the list:
                        var dir   = (this.hasAttribute('sortable_dir') ? this.getAttribute('sortable_dir') : 'asc');
                        sortability.sortList(sortable_group, this.value, dir);
                        return false;
                    });
                });


                return;
            });
        },

        sortList: function(group, index_name, dir) {
            console.log(dir);
            // There may be more than one list in a group (for example if there were
            // sub-headings within a larger group of lists)
            var sortable_lists = group.querySelectorAll('[sortable_list]');
            Array.prototype.forEach.call(sortable_lists, function(sortable_list, i) {

                var items = sortable_list.querySelectorAll('[sortable_item]');

                Array.prototype.forEach.call(items, function(item, i) {
                    var index_els = item.querySelectorAll('[sortable_index]');
                    var primary_index_string = '';
                    var remaining_index_string = '';

                    Array.prototype.forEach.call(index_els, function(index_el, i) {
                        if (index_el.getAttribute('sortable_index_name') == index_name) {
                            primary_index_string = index_el.textContent;
                        } else {
                            remaining_index_string += index_el.textContent + ' ';
                        }
                    });

                    // Tidy index strings:
                    var index_string = primary_index_string + ' ' + remaining_index_string;
                    index_string = index_string.toLowerCase().trim();
                    index_string = index_string.replace(/\s{2,}/g, '');

                    item.setAttribute('sortable_index_string', index_string);
                });

                var items_array = Array.prototype.slice.call(items, 0);
                items_array.sort(function(a,b){
                    var aa = a.getAttribute('sortable_index_string'),
                        ba = b.getAttribute('sortable_index_string');
                    if (aa < ba) {
                        return -1;
                    }
                    if (aa > ba) {
                        return 1;
                    }
                    return 0;
                });

                if (dir == 'desc') {
                    items_array.reverse();
                }

                Array.prototype.forEach.call(items_array, function(item, i) {
                    sortable_list.appendChild(item);
                });
            });

        }
    };



    ready(sortability.init);
})();