Subtitles
=========

[html5 Doctor: How to mark up subheadings, subtitles, alternative titles and taglines](http://html5doctor.com/howto-subheadings/)

Also described / expounded in 'Inclusive Design Patterns' by Heydon Pickering [p80],  Subtitles need some specific HTML to make them fully inclusive.


Inline subtitle
---------------

```
<header>
    <h2>Title <span aria-hidden="false" hidden>Subtitle: </span><b>subtitle</b></h2>
</header>
```

`<b>` because in HTML5 it means 'stylistically offset'.


Separate Subtitle or Tagline
----------------------------

```
<header>
    <h2>Title</h2>
    <p>Subtitle</p>
</header>
```
