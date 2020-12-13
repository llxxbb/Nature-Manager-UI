# 开发说明

TypeScript

vue

## Tree

[vued3tree](https://github.com/David-Desmaisons/Vue.D3.tree#Methods) 

不是Typescript

[解决方法](https://stackoverflow.com/questions/12687779/how-do-you-produce-a-d-ts-typings-definition-file-from-an-existing-javascript)

在 tsconfig.json 文件中加入下面的内容：

```
"allowJs": true,
"declaration": true,
```

采用下面的方法：but got: ReferenceError: window is not defined

```js
npm install -g dts-gen
dts-gen -m vued3tree
```

用下面的方法：也会报错

```
npx tsc node_modules\vued3tree\dist\index.js --allowJs
```

```
npx tsc node_modules\vued3tree\dist\index.js --declaration --allowJs --outFile node_modules\vued3tree\dist\index.d.ts.a
```

使用下面的方式，找到一个错误的包

https://www.typescriptlang.org/dt/search?search=

npm i --save-dev vue-w-tree



https://www.jianshu.com/p/1e262b487f26