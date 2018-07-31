---
layout: post
title: "Testing React component and Reflux application"
description: "Using TDD to test React component and Reflux application"
category: ReactJS
---

In this blog, I won't cover test tools or reasons we write tests. It doesn't matter to choose Jest or Mocha, the way to test a React application is
the same.

### Test Pyramid

Agile programming proposes Test Pyramid and it defines three level of tests, which is also suitable for client side web applications.

![Test Pyramid](/images/2015-06-01-test-pyramid.png)

#### Unit Tests

Unit tests are to check functions of components, actions, stores or some other helper functions. Taking React component as example,
given component and component props, after the function be called, then state of component will be changed. All the dependent components,
 actions, stores... should be mocked or stubbed.

![React Component Unit Test](/images/2015-06-01-unit-test.png)

The way to test stores or actions actually the same as the way to test component. We will stub the dependencies and just check the output of
function is the expected.

#### Integration Tests

Service tests or integration tests are checking the interfaces of components and interactions between components. [Reflux](https://github.com/spoike/refluxjs)
 defines React data flow pattern and point out the integration between View Components, Actions and Stores. It is obvious to take the view component data flow
 as the integration tests level.

![React Component Integration Test](/images/2015-06-01-integration-test.png)

Given we have a view component, after view component calling actions and triggering store data change, the component state will be updated. The dependent service
(i.e. API service calls) or other view components calls should be mocked.

Take attention that the concept of view component in Reflux usually means a separate module or view page, not every React components are view components.

#### Functional Tests

Functional tests are black box tests. It usually simulates page visit and operate. It is not related to React or Reflux but basically for all the UI page view.

![React Component Functional Test](/images/2015-06-01-functional-test.png)

### Conclusion

The client side web application follows all the test rules and methods, we can utilize the test concepts and use to React and Reflux applications. Even we didn't
cover test tools or React, Reflux here, they are the essentials for writing tests. Next blog I will discuss how to do Test Driven Development in a React application.

