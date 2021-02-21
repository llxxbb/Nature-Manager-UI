# nature-manager-ui

You can use this project to manage Meta and Relation of [Nature](https://github.com/llxxbb/Nature) 

Please user version 0.22.4 or above of Nature.

## Relation Mode

In this mode, you can organize how the business to work.

![main](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/91bec042a199e48e3ec85f3c8e75f35da0fe23538371fe6b14b361d78d9210ae886d5e96a399fb500d6bc2e211d87aba?pictype=scale&from=30113&version=3.3.3.3&uin=309577603&fname=relation.png&size=750)

## Domain Mode

In this mode, you can organize the business domain.

![main](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/c3daeb79f2ef30b58c10d1a1bd2d7ea2d7e2bf5eda7c4e959e1c9c1dd78d894428758e02d24438a0f97be3c83b8e3e11?pictype=scale&from=30113&version=3.3.3.3&uin=309577603&fname=domain.png&size=750)

## Instance Mode

In this mode, you can see the data flow

![main](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/83e3ef7f92e51746f1abc7c8511ee06c148a843d8eb0bbd0c3afb4e20536cb4cb618733bed768874e23061b435f8d8df?pictype=scale&from=30113&version=3.3.3.3&uin=309577603&fname=instance.png&size=750)

## Functions

- change mode by right-click at the blank of the layer.
- context-menu for node.
- can expand-collapse the nodes.
- show `State-Meta` text in red title
- show red circle for current selected node.
- for same `Meta`, use virtual circle to show repeated, and use blue color to identify them when move on them.
- use virtual circle to show `path-domain`.
- can modify settings in `config.ts`
## Change Logs

**0.7.0**  2021-02-18

- tooltip for `Meta`
- tooltip for `Instance`
- tooltip for `Relation`

**0.6.1** 2021-02-15

- list state-instance
- view instance detail
- show current instance detail
- bug fix: state not shown in red

**0.5.0** 2021-02-13

- recent instance
- config.js: support INSTANCE_RELATED_AUTO

**0.4.0** 2021-02-10

- support Instance-mode

**0.3.0** 2021-02-08

- Don't show instance query when node is not a real meta.
- bug fix: meta-context-menu and layout-context-menu conflict
- show State-Meta text in red 
- can modify setting in `config.ts`
- don't show status-version input box when it's unnecessary
- optimize: put it back for a failed drag
- remove business from d3tree

**v0.2.0** 2021-01-24

can show business domain in Domain-Mode. you can do that by right click the blank of the layout, and click the corresponding menu item on the context-menu.

details:

- bug fix: layer context should not be shown when Meta Context is showing.
- can show Business Domain layout.
- use square to show Domain-Node.

**v0.1.1** 2021-01-23

- bug fix: change mock data to real data, now you see every thing which defined in tables, 

**v0.1.0** 2021-01-19

- can show `Meta` and `Relation`, but can't add, edit etcetera.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

