---
layout: post
title: "Fixed middle right navigation"
description: "A css trick to make navigation fixed at middle right of your site"
category: UI
---

See what it looks like firstly. or [find the demo here](http://dujuan.in/fixed-middle-right-nav/)

![Fixed Navigation](/images/2015-03-31-fixed-middle-right-navigation.png)

This way of navigation is to fixed the nav to the middle right of the body, then vertically middle the list of the nav items.
This kind of navigation suites for formatted or icon-based item which won't occupy too much space but well-marked the navigation.

## Props and cons

The fixed right position is easily clickable and touchable, especially on mobile device. And the vertical aligned position
break the traditional layout, which makes it more enjoyable.

But this is not very flexible for irregular nav list. And on mobile device, it might cover the content of the body.

## Way to make it

The height of container and the display and position of the nav is essential.

### Container height

{% highlight css %}
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
{% endhighlight %}

### Nav displaying and positioning

{% highlight css %}
nav {
    color: #3A444D;
    margin-right: 1%;
    display: table;
    position: fixed;
    right: 0;
    height: 100%;
}

nav ul {
    display: table-cell;
    vertical-align: middle;
}
{% endhighlight %}

The vertically middle aligned positioning for the list items used ```table``` and ```table-cell```. I didn't find better way
to do so, it might have smarter ways to do so.

### Styling

Go to [repo](https://github.com/dujuanxian/fixed-middle-right-nav) if you want to know more styling details.