---
layout: post
title: "How to quick start react native apps"
description: "Use react native to quick start a native app"
category: ReactJS
---

Facebook just release [React Native](http://facebook.github.io/react-native/) for iOS, it is really a good news for React-fans.
Powered by Javascript, it is the way to build native apps using [React.js](http://facebook.github.io/react/) for user interface,
no necessary to write native code.

### What has been inspired?

* Native components with Javascript
* Easy to extend with custom native views and modules
* Javascript version of CSS-layout with [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
* Live uploads in iOS simulator

### Quick setup
{% highlight sh %}
brew install node
brew install --HEAD watchman
brew install flow
npm install -g react-native-cli
{% endhighlight %}

[flow](http://www.flowtype.org/) is a library to check Javascript static type.

react-native-cli is a command line tool to build React native apps. After it installed, just use the following command to
start a basic react native app.

{% highlight sh %}
react-native init your-app-name
{% endhighlight %}

After generate the app, go to your-app-name folder and `open your-app-name.xcodeproj` to open the project in xcode. Run
`cmd+R` to start/restart the app in your iOS simulator. Then you can see a welcome page there.

The main file to load any view or data change is in `index.ios.js`

See the [AwesomeProject demo](https://github.com/dujuanxian/AwesomeProject) followed by the [tutorial at React Native](http://facebook.github.io/react-native/docs/tutorial.html)

### Links may be useful
* [React Native getting started](http://facebook.github.io/react-native/docs/getting-started.html)
* [React source code](https://github.com/facebook/react-native)
* [React Native examples](https://github.com/facebook/react-native/tree/master/Examples)
* [React native blogs](http://www.reactnative.com/)
* [React.js Conf 2015 Keynote 2 - A Deep Dive into React Native](https://www.youtube.com/watch?v=7rDsRXj9-cU)