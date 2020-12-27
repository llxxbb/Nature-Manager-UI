# dev plan

context menu
    add content

## 已知问题

- 点击空白区域，会使整个图表移动而不是放大。此问题是为了解决nodeSize 问题引入的，只要设置了 nodeSize 属性，会使布局上移，有一半跑到屏幕外面了，所以设置了最上层的 g 的transform，使其居中。但这会导致 zoom 出现一开始说的问题。
