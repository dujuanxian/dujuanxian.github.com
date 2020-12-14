---
layout: post
title: "如何采用React Context & Hooks 去做全局状态管理？"
description: ""
category: ReactJS
---

在业务或者UI交互稍微复杂一些的项目里，都离不开状态管理的问题。不管是从后台API请求的数据还是页面的UI状态，都需要有一个"Store"帮我们去做状态
管理。通常在项目中，我们会引入 Redux 去负责这样的职责。但是 Redux 要维护大量的模板代码，加上 Redux 通过 connect 这种高阶组件的方式注入 state 和 
dispatch 的方式并不直观，增加了理解的复杂度。React从16.8开始，引入了 React Hook，配合 Context API，可以在项目中来解决全局状态管理的问题。

### React Context + Hooks 状态管理架构
![React Context + Hooks 状态管理架构图](/images/2020-12-11-react-context-and-hooks-to-manage-global-state.png)

我们先来整体看一下通过 React Context 和 Hooks 进行状态管理的架构图。我们把构成架构的每个负责不同职责的节点称为"功能单元"，下面列出了架构图中涉及的
所有功能单元和对应的职责：
- **React Context**：负责全局状态管理，通过提供的 Context API，可以进行状态的读写。每个 Context 都会生成 Context.Provider 和 Context.Consumer
    - **Context.Provider**：为消费组件提供存储的 context 值，通常存储全局 state 和用来分发 action 的 dispatch 方法
    - **Context.Consumer**：可以订阅 context 的变更，引入 Hooks 后，可以使用 useContext 来读取 context，因此在实现中不需要关心 Context.Consumer
- **Component**：组件的概念不需要多讲，在基于组件的架构中，是用来构成 React 应用最基础的功能单元
- **Action**：Action 是组件发出的通知，用于描述要发生的事件或者变化
- **Reducer**：用于响应 Action，来处理 state 的变化，基于 Action 和旧的 state 返回新的 state

在架构图中，描述功能单元之间的交互的"S"和"D"，分别表示 state 和 dispatch 方法，其中
- **dispatch**：是组件触发 Action 的唯一方法

熟悉 Redux 的人并不会对 Action 和 Reducer，以及 dispatch 的概念陌生，我们也能从上述职责描述中看出，不管是在 Redux 还是 React Hooks 中，这几个功能单元的
职责是相同的，React 引入这些功能单元，也是为了处理各种复杂状态逻辑的场景。这里，巧妙的使用了 Context API 进行全局状态管理，使用 Hooks 提供的 useReducer 来去处理
组件状态的变化，既使得数据流向变得清晰、可预测，又避免 Redux 复杂的模板代码生成和数据流管理。接下来，我们来通过一个例子看一下代码的具体实现。

### 举例
我们以游客在页面查看评论列表为例，来使用 React Context + Hooks 实现评论数据的全局状态管理

#### 创建 React Context
我们需要在 React App 中创建一个 context 对象来存储评论列表数据。基于架构我们知道，React Context 通过 Context.Provider 来为消费组件提供存储的 context，所以
这里我们先创建一个 `<CommentProvider />` 来返回 Context.Provider 和 Context 对象本身。

```jsx
// CommentProvider.js
const CommentContext = createContext({});

const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, { comments: [] });
  return ( <CommentContext.Provider value={{ state, dispatch }}> {children} </CommentContext.Provider> );
};
```
在 `<CommentProvider/>` 中，调用 useReducer Hook 来去注册 commentReducer（会在后面创建），将解构的 state 和 dispatch 函数通过 CommentContext.Provider 
提供给子组件。

当前是将 state 和 dispatch 未经过加工直接提供给了 Provider，很多实现会在 Provider 中解构 state，只去传递 `<CommentProvider/>` 需要的 state，另外也会将组装好的 Actions 
直接传递给消费组件。虽然这种方式更明确要传递的数据和方法，但是解构 state 和 创建 Actions 的逻辑由于封装在 Provider 中，导致很难测试。所以，这里还是借鉴了 Redux 的方式，
在独立的 Action Creator 去定义 Action，然后在组件中直接调用。

#### 通过 CommentProvider 来组装 CommentList 组件
构建好 `<CommentProvider/>` 以后，在 `<App/>` 中，便可以通过 `<CommentProvider/>` 来组装 `<CommentList />` 了。
```jsx
// App.js
const App = () => (
  <CommentProvider>
    <CommentList />
  </CommentProvider>
);
```  
接下来，我们来看一下，如何在 `<CommentList />` 中去使用 Context.Provider 提供的 context 值。

#### 创建 CommentList 组件
```jsx
// CommentList.js
import { fetchComments } from '../commentAction';

function CommentList() {
  const { state, dispatch } = useContext(CommentContext);

  useEffect(() => {
    fetchComments(dispatch);
  }, []);

  return (<ul>
    {state.comments.map((comment) => (
      <li key={comment.id}><p>{comment.body}</p><span>{comment.name}</span></li>
    ))}
  </ul>);
}
```
熟悉 React 的话应该清楚，通常在 useEffect Hook 中去处理 API 请求，来获取评论列表数据。在未使用 Context 对数据进行管理时，在组件内会直接通过组件内 state 
来存取列表数据，然后触发组件的重新渲染。这里不同的是，我们通过 useContext 获取了全局的 state 数据，然后在 useEffect Hook 中，调用了 fetchComments Action，
并没有直接在组件内调用 setState。我们在架构图中跟踪 "S" 的变化，可以看到，调用 Action 后，Reducer 会对 state 进行更新，并将新的 state 值更新到 context 中。
那我们就来看一下，如何创建 Action 和 Reducer 来更新 state 中评论列表的值。

#### 构建 commentAction
```jsx
const fetchComments = async (dispatch) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1/comments');
  dispatch({ type: 'SET_COMMENTS', payload: response.data });
}
``` 
当异步获取评论列表数据后，便通过传入的 dispatch 方法来去发出一个更新评论列表的 'SET_COMMENTS' 的 Action，commentReducer 在接收到这个 Action 以后，便会从
payload 中取出传递的评论列表数据，然后更新到 context 的全局状态中。

#### 构建 commentReducer
```jsx
const commentReducer = (state, action) => {
  if (action.type === 'SET_COMMENTS') {
    return { ...state, comments: action.payload }; 
  }
  return state;
};
```
需要注意的是，和 Redux 强调的一致，reducer 是一个纯函数，只根据传入的 Action 和 旧的 state，返回一个新的 state 值。context 拿到新的 state 后，便会对旧的 state
进行替换。到此，一个完整的更新评论列表的数据流已经走完。

### 总结
我们借用 React 引入的 Context 来去进行状态管理，通过 useReducer Hook 来去更新 state 的变化，并且借鉴了 Redux 中 Action 的抽象，来去描述组件中发生的事件或者变化。
这种方式对全局状态的读取和更新进行了隔离，使得数据在功能单元间的流向更加清晰、易维护。

在实际项目中，需要注意 Context.Provider 中的嵌套关系，需要在合适的父节点提供 context 的值。可以通过UI或业务组件和状态之间的业务关系来去梳理。

可以在 [https://github.com/dujuanxian/react-context-with-hook-comments-demo](https://github.com/dujuanxian/react-context-with-hook-comments-demo) 中查看代码的实现。
其中除了查看评论列表的功能，还包含创建评论的功能。