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
import { Meta } from "@/domain";
import { Nature } from "@/service/nature";
import { HierarchyPointNode } from "d3";
import { Options, Vue } from "vue-class-component";
import { D3Tree, TreePara, TreeEvent } from "../service/d3tree";
import { data, data2, data3 } from "../testData/node";
import MetaContextMenu from "./MetaContextMenu.vue";

@Options({
  components: { MetaContextMenu },
  data() {
    return {
      data: data,
      data2: data2,
      data3: data3,
      cmShow: false,
      tree: null,
      treePara: (null as unknown) as TreePara,
      nature: (null as unknown) as Nature,
    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMenu(e: MouseEvent, d: Meta) {
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
    locateInstance(e: { id: string; meta: Meta }) {
      console.log(e);
    },
    recentInstances(e: Meta) {
      console.log(e);
    },
    addNode(e: { name: string; parent: Meta }) {
      let newNode = new Meta();
      newNode.name = e.name;
      if (e.parent.children) e.parent.children.push(newNode);
      else if (e.parent._children) e.parent._children.push(newNode);
      else e.parent.children = [newNode];
      this.tree.update(this.treePara);
    },
    editNode(e: Meta) {
      console.log("editNode");
    },
    deleteNode(e: Meta) {
      console.log("deleteNode");
    },
    nodeMoved(
      source: HierarchyPointNode<Meta>,
      target: HierarchyPointNode<Meta>
    ) {
      // remove from parent
      let index = source.parent?.data.children?.indexOf(source.data) as number;
      if (index > -1) source.parent?.data.children?.splice(index, 1);
      else return;
      // add to target
      if (target.data.children) target.data.children.push(source.data);
      else if (target.data._children) target.data._children.push(source.data);
      else target.data.children = [source.data];
      // refresh
      this.tree.update(this.treePara);
    },
  },
  async mounted() {
    this.nature = new Nature();
    this.data = await this.nature.getAll();
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
        nodeMoved: this.nodeMoved,
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
