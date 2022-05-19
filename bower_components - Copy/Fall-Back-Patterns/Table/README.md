Table
=====

There's lots to learn about tables and I'll add resources later, but for now wanted to record a very
simple fallback for tables:

```
<table border="1">
...
</table>
```

According the [table spec](https://www.w3.org/TR/html52/tabular-data.html#the-table-element) adding
`border="1"` is a way of indicating that the table is intended for displaying data, and also
provides a visual border in the case of no-CSS, making the table easier to read:

> The border content attribute may be specified on a table element to explicitly indicate that the table element is not being used for layout purposes. If specified, the attribute’s value must either be the empty string or the value "1". The attribute is used by certain user agents as an indication that borders should be drawn around cells of the table.


Column alignment
----------------

Something that has bothered me for a while is that I haven't found a succinct way to descibe how the
data in columns could be aligned in the HTML itself (as opposed to writing specific CSS for a given
table).

Columns containing numbers should generally be right-aligned, but short of applying a class to every
cell in a column, I can't see how this can be done. It's unfortunate that `<col>` elements only 
allow for a very [limited subset of styles](https://www.w3.org/TR/CSS21/tables.html#columns) to be 
applied, and `text-align` isn't one of them.

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col


Something I've tried out is to declare the intent for the table as `data` attribute:

`<table border="1" data-contains="numbers">`

And style it like so:

```
table[data-contains="numbers"] thead th:not(:first-child),
table[data-contains="numbers"] td {
    text-align: right;
}
```

This will align row-headers to the right except the first, which is presumed to be a column of row
headers, and align data-cells to the right also.


Links
-----

In no particular order:

* https://www.456bereastreet.com/archive/200410/bring_on_the_tables/
* https://www.freecodecamp.org/news/html-tables-all-there-is-to-know-about-them-d1245980ef96/
* https://alistapart.com/article/web-typography-tables/