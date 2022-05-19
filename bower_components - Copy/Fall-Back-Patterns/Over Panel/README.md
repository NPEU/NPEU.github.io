Over-Panel
==========

Reveal an over-laid panel with.

Markup Example
--------------

```
<button class="over-panel-control" hidden aria-controls="sample-panel" aria-label="Main menu" aria-expanded="false" data-js="overpanel__control"><svg display="none" class="icon  icon--is-closed"><use xlink:href="#icon-menu"></use></svg><svg display="none" class="icon  icon--is-open"><use xlink:href="#icon-cross"></use></svg></button>
<div class="over-panel  over-panel--fade" id="sample-panel" data-js="over-panel">
    <button class="over-panel__overlay" hidden aria-hidden="true" tabindex="-1" data-js="over-panel__overlay"></button>
    <div class="over-panel__contents" data-js="over-panel__contents">
        <div class="text-module">
            <h2>Over Panel Panel</h2>
            <p>
            This content is in the top slide panel. It could be anything. Probably your navigation but it really could be anything.
            </p>
            <p><a href="https://www.google.co.uk">Test link</a> Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            
            <ul>
                <li>
                    List item
                </li>
                <li>
                    List item
                    <a href="https://www.google.co.uk">Test link</a>
                </li>
                <li>
                    List item
                </li>
            </ul>
        </div>
    </div>
</div>
```

Dependancies
------------

* _start_settings.scss