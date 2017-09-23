---
layout: post
title: "Angular4组件的类型和通信"
description: "Angular4采用组件组织页面结构，组件的组织结构影响了数据的存储和组件间的通信"
category: Angular4
---

Angular2／4采用组件组织页面结构，组件的组织结构影响了数据的存储和组件间的通信。这种组件驱动架构（Component-Driven Architecture）在React框架中得到了很好的应用。
先来看一下这种组件驱动架构中组件的类型划分。

### 组件的类型

在这种架构中，一般会将组件分为两种类型：
 - Container Components（容器组件）
 - Presentational Components（展示组件）

#### 容器组件
容器类型组件也被称作Smart Component，Application Component或者Controller Component。这类组件一般用于组织、渲染它的下级组件（包括展示组件和容器组件）。特定于应用
的组件是比较直观的容器组件，比如`HomeComponent`。一般应用会通过Router来控制这类容器组件的渲染。容器组件也包括组织型的组件，区别于top-level组件，这类组件虽不是特定
于应用，但也用于组织其他子组件，并且是有状态。比如A组件和B组件包含在一个TabSet中，这个TabSet是页面的一个相对独立的功能，那么我们可以把这个TabSet组织的组件提取成一个
容器组件。

#### 展示组件
一般Presentational component应该是纯净的，也就是说父级传给他的数据不变，那么渲染出来的结果也不应该发生任何变化。比如一个Button组件就是展示组件。它通过@Input
接收用于展示的数据，通过@Output触发父容器的操作。通过这两类接口的定义隔离了自身的行为属性。

在组件驱动架构中构建应用时，可以简单看作通过top-level容器组件来组织应用，然后再通过展示组件和组织型的容器组件树来构建这些top-level容器组件。

### 组件的通信

构建出组件树结构，需要处理组件内数据的存储和组件间的通信。组件间的通信区别于组件和组件的结构。一般有以下几种结构：

 - 父子组件（Parent-Child Components）
 - 兄弟组件（Sibling Components）
 - 容器组件（Container Components）

#### 父子组件通信
Angular4提供了@Input和@Output用于父子组件间数据和操作的通信，也可以通过@ViewChild访问子组件和子组件的方法。下面这张图展示父子组件通信的方式。

![父子组件通信](/images/2017-09-23-angular4-parent-child-component.png)

父子间通信并不复杂，容易混淆的是数据的存储和共享。一般会采用ParentComponentService来实现数据的共享。父组件注入的服务，子组件可以直接共享和访问服务中存储的数据。经常会犯的错误
是将子组件的数据存入父组件注入的服务中。这样会引起一个问题，其他兄弟组件会受到当前子组件共享数据的影响。因此子组件自包含的数据需要声明并存储在子组件中，不要
将所有数据都存入父组件注入的服务中。

#### 兄弟组件通信
兄弟组件间的通信在某些业务场景下也会出现，比如子组件ChildComponent的状态变化会触发兄弟组件SiblingComponent的某个操作或者数据的变化。

对于数据变化这种情况，可以通过父组件注入的服务ParentComponentService来实现数据的共享，或者共享的父组件ParentComponent存储的数据。

通过父组件ParentComponent存储的数据的方式，子组件ChildComponent的改变不能够直接改变父组件存储的数据，需要通过@Output触发父组件的操作来改变父组件的数据。

{% highlight typescript %}
@Component({
  selector: 'parent-component',
  template: `<child-component (changed)="onChange()"></child-component>
             <sibling-component [value]="siblingValue"></sibling-component>`
})
export class ParentComponent {
  siblingValue;
  onChange() {
    this.siblingValue = 'new value';
  }
}
@Component({
  selector: 'child-component',
  template: `<div (click)="someMethod()"></div>`
})
export class ChildComponent {
  @Output() changed = new EventEmitter<any>();

  someMethod() {
    this.changed.emit();
  }
}
{% endhighlight %}

对于触发兄弟组件的某个操作这种情况，Angular4并没有推荐的解决方案，目前可以通过两种方式去解决：
 - 通过EventEmitter来触发兄弟组件的操作。这种方式需要注意的是需要隔离事件的订阅，订阅的事件最好只有父组件树可见，以免引起意外订阅事件，触发错误的操作。
 {% highlight typescript %}
 @Component({
   selector: 'sibling-component',
 })
 export class SiblingComponent implements OnInit {
   constructor(private parentComponentService: ParentComponentService) {};
   ngOnInit() {
     this.parentComponentService.subject.asObservable()
       .subscribe(this.someAction);
   }
 }
 @Component({
   selector: 'child-component',
   template: `<div (click)="someMethod()"></div>`
 })
 export class ChildComponent {
   constructor(private parentComponentService: ParentComponentService) {};
   someMethod() {
     this.parentComponentService.subject.next();
   }
 }
 {% endhighlight %}
 - 在某种情况下，将兄弟组件的通信问题转化成父子组件的通信问题。（需要具体情况具体分析）

#### 容器组件通信
这里的容器组件通信指的是并无包含或紧密依赖关系的容器组件间进行的通信。比如HomeComponent中某个操作可能会触发HeaderComponent的操作。由于top-level的容器组件间一般
不会共享服务，因此一般会采用EventEmitter的方式来触发组件的通信。

### 总结

处理好组件间的通信对应用的扩展和组件的复用非常关键。在设计组件结构时，需要分析清楚组件的职责。接下来根据组件的类别和组件间的关系，处理组件间的通信。同时需要注意数据的
存储和服务的共享。