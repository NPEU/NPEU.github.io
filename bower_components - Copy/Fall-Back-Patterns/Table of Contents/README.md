Table of Contents
=================

Described in 'Inclusive Design Patterns' by Heydon Pickering [p143],  Tables of Contents (ToC) need some specific HTML to make them fully inclusive.

My slight adaptation is presented here:

```
<nav aria-labelledby="toc">
    <h2 id="toc">Contents</h2>
    <ul>
        <li>
            <a href="#a-subheading">A Subheading</a>
        </li>
        <li>
            <a href="#another-subheading">Another Subheading</a>
        </li>
        <li>
            <a href="#a-third-subheading">A third Subheading</a>
        </li>
        <li>
            <a href="#a-final-subheading">A Final Subheading</a>
        </li>
    </ul>
</nav>
```

These links need to correspond to headings further down the page:

```
<h2 id="a-subheading" tabindex="-1">A Subheading</h2>
```

The `tabindex="-1"` is for Internet Explorer, to ensure the heading receives focus when the ToC link is used.
This in turn ensures that subsequent tab-able elements are arrived at in the correct order.