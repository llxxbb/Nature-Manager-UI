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

http://bl.ocks.org/robschmuecker/7880033

注意：当横向排列时，x,y 坐标是交换的。
## 其它问题

[第三方组件无 ts 文件](https://www.jianshu.com/p/1e262b487f26)

[使用plugin的方式](https://v3.vuejs.org/guide/plugins.html#using-a-plugin)

[点击folder](http://mbostock.github.io/d3/talk/20111018/tree.html)

[d3:变动和更新可以用 join 来简化](https://www.codementor.io/@milesbryony/d3-js-join-14gqdz3hfj)

[显式 SVG icon](https://cli.vuejs.org/guide/html-and-static-assets.html#static-assets-handling)

[Vue 的 props 是 one-way 的](https://v3.vuejs.org/guide/component-props.html#one-way-data-flow)

不能在上游直接修改子组件的props值，props可使用data中的属性进行赋值来解决这个问题。

## d3 新加节点位置加错的问题

d3:可能存在bug， 情况描述：有节点 a-b-c a-d b-c 是折叠的，先d下面建一个 e，然后点击 b 打开折叠，会发现 c 变成了e. 目前在 join.update中可以重构，但性能不好。

解决方法：添加新节点时删除之前创建的所有内容，重新构建整个图表。

## 因 svg 图层遮盖问题造成的无法拖放

解决方法：拖放时将鼠标移动到被拖放图形的外部。
## 已知问题

- 点击空白区域，会使整个图表移动而不是放大。此问题是为了解决nodeSize 问题引入的，只要设置了 nodeSize 属性，会使布局上移，有一半跑到屏幕外面了，所以设置了最上层的 g 的transform，使其居中。但这会导致 zoom 出现一开始说的问题。

- 多个父节点包含相同字节点时，用 tree 表达的不是很理想。