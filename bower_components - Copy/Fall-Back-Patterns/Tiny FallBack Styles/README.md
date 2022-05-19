Tiny FallBack Styles (TFS)
==========================

Ok, so there are situations where your stylesheets won't load:

Failed CSS
----------

1. If the connection/request fails they won't arrive
2. If the browser is being 'cut' by a {Mustard Cut](https://github.com/Fall-Back/CSS-Mustard-Cut)
3. If you've implemented some sort of 'Lite' version of your site/app to let users choose not to load them

No CSS
------

5. If someone is using a text-only browser
6. If someone has disabled stylesheets

Now these last two I don't have data on - I don't know if people still use text-only browsers; and I don't know if anyone browses the web with styles deliberately disabled (expect perhaps Web Developers (myself included) with [a point to prove](https://css-tricks.com/that-time-i-tried-browsing-the-web-without-css/)).
I'm not even sure it's possible to disable CSS in any mobile browser?
Number 3 is something I'm seriously considering and I need to do more research on.

Right, so if the stylesheets haven't loaded you're normally left with a fairly ugly column of raw-rendered HTML - even with the cleanest, most well-organised markup. User Agent Stylesheets provide some critical styles like margins, font sizes and weights and display properties, [for example](http://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css).

I've thought quite a lot about this, and I'd love to be able to leverage this stylesheet more in creating a more useable FallBack experience. By using deprecated attributes and inappropriate tags we can create something that works a little better, BUT, that's against the spec.

I'll come back to that later.

The TFS is designed to be as small as possible and live in the `<head>` of a page. So yes, it gets downloaded with each request, but it's Tiny, and it's water tight against Failed CSS situations.
Currently it's this:

```
    <style>
        /* Tiny Fall-Back Styles (https://github.com/Fall-Back/Patterns/edit/master/Page/README.md) */
        body{font-family:sans-serif;line-height:1.2;padding:1em;margin:0 auto;max-width:50em;}
        img{max-width:100%;-ms-interpolation-mode:bicubic;}
        [hidden]{display:none;}
        main{display:block;}
        hr{border-top:1px solid;border-bottom:0 none;height:0px;}
        fieldset{border:1px solid;}
        pre{overflow-x:scroll;overflow-y:auto;}
        button,input,select,textarea{vertical-align:middle;}

        /* For YouTube via http://embedresponsively.com. May or may not be needed. */
        .embed-container{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;} .embed-container iframe, .embed-container object, .embed-container embed{position:absolute;top 0;left:0;width:100%;height:100%;}
    </style>
```

The objective here is to make things cleaner, more legible and more responsive.

* `body` - here we set a sans-serif font, bump the line height, give it some space and a max-w9dth to prevent super-long lines of text on wider screens.
* `img` - prevent images form breaking out of the viewport, plus a really old IE thing to stop them looking terrible.
* `[hidden]` - older browsers don't support this, with this they do.
* `main` - for older, non-supporting browsers where it would default to `inline`. I should probably add the other newer elements, but so far I havn't needed to.
* `hr` - I use these a lot because they make good visual separators in Failed/No CSS scenarios, so make them look tidier.
* `fieldset` - tidy the border for these.
* `pre` - make these behave better by default.
* `button,input ... ` make these sit more nicely alongside each other.

The YouTube embed thing is for common responsive video scenarios. I'm not sure I use it much myself so I may ditch this.

This TFS makes things look much better in Failed CSS scenarios. As discussed we can't do much about No CSS scenarios - or can we?

User Agent 'Tricks'
------------------

[Examples](https://fall-back.github.io/test/tfs-not-allowed.html)

Using `<fieldset>` around things can go a long way to help break up content, especially on a long page. Wwe can add `role="presentation"` to avoid any accessibility (a11y) issues (though I've never encountered any issues if it's absent).
This gives us:

1.
```
<fieldset role="presentation">...</fieldset>`
```
---


Sometimes you want some things to appear side-by-side. You can only do this if you use a table, and they don't snap into a single column. But, if you know you're only displaying a small amount of text, it does work. Here I've added more attributes to tidy it all up:

```
<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tbody>
        <tr valign="top">
            <td>
                Left content
            </td>
            <td align="right">
                Right content
            </td>
        </tr>
    </tbody>
</table>
```

This actually works fine, even on very small screens and has support back to the dark ages.
**But I'm not supposed to use it**.
Seems a shame doesn't it?

There are more examples to add here, but the point is I'm wrestling with ignoring the Spec, the deprecations, the 'MUST NOT's - I'm using these things wisely and sparingly and making sure the semantics are conveyed properly using aria so I'm not sure what the harm is. It's SO very tempting.

But
---

If I'm not allowed to use these, what's the alternative? Well, I've already established No CSS scenarios as being very unlikely, so that leaves the Failed CSS scenarios and the TFS. If I choose to expand this a little (boo - I wanted them to be as small as possible), I can add some attributes and such to do similar things. I'm thinking of using `tfs-*` attributes (I know - already invalid but loads of things use custom attributes like this, and it save's on bytes).

So I might have:

```
[tfs-text~="left"] {text-align: left;} /* Maybe not because it's the default? */
[tfs-text~="right"] {text-align: right;}
[tfs-text~="center"] {text-align: center;}
[tfs-text~="larger"] {font-size: larger;}

[tfs-block~="border"] {border: 1px solid;}
[tfs-block~="padding"] {padding: 1em;}
[tfs-block~="table"] {display: table; width: 100%; border-collapse: collapse; table-layout: fixed;}
[tfs-block~="cell"] {display: table-cell;}

```

And so on. I need to try this out, but you can already see the TFS has grown a bit, and the HTML won't be much leaner in most cases. Also even though the `table` display has old support, it's not as old as using an actual table. Also, the main (only?) argument against things like `align="right"` is that they're "presentational only" attributes etc. Whilst I get this (I really do - I'm an advocate of semantic HTML and accessibility), is having `tfs-text="right"` (or `data-tfs-text="right"` to be valid) really any different?

So arguably this approach costs more for less support?

Honestly, I'm torn.
