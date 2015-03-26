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
Media Queries are used to look at the capability of different devices.

###Flexible Grid

Although the concept of responsive does not point out flexible font, it is very important to use flexible font for the web design.
You can treat font as a character image, or vice versa. Then what you can do is to make font/image to change size depends on context.

####Flexible Font
To make font flexible, just use `em`/`rem` as unit of font-size.
{% highlight css %}
h1 {
  font-size: 2em;
}
{% endhighlight %}

####Fluid Grid
There are many grid systems to help building responsive web page. Although different grid systems might use different break points,
 the concept and way to use fluid grid is same. If the page is simple, you can define the grid system by yourself.
  * change `pixel` to `percentage`
  * grid system

###Flexible Images
We want the image to be smart as well.
{% highlight css %}
img {
  max-width: 100%;
}
{% endhighlight %}

###Media Queries

####Media type
all, screen, print... There are two ways to define or import media type.
{% highlight html %}
<link rel="stylesheet" href="style.css" media="screen">
{% endhighlight %}
{% highlight css %}
@media screen {}
{% endhighlight %}

####Media query
Define the style you need to overwrite inside the media query.
{% highlight css %}
@media only screen and (max-width: 640px) {
  img {
    max-width: 100%;
  }
}
{% endhighlight %}

####Viewpoint
The screen width and device width is not always the same.
{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endhighlight %}

####Retina
Usually need to consider of the width and image size for retina device.
{% highlight css %}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {}
{% endhighlight %}

##Reference

###Readings

[responsive-web-design](http://alistapart.com/article/responsive-web-design)

###Tools
  * [responsive view](http://responsive.is/)
  * [grid generator](http://gridpak.com/)