SVG Icons
=========

This is my preferred method for SVG icons. I use [Feather Icons](https://feathericons.com) but the same princple can be applied to any SVG.

HTML
----
Defining the icon set:

```
<body>
<svg xmlns="http://www.w3.org/2000/svg" display="none">
    <symbol id="icon-building" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </symbol>
    <symbol id="icon-calendar" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </symbol>
    ...
</svg>

```

And use them in one of two ways:

Firstly, icons that should appear as part of the content, even in a no-CSS scenario:

```
<svg focusable="false" aria-hidden="true" width="1em" height="1em"><use xlink:href="#icon-menu"></use></svg>
```

Or for translatable, accessible use:

```
<svg aria-labelledby="icon-title" width="1em" height="1em">
    <title id="icon-title">Translatable title</title>
    <use xlink:href="#icon-menu" >
</svg>
```

Note the `width` and `height` attributes should be set to something that makes sense in the context of a no-CSS scenario. Icon sizes can be adjusted using CSS as normal.

Secondly, any icons that should not be visible in this scenario can be hidden by default by replacing the `width` and `height` attributes with `display="none"`:

```
<svg focusable="false" aria-hidden="true" display="none"><use xlink:href="#icon-menu"></use></svg>
```

Your CSS components can then override this with `display="inline"` or whatever.

Further reading
---------------

[Accessible SVG Icons with Inline Sprites](https://www.24a11y.com/2018/accessible-svg-icons-with-inline-sprites)


Example of a more comprehensive set of icons
--------------------------------------------

```
<svg xmlns="http://www.w3.org/2000/svg" display="none">
    <symbol id="icon-building" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </symbol>
    <symbol id="icon-calendar" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </symbol>
    <symbol id="icon-chevron-down" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9"></polyline>
    </symbol>
    <symbol id="icon-chevron-up" viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15"></polyline>
    </symbol>
    <symbol id="icon-chevron-left" viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6"></polyline>
    </symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6"></polyline>
    </symbol>
    <symbol id="icon-cross" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </symbol>
    <symbol id="icon-edit" viewBox="0 0 24 24">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </symbol>
    <symbol id="icon-email" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </symbol>
    <symbol id="icon-facebook" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </symbol>
    <symbol id="icon-fax" viewBox="0 0 24 24">
        <path class="st0" d="M6,18H4c-1.1,0-2-0.7-2-1.6v-4c0-0.9,0.9-1.6,2-1.6h16c1.1,0,2,0.7,2,1.6v4c0,0.9-0.9,1.6-2,1.6h-2"/>
        <rect x="6" y="14" class="st0" width="12" height="8"/>
        <path class="st0" d="M6,7.4L4.8,6.2C4.4,5.7,4.4,5,4.8,4.6c0,0,0.1,0,0.1-0.1c1.4-1.1,3-1.9,4.7-2.2c1.6-0.4,3.2-0.4,4.8,0 c1.7,0.4,3.3,1.1,4.7,2.2c0.5,0.4,0.5,1.1,0.1,1.6c0,0,0,0.1-0.1,0.1L18,7.4c-0.4,0.4-1,0.5-1.5,0.1c-0.4-0.3-0.9-0.6-1.4-0.8 c-0.4-0.2-0.7-0.6-0.7-1v-1c-1.6-0.4-3.2-0.4-4.8,0v1c0,0.4-0.3,0.8-0.7,1C8.4,6.9,8,7.2,7.5,7.5C7.1,7.8,6.4,7.8,6,7.4z"/>
    </symbol>
    <symbol id="icon-file" viewBox="0 0 24 24">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
    </symbol>
    <symbol id="icon-linkedin" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12">
        </rect><circle cx="4" cy="4" r="2"></circle>
    </symbol>
    <symbol id="icon-menu" viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </symbol>
    <symbol id="icon-person" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </symbol>
    <symbol id="icon-phone" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </symbol>
    <symbol id="icon-search" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="7.5"></circle>
        <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
    </symbol>
    <symbol id="icon-twitter" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </symbol>
</svg>

 ```
