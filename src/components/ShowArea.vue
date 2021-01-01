<template>
  <meta-context-menu
    ref="contextMenu"
    :show="cmShow"
    @hide="hideMenu"
    @instance="locateInstance"
    @list="recentInstances"
    @addNode="addNode"
    @editNode="editNode"
    @deleteNode="deleteNode"
  ></meta-context-menu>
  <svg id="showArea" ref="showArea" xmlns="http://www.w3.org/2000/svg" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { D3Tree, TreePara, Node, TreeEvent } from "../service/d3tree";
import { data as nodes } from "../testData/node";
import MetaContextMenu from "./MetaContextMenu.vue";

@Options({
  components: { MetaContextMenu },
  data() {
    return {
      data: nodes,
      cmShow: false,
      tree: null,
      treePara: null,
    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMenu(e: MouseEvent, d: Node) {
      var cm = this.$refs.contextMenu;
      cm.para = {
        top: e.clientY,
        left: e.clientX,
        node: d,
      };
      this.cmShow = true;
    },
    hideMenu() {
      this.cmShow = false;
    },
    locateInstance(e: { id: string; meta: Node }) {
      console.log(e);
    },
    recentInstances(e: Node) {
      console.log(e);
    },
    addNode(e: { name: string; parent: Node }) {
      let newNode: Node = { name: e.name };
      console.log(e.parent);
      if (e.parent.children) e.parent.children.push(newNode);
      else if (e.parent._children) e.parent._children.push(newNode);
      else e.parent.children = [newNode];
      this.tree.update(this.treePara);
    },
    editNode(e: Node) {
      console.log("editNode");
    },
    deleteNode(e: Node) {
      console.log("deleteNode");
    },
  },
  mounted() {
    this.treePara = {
      target: "#showArea",
      size: {
        width: this.center[0],
        height: this.center[1],
      },
      data: this.data,
      event: {
        showMenu: this.showMenu,
        hideMenu: this.hideMenu,
      },
    };
    this.tree = new D3Tree();
    this.tree.show(this.treePara);
  },
})
export default class ShowArea extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#showArea {
  background-color: #f1d5d5;
  position: fixed;
  z-index: 1;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
}
</style>
