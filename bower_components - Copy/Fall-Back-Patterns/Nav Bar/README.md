Navbar
======

A responsive navigation bar that degrades well in older browsers. Provides a single-tier dropdown.

Markup Example
--------------

```
<div class="nav-bar">
    <nav class="nav-bar__inner">
        <ul class="nav-bar__items">
            <li class="nav-bar__item">
                <a href="about-us" class="nav-bar__link">About us</a>
                <a role="button" tabindex="0" href="#open-about-us-sub-menu" id="open-about-us-sub-menu" class="nav-bar__link  subnav__control  subnav__open" hidden aria-live="polite">&#9662;
                    <span class="subnav__is-closed-message" aria-label="About Us sub-menu is closed."></span>
                    <span class="subnav__is-open-message" aria-label="About Us sub-menu is open."></span>
                </a>
                <div class="subnav">
                    <ul class="subnav__items">
                        <li class="subnav__item"><a href="what-we-do" class="subnav__link">What we do</a></li>
                        <li class="subnav__item"><a href="contact-us" class="subnav__link">Contact us</a></li>
                        <li class="subnav__item"><a href="meet-the-team" class="subnav__link">Meet the team</a></li>
                        <li class="subnav__item"><a href="testimonials" class="subnav__link">Testimonials</a></li>
                    </ul>
                    <div class="subnav__control  subnav__cancel">
                        <a role="button" tabindex="0" href="#close" class="subnav__link" hidden>&times;</a>
                    </div>
                </div>
            </li>
            <li class="nav-bar__item"><a href="news" class="nav-bar__link">News</a></li>
            <li class="nav-bar__item">
                <span class="subnav__heading">Categories</span>
                <a role="button" tabindex="0" href="#open-categories-sub-menu" id="open-categories-sub-menu" data-content="Categories" class="nav-bar__link  subnav__control  subnav__open" hidden aria-live="polite">&#9662;
                    <span class="subnav__is-closed-message" aria-label="Categories sub-menu is closed."></span>
                    <span class="subnav__is-open-message" aria-label="Categories sub-menu is open."></span>
                </a>
                <div class="subnav">
                    <ul class="subnav__items">
                        <li class="subnav__item"><a href="branding" class="subnav__link">Branding</a></li>
                        <li class="subnav__item"><a href="websites" class="subnav__link">Websites</a></li>
                        <li class="subnav__item"><a href="design" class="subnav__link">Design</a></li>
                    </ul>
                    <div class="subnav__control  subnav__cancel">
                        <a role="button" tabindex="0" href="#close" class="subnav__link" hidden>&times;</a>
                    </div>
                </div>
            </li>
        </ul>
    </nav>
</div>
```

Dependancies
------------

* _start_settings.scss
