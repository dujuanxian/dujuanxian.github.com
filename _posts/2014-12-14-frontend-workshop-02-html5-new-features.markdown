---
layout: post
title: "Frontend workshop(2) - HTML5 New Features"
description: "Workshop to change website from HTML4 to HTML5 after introduction of the HTML5 new features"
category: UI
---

After getting familiar with the [HTML5 new features][html5-new-features],
it is the time to start a game to refactor the legacy HTML4 page. Check the code **[here](https://github.com/dujuanxian/art_gallery_html4)**.

The example is an art gallery site. Open the html4.html in your browser, and you will see it as following image.

![HTML4 demo screenshot](/images/2014-12-14-frontend-workshop-02-html5-new-features.png)

It uses the old HTML4 tags and features, the task is to find them out and choose the right HTML5 features to replace them.
Check out the result for **[HTML5 Demo](https://github.com/dujuanxian/art_gallery_html5)**.

There are two places using `nav`. The one inside `header` is for links to parts within the page, the other one in the sidebar is for links to other pages. These
are the cases that we usually use for `nav`.

Inside `aside` and `main`, each element which is self-contained is wrapped with `article`. Why not `section` here? `section` forms part of something else,
`article` is its own thing -- something that is completed, self-contained. Inside `article`, some of the header content just use `h1` without wrapping with
`header`, if the content is just a `<h1>header</h1>`, we don't need to use `<header>` tag to wrap it.

See **[Tips][html5-new-features]** if you get confused for choosing the features.

[html5-new-features]: {{ "/posts/ui/frontend-workshop-01-html5-new-features.html" | prepend: site.baseurl }}