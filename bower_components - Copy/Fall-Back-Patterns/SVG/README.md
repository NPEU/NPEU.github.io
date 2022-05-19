SVG
===

[Test page](https://fall-back.github.io/dev/svg/)

I use two different SVG methods for FallBack.

The first is a simple `img` tag with a JS error handler to fall back to a PNG:

```
<img src="/path/to/image.svg" onerror="this.src='/path/to/fallback-image.png'; this.onerror=null;" alt="Don't forget this" height="80">
```

Note the `height="80"` in scenarios where CSS is unavailable, it's important to limit the hight of the image or it might take over the entire screen.
I use this whenever a 'normal' SVG image is required, like a project logo.
The downside of this technique are that if JS is unavailable and the SVG fails, the the image is not shown, only the `alt` text.
In most cases I think this is acceptable, but for a primary brand logo, you might want to ensure the logo is more robustly available, so...

The second method is one I use for the primary brand logo that does not rely on an extra HTTP request (and thus potentially failing):

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 363.8 69.9" aria-labelledby="primary-logo-title" role="img" height="80">
    <title id="primary-logo-title">Your Brand Name Here</title>
    ... the logo svg here ...
    <image src="/path/to/fallback-image.png" xlink:href="" alt="Your Brand Name Here" height="80"></image>
</svg>
```

If SVG is unavailable, a fallback image is loaded. If THAT is missing, then the alt text is shown.
It's possible to embed a base64 fallback here, but even then if images are disabled the image won't be shown, and this is an extremely unlikely scenario.
The FallBack principal is not to be perfect in all cases, but to be **accessible** and **not broken** in all cases.
So long as your `alt` text provides your Brand name and any information your logo contains, then all users - even those on a crippled browser - can still get to the content.

