Dropdown
========

A simple dropdown component.

Markup Example
--------------

```
<h2>Active at all widths</h2>

<div class="dropdown dropdown--all-widths">
    <button id="dropdown-toggle-1" class="dropdown__button" data-js="dropdown__button" hidden aria-label="Dropdown area"><svg display="none" class="icon  icon--is-closed"><use xlink:href="#icon-chevron-down"></use></svg><svg display="none" class="icon  icon--is-open "><use xlink:href="#icon-chevron-up"></use></svg></button>

    <div class="dropdown__area" id="dropdown-toggle-1--target">
        <div class="text-module">
            <p>Dropdown area content</p><!-- if links, first should have data-js="dropdown__focus-start" attribute -->
            <p>Dropdown area content</p>
            <p>Dropdown area content</p>
        </div>
    </div>

</div>

<hr>


<h2>Only active at wide</h2>

<div class="dropdown  dropdown--only-wide">
    <button id="dropdown-toggle-2" class="dropdown__button" data-js="dropdown__button" hidden aria-label="Dropdown area"><svg display="none" class="icon  icon--is-closed"><use xlink:href="#icon-chevron-down"></use></svg><svg display="none" class="icon  icon--is-open "><use xlink:href="#icon-chevron-up"></use></svg></button>

    <div class="dropdown__area" id="dropdown-toggle-2--target">
        <div class="text-module">
            <p>Dropdown area content</p><!-- if links, first should have data-js="dropdown__focus-start" attribute -->
            <p>Dropdown area content</p>
            <p>Dropdown area content</p>
        </div>
    </div>

</div>

<hr>

<h2>Only active at narrow</h2>

<div class="dropdown  dropdown--only-narrow">
    <button id="dropdown-toggle-2" class="dropdown__button" data-js="dropdown__button" hidden aria-label="Dropdown area"><svg display="none" class="icon  icon--is-closed"><use xlink:href="#icon-chevron-down"></use></svg><svg display="none" class="icon  icon--is-open "><use xlink:href="#icon-chevron-up"></use></svg></button>

    <div class="dropdown__area" id="dropdown-toggle-2--target">
        <div class="text-module">
            <p>Dropdown area content</p><!-- if links, first should have data-js="dropdown__focus-start" attribute -->
            <p>Dropdown area content</p>
            <p>Dropdown area content</p>
        </div>
    </div>

</div>

<hr>
```

Dependancies
------------

* _start_settings.scss