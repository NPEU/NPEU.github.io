Patterns
========

Accessible, inclusive front end patterns.


Background
----------

I started working on these patterns quite a few years ago, in other repositories, but it wasn't until I came across Heydon Pickering's work that I started to really grasp what it was that I was bulding, and I was able to improve and expand on these patterns and get a clear idea how I coild curate and use them.


What you'll find
----------------

Each pattern resides in its own folder, with its own explanation, instructions and examples.
Some are straightforward HTML examples, but most are more involved than that; many include relevnt CSS and JS as well.


SASS
----

I to like provide a way to customise what I build without needing to edit any pattern's files.
For this reason I make heavy use of SASS variables, as well as some functions and mixins.
SASS is what I know and use; nothing against any other preprocessor.
If someone were to port the SASS into other languages, I'd consider including them, or at least referencing them.


JS
--

Where necessary I've included the minimum native, self-contained JS required for a pattern to function.
The intention is that you concatente these JS files with you other JS, unless stated otherwise.


Templates
---------

Using patterns in real projects often requires generating HTML from some data structure.
Where approptiate I've included templates in the various languages I'm familiar with: PHP, Twig and Liquid (for Jekyll).

There are so many templating options in existance, it would be impossible for me to cater for everthing, but if a language were to be reqested a lot I'd consider including it if a port were created. E.g. React or Vue?


Dependancies and Browser Support
--------------------------------

All of these projects are built the [CSS Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut) in mind; everything is intended to work in the same browsers specified by the <del>Original</del>EM2 Cut, and should fail gracefully in older browsers or in the event of CSS or JS failure or disablement.

The CSS for these patterns is designed to be built on top of [StartCSS](https://github.com/Fall-Back/Start-CSS). Without StartCSS, the visuals will sometimes look sub-par out of the box but should function as exepcted, allowing them to be easily adapted for use with any other framework or CSS methodology.
Even if StartCSS is not used, you will almost certainly need to include the `_start_settings.scss` file, and maybe others too. Each pattern lists it's own dependancies.
