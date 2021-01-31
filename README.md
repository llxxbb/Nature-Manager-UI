# nature-manager-ui

You can use this project to manage Meta and Relation of [Nature](https://github.com/llxxbb/Nature) 

Please user version 0.20.1 or above of Nature.

## Relation Mode

![main](doc/relation.png?raw=truw)

## Domain Mode

![main](doc/domain.png?raw=truw)

## functions

- change mode by right-click at the blank of the layer.
- context-menu for node.
- you can move one node to another.
- can expand-collapse the nodes.
- show `State-Meta` text in red title
- show red circle for current selected node.

- for same `Meta`, use virtual circle to show repeated, and use blue color to identify them when move on them.
- for use virtual circle to show `domain`.
- can modify setting in `config.ts`
## Change Logs

**0.3.0** 2021-02-08

Don't show instance query when node is not a real meta.
bug fix: meta-context-menu and layout-context-menu conflict
show State-Meta text in red 
can modify setting in `config.ts`
don't show status-version input box when it's unnecessary
optimize: put it back for a failed drag
remove business from d3tree

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
