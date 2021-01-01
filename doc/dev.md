# 开发说明

TypeScript

d3

vue

[bootstrap icons](https://icons.getbootstrap.com) : used to show icons

## 视图

使用 ViewBox 属性，可固化坐标使布局变得容易。

高度和宽度都设置为1，这样d3计算的坐标可以直接用，不需要转换，但font-awesome 最小的字体尺寸不能低于1，所以视图放大1000倍。

## Tree

[参考](https://observablehq.com/@d3/tidy-tree)

## 其它问题

[第三方组件无 ts 文件](https://www.jianshu.com/p/1e262b487f26)

[使用plugin的方式](https://v3.vuejs.org/guide/plugins.html#using-a-plugin)

[点击folder](http://mbostock.github.io/d3/talk/20111018/tree.html)

[d3:变动和更新可以用 join 来简化](https://www.codementor.io/@milesbryony/d3-js-join-14gqdz3hfj)

[显式 SVG icon](https://cli.vuejs.org/guide/html-and-static-assets.html#static-assets-handling)

[Vue 的 props 是 one-way 的](https://v3.vuejs.org/guide/component-props.html#one-way-data-flow)

不能在上游直接修改子组件的props值，props可使用data中的属性进行赋值来解决这个问题。

d3:可能存在bug， 情况描述：有节点 a-b-c a-d b-c 是折叠的，先d下面建一个 e，然后点击 b 打开折叠，会发现 c 变成了e. 目前在 join.update中可以重构，但性能不好。