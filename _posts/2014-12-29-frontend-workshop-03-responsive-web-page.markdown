---
layout: post
title: "Frontend workshop(3) - Responsive Web Page"
description: "To make web page responsive"
category: UI
---

##Responsive Web Page

What is responsive? The definition of responsive web design has three essentials:
* Fluid Grid
* Flexible Images
* Media Queries

The first two essentials are to get relative units like percentage rather than absolute pixels or points. It calls for page element sizing which will fit in with all the size of page size.
To calculate the relative units, finding the pixels or points of the target and context(usually it is the parent element of the target), use the following formula.

```
target ÷ context = result
```
Media Queries are used to look at the capability of the devices.

###Flexible Grid

####Flexible Font
use `em`/`rem` as unit of font-size
{% highlight css %}
h1 {
  font-size: 2em;
}
{% endhighlight %}

####Fluid Grid
  * change `pixel` to `percentage`
  * grid system

###Flexible Images
{% highlight css %}
img {
  max-width: 100%;
}
{% endhighlight %}

###Media Queries

####Media type
all, screen, print...
{% highlight html %}
<link rel="stylesheet" href="style.css" media="screen">
{% endhighlight %}
{% highlight css %}
@media screen {}
{% endhighlight %}

####Media query
{% highlight css %}
@media only screen and (max-width: 640px) {
  img {
    max-width: 100%;
  }
}
{% endhighlight %}

####Viewpoint
{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endhighlight %}

####Retina
{% highlight css %}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {}
{% endhighlight %}

##Reference

###Readings

[responsive-web-design](http://alistapart.com/article/responsive-web-design)

###Tools
  * [responsive view](http://responsive.is/)
  * [grid generator](http://gridpak.com/)