# 开发说明

TypeScript

d3

vue

vue-plugin: [vue-contextmenu](https://github.com/chiic/vue-contextmenu)

font-awesome : used to show icons
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