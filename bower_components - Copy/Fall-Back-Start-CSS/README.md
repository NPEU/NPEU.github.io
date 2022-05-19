Start-CSS
=========

[Test page](https://fall-back.github.io/dev/start-css/)

An opinionated CSS starting point based on Normalize/Sanitize, Scut, inuitcss and others.

*Work in Progress*

This combines all the relevant bits of the projects mentioned above, and tips and techniques from all over.
It's opinionated, but it's highly configurable - almost all 'opinions' are SCSS variables so they can be changed to suit the current project.

It uses an element-based approach going through all the HTML elements and applying normalisation, tweaks and base styles all that needed it.

The intention here was to create a base style sheet that could be applied to any well-formed HTML and make it look good without having to touch the markup at all. This would then provide a really good starting-point for further development; adding classes and so on. 

Why?
----

I used to use Normalize the whole time, but it caters for some very old browsers. I decided that I'd start all future projects using at least the Original Mustard Cut so some of [Normalise](https://github.com/necolas/normalize.css) wasn't relevant. I was also a little frustrated that I had to override some of the declarations - the biggest frustration was the specificity of some of the selectors.
Inparticular this was a real bugbear:

~~~
input[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  box-sizing: content-box; /* 2 */
}

~~~
It's clear why this is necessary, but the specificity beats a `.class` and since I didn't _want_ those properties I would always have to add:

~~~
input[type="search"] {
  -webkit-appearance: none; /* 1 */
  box-sizing: border-box; /* 2 */
}
~~~

This bothered me. Then I discovered [Sanitize](https://github.com/10up/sanitize.css) and realised it was a much better approach. However, there were still things I didn't like, still things in Normalize they'd removed that I felt should have remained, not to mention a whole load of the bits and pieces I always like to include from projects like [Scut](https://github.com/davidtheclark/scut) and [inuitcss](https://github.com/inuitcss) among others.

So, I decided I'd rather 'roll my own' as it were. The element-based approach described above seemed like the most sane way to tackle this. That way I could have complete control over exactly what elements need what styles, and if I need to make further tweaks to something further down the line, I can tweak precisely the things that need it rather than inadvertently applying styles to things that don't. On the down side it does lead to some duplication but I felt it was worthwhile trade-off.

Using SCSS allowed me to variablize the whole thing, so that anything (or almost anything) that's opinionated is configurable so it can be changed to suit the opinion of whoever is using it. This means there should be very little that needs to be overridden later, only added to.

To Do
-----

* Lots of tidying up especially in the comments (I tried to source/keep track of basically every line so I'd know why it was there)
* Documenation (as always)
* Adding some conditionals where necessary to allow features to be turned off. 

* https://github.com/necolas/normalize.css/commit/55ed05a79c0fd7a9a2c330c6925b982a7d5b307c#diff-bb3dde41d97f19be8ab7b4780a915d5e
* https://github.com/necolas/normalize.css/commit/5d728b83a5ee6ee3e9e3158a28d6369718014e0c#diff-bb3dde41d97f19be8ab7b4780a915d5e
