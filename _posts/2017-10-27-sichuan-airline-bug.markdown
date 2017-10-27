---
layout: post
title: "四川航空，我并不想吐槽你的代码"
description: "四川航空，我并不想吐槽你的代码"
category: Others
---

本来是要去四川航空官网（[http://www.sichuanair.com/](http://www.sichuanair.com/)）兑换机票的，结果在Mac的chrome上打开官网后整个人都震惊到了。没错，就是下图：

![四川航空官网](/images/2017-10-27-sichuan-airline-bug-screenshoot.png)

没办法，只能通过客服电话解决问题。正如标题里提到的：川航，我并不想吐槽你的代码。只是客服告诉我“您可以访问我们的官网去开启积分兑换权限的操作”。所以就有了下面的扯皮：

我：“你们官网挂了”
客服：“我这里官网显示正常啊”
我：“你用的什么浏览器？”
客服：“啊？？？我这里官网显示正常的”
我：“是不是IE啊？我在Mac的浏览器上显示是乱码，你可以找台Mac电脑试一下”
客服：“可是我这里官网显示正常啊”

。。。（无限死循环）问题得不到解决，程序员的老毛病就犯了！

![四川航空官网后台报错](/images/2017-10-27-sichuan-airline-bug-console-error.png)

果然，控制台里一堆报错。找了IE浏览器试了一下，确实在IE上显示是正常的（所以，我不‘怪’你）。只能从控制台报错找线索。第二个报错中提示ValidationMessage没有被定义，这个js文件中也并没有这个变量的定义，所以只能是全局变量。

继续追踪，在homeRedirect.do文件的143行，也就是控制台第一个报错的地方提示SyntaxError。源码是这样的：

{% highlight javascript %}
var LoyaltyTotalMilesPointsErr = 'you don't have enough mileage to redeem, please book flight with cash';
{% endhighlight %}


很显然，string中的单引号没有转译导致语法错误。文件报错后导致后面的代码没有被执行，因此在其他变量引用的地方，出现后面的报错xxx is not defined。

然而，为什么IE上显示正常呢？

其实IE也会报错（只是错误提示并不明显：“缺少 ';' ”），但是在报错后会继续执行后面的代码。所以后面的ValidationMessage和dafaultWords会被定义，页面也会正常渲染。只不过这里会有一个隐含的问题：LoyaltyTotalMilesPointsErr没有被定义。当运行到引用这个变量的代码时，相应的功能也会挂掉（从命名来看，当计算黄金会员总里程提示错误信息时，需要引用这个变量）。

问题很明显了：
 - 开发缺少基本的前端知识
 - 测试没有考虑跨浏览器
 - 川航并不重视用户体验，网站挂掉一个多月了还是无人问津

btw，官网对JS文件没有任何编译压缩，对此也是无力吐槽了。。。