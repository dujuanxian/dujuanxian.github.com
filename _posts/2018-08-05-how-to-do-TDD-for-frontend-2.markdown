---
layout: post
title: "前端如何做TDD（二）？"
description: ""
category: UI
---

在上篇中，介绍了为什么做测试／TDD，和测试的一些基本理论，在本篇会通过举例详细介绍TDD的过程。

### TDD举例

以快递查询举例，介绍一下前端通过测试驱动开发的方法。这里以Angular前端框架作为语言基础。Angular有非常完善的[测试文档](https://angular.cn/guide/testing)，下面是Angular
官方推荐的测试工具：

| Test Runner | 单元测试框架 |  Angular测试工具            | 端到端测试 |
| ----------- | ----------  | -------------------------- | --------- |
| Karma       |  Jasmine    | Testbed, @angular/…/testing| Protractor|

一个常规的快递查询功能并不复杂，通过这个例子，可以体验一下TDD的过程。首先，先列出业务需求（一般在敏捷开发中对应一张故事卡）以及验收标准AC。

**故事卡**

- _作为_ 一个用户
- _我想要_ 查询快递单号 
- _以便于_ 能够查看快递详情

**验收标准**

1. _Given_ 我在快递查询页，_And_ 输入不匹配格式（10位数字）的快递单号，_Then_ 看到错误提示"请输入10位有效数字单号"
2. _Given_ 我在快递查询页，_And_ 输入正确的快递单号，_When_ 点击搜索，_Then_ 在查询页看到快递详情
3. _Given_ 我在快递查询页，_And_ 输入错误的快递单号，_When_ 点击搜索，_Then_ 在查询页看到错误提示"单号不存在"

对于一张需求明确的故事卡，我们能够非常清楚的列出开发任务列表Task。

**开发任务列表**
1. 创建快递查询页面
2. 校验单号格式，并在页面中显示错误提示
3. 查询订单，若查询成功，在页面中显示快递详情
4. 查询订单，若查询失败，在页面中显示错误提示

这里需要强调一点，开发任务不等于验收标准。在行为驱动开发BDD中，往往AC可以对应我们的测试场景，但在TDD中，驱动开发的是从AC中转换出的任务列表。效果图如下：

![搜索页面效果图](/images/2018-08-05-search-page.png)

#### Task1. 创建快递查询页面
开发一个Angular项目，可以采用Angular提供的命令行工具[Angular CLI](https://cli.angular.io/)。它提供了非常方便的创建项目，添加文件和各种开发任务的命令。

**创建一个新的工程:** `ng new express`

**创建搜索页:** `ng generate component search`

这时，Angular CLI已经为我们创建了一个包含测试文件的SearchComponent，并且被声明到AppModule中。
```typescript
describe('SearchComponent', () => {
  // ...
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
```

接下来，我们需要把创建好的search组件在首页，也就是搜索页引用。在`app.component.html`中，引入组件：

```html
<app-search></app-search>
```
这样一个空的搜索页就创建好了，我们就可以访问本地`http://localhost:4200/`看到"search works！"。

引入`app-search`后，会发现`app.component.spec.ts`测试报错：`'app-search' is not a known element`，这是因为App测试组件在它创建的测试模块中并没有声明`app-search`。这里，我们并不需要在测试组件中去真正的渲染
search组件，因此，一个stub的组件即可满足测试要求。而`app-search`的测试自会在search组件的单元测试中去覆盖。

**创建stub的search组件**
```typescript
@Component({
  selector: 'app-search',
  template: ''
})
class SearchStubComponent {}
```
**在app测试组件中声明**
```typescript
TestBed.configureTestingModule({
  declarations: [
    AppComponent,
    SearchStubComponent
  ],
}).compileComponents();
```

接下来，按照设计图，我们为搜索页添加一个输入框和搜索按钮。由于在search组件引入了form表单，因为需要在`app.module.ts`和`search.component.spec.ts`中引入`FormsModule`。
实现可查看[Github源码](https://github.com/dujuanxian/express)。

#### Task2. 校验单号格式，并在页面中显示错误提示

因为校验单号格式主要是测试响应用户的输入和页面渲染，因此这里的单元测试选择组件的DOM测试。单号的格式校验条件需要满足10位数字，因此可以得出下面的3个测试用例：

```typescript
describe('should validate number', () => {
  it('failed when search input length is not 10', () => { 
    const hostElement = fixture.nativeElement;
    const searchInput: HTMLInputElement = hostElement.querySelector('input');
  
    searchInput.value = '111';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
  
    const errorMessage: HTMLElement = hostElement.querySelector('.error-message');
    expect(errorMessage.textContent).toBe('请输入10位有效数字单号');
  });
  it('failed when search input is not number', () => { // ...
  });
  it('success when search input is 10 length of number', () => { // ...  
  });
});
```

通过测试用例，可以驱动出`validateNumber`的实现代码：

```typescript
validateNumber() {
  this.isInvalid = this.number.length !== 10 || !(new RegExp('^[0-9]*$').test(this.number));
}
```

并在template中显示错误提示：

```html
<div class="error-message" *ngIf="isInvalid">请输入10位有效数字单号</div>
```

#### Task3. 查询订单，若查询成功，在页面中显示快递详情 

订单查询需要通过向服务器发异步请求获取查询信息，可以在`SearchComponent`中注入`SearchService`来获取返回结果。

**创建`SearchService`：** `ng generate service search/search`

##### SearchComponent测试

组件的测试只关心依赖服务的返回，并不需要了解服务是否向远端发起请求（尽管这个例子非常明显，我们需要从后台获取快递详情）。因此，我们只需要对服务进行Mock，
并仿真请求的响应结果即可。在`search.component.spec.ts`中添加单元测试：

```typescript
beforeEach(() => {
  // ...
  searchService = fixture.debugElement.injector.get(SearchService);
});

it ('should search number success with tracking list', function () {
  const trackingList = [{ date: '2018-01-01 10:10', status: '已出库'}] as ITracking[];
  spyOn(searchService, 'getTrackingList').and.returnValue(of(trackingList));
  
  component.number = '1234567890';
  component.searchNumber();
  
  expect(component.trackingList).toEqual(trackingList);
});
```
这里选择了对`searchNumber()`方法进行Function级别的单元测试，是希望简化测试内容。当然，也可以选择DOM测试查看`trackingList`在DOM中的渲染。通过该测试，
可以很容易的驱动出实现：

```typescript
this.searchService.getTrackingList(this.number).subscribe(trackings => {
  this.trackingList = trackings;
});
```

到目前为止，我们还未实现`SearchService`，这也体现了TDD优于DDT的地方：单元测试中对依赖的Mock隔离了实现，并不需要走通完整流程（实现组件以及所有依赖）也可以通过
单元测试来保证业务逻辑的正确性。相反的，采用手动测试DDT，需要实现所有依赖，甚至这里我们需要一个mock server来模拟后台API数据的请求，才能够在页面上进行手动测试。

##### SearchService测试

接下来，为`SearchService`添加测试。Angular采用HttpClient服务进行XHR调用，因此可以像测试其他服务一样，对HttpClient进行Mock。如果和数据服务之间有更多复杂的交互，
可以采用`HttpClientTestingModule`模拟请求和响应，但对于这个简单的数据请求的例子，只需要Mock HttpClient即可。

```typescript
beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  searchService = new SearchService(<any> httpClientSpy);
});

it('should return tracking list', () => {
  const trackingList = [{ date: '2018-01-01 10:10', status: '已出库'}] as ITracking[];
  httpClientSpy.get.and.returnValue(of(trackingList));

  searchService.getTrackingList('1234567890').subscribe( trackings => {
    expect(trackings).toEqual(trackingList);
  });
});
```

根据测试驱动出SearchService的实现代码为：

```typescript
getTrackingList(number: string): Observable<ITracking[]> {
  return this.http.get<ITracking[]>(`/tracking?number=${number}`);
}
```

因为在SearchService中添加了对HttpClient的依赖，因此，在`SearchComponent`的测试中需要引入它的测试依赖：`imports: [ ..., HttpClientTestingModule ]`。

接下来，可以为订单详情添加模板和样式。在[具体实现](https://github.com/dujuanxian/express)中，通过Json Server来mock了后台API的请求。这里不做详细介绍。最后页面的实现如下图。

![搜索页面最终效果图](/images/2018-08-05-search-result-page.png)

### 结束
到此为止，一个完整的从后台获取订单数据的请求就完成了。__Task4. 查询订单，若查询失败，在页面中显示错误提示__ 和Task3比较类似，具体实现可查看[Github源码](https://github.com/dujuanxian/express)。 