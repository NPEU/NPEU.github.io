---
layout: structure--styleguide
title: NPEU Styleguide
project_base_url: styleguide
---

* [Tokens](tokens)
* [Elements](elements)
* [Pages](pages)
* [Patterns](patterns)


Notes
-----

### Approach

I use the [FallBack](https://github.com/Fall-Back/Patterns) approach - leave no user behind:

[Tiny FallBack Styles (TFS)](https://github.com/Fall-Back/Patterns/blob/master/Tiny%20FallBack%20Styles/README.md) give a basic, readable presentation of the content if main stylesheets don't load.
The [CSS Only Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut) prevents older browsers from loading the stylesheets (which may cause broken pages).

The styles themselves start with [StartCSS](https://github.com/Fall-Back/Start-CSS), and then design and layout patterns are layers on top.

Each pattern is created and tested in this Styleguide both as a standalone construct, and as nested inside other patterns to ensure compatibility and context-independence.

Each pattern is created using basic, NoCSS HTML, TFS layered on top, and then full styles on top of that.

### Script

There isn't much script used on this site (deliberately) and where it is used it's used in a progressively-enhanced way.

Patterns are styled with assumption that script is unavailable.
The script itself is responsible for adding a js-xyz class to the HTML tag (for reasons explained later) and styling that's dependant on the JS being available is scoped to that class.
E.g. `.js-xyc c-xyz {...}`

#### Why the HTML Tag for .js-xyz Classes?

The reason for this is so that we can inform the entire document that the the given script has loaded.
Whilst each pattern is meant to be self-contained in that it's base and js styles are included in the same SCSS file, we can't say for sure that there may be other changes elsewhere in the page not related to the pattern that may need to occur only if the script is available.

For example, a complex map may need comprehensive instructions, perhaps even explanatory images to instruct a user how to use the map.
It may well be desirable for the whole instruction section to be hidden if the map hasn't loaded.
