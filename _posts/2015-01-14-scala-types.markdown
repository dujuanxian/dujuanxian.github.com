---
layout: post
title: "Scala Types"
description: ""
category: scala
---

There is no primitive types, everything is `class`

{% highlight scala %}
abstract class Any
{% endhighlight %}

`Class Any` is the root of the Scala class hierarchy.

{% highlight scala %}
abstract class AnyVal extends Any
{% endhighlight %}

value types

*  numeric value types

   `scala.Double` `scala.Float` `scala.Long` `scala.Int` `scala.Char` `scala.Short` `scala.Byte`

*  non-numeric value types

   `scala.Unit` `scala.Boolean`

Scala String

{% highlight scala %}
scala>"a string" + res0
res1: java.lang.String = a string 1
{% endhighlight %}

There is no `scala.String` in scala, on the JVM, `String` is an alias for `java.lang.String`.


Scala Int

{% highlight scala %}
abstract final class Int extends AnyVal
{% endhighlight %}

{% highlight scala %}
scala> 1
res0: Int = 1
{% endhighlight %}

Int, a 32-bit signed integer (equivalent to Java's int primitive type) is a subtype of `scala.AnyVal`. Scala stores integers in the same way as Java: as 32-bit words. This is important for efficiency on the JVM and also for interoperability with Java libraries.
Standard operations like addition or multiplication are implemented as primitive operations. However, Scala uses the "backup" class `java.lang.Integer` whenever an integer needs to be seen as a (Java) object. This happens for instance when invoking the `toString` method on an integer number or when assigning an integer to a variable of type `Any`. `Integers` of type `Int` are converted transparently to "boxed integers" of type `java.lang.Integer` whenever necessary.
There is an implicit conversion from `scala.Int => scala.runtime.RichInt` which provides useful non-primitive operations.

{% highlight java %}
//This is java
boolean isEqual(Integer x, Interger y){
    return x == y;
}
{% endhighlight %}

{% highlight scala %}
scala> def isEqual(x: Int, y: Int) = x == y
scala> def isEqual(x: Any, y: Any) = x == y
{% endhighlight %}

For value types, it is the natural (numeric or boolean) equality. For reference types, `==` is treated as an alias of the `equals` method inherited from `Object`. That method is originally defined as reference equality, but is overridden by many subclasses to implement their natural notion of equality.

{% highlight scala %}
scala> def isEqual(x: Int, y: Int) = x eq y
{% endhighlight %}

class `AnyRef` defines an additional `eq` method, which cannot be overridden and is implemented as reference equality

{% highlight scala %}
scala> implicit def strToInt(x: String) = x.toInt
strToInt: (x: String)Int

scala> "123"
res0: java.lang.String = 123

scala> val y: Int = "123"
y: Int = 123

scala> math.max("123", 111)
res1: Int = 123
{% endhighlight %}

refer to [scala school][advanced-types] for more content

[advanced-types]: https://twitter.github.io/scala_school/advanced-types.html