---
layout: post
title: "HTML5 template"
description: "A HTML5 website template code to setup basic infrastructures"
category: UI
---

It is waste of time to create HTML template for website every time. To remember all the meta tag content is almost impossible.
This template won't fit all the websites, but will provide the basics.

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="stylesheet" href="css/style.css">
    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <style>
        article, aside, figure, footer, header, hgroup, menu, nav, section {
            display: block;
        }
    </style>
</head>
<body>
    <script src="js/main.js"></script>
</body>
</html>
{% endhighlight %}

1. Set viewport will make the site full width on mobile

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
{% endhighlight %}

2. X-UA-Compatible meta tag make user to use latest version of IE or Chrome rendering engine if installed

{% highlight html %}
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
{% endhighlight %}

3. Import your css in head stylesheet

{% highlight html %}
<link rel="stylesheet" href="css/style.css">
{% endhighlight %}

and js in body

{% highlight html %}
<script src="js/main.js"></script>
{% endhighlight %}

4. html5shiv allow blocked HTML5 element rendering as block at IE

{% highlight html %}
<!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
{% endhighlight %}

An easy way to make it support https is to eliminate 'http' or 'https' and just start with '//'

set the CSS display property to block will securely correct behavior in older browsers

{% highlight html %}
<style>
    article, aside, figure, footer, header, hgroup, menu, nav, section {
        display: block;
    }
</style>
{% endhighlight %}
