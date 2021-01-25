<template>
  <meta-context-menu
    ref="metaMenu"
    :show="metaContextShow"
    @instance="locateInstance"
    @list="recentInstances"
    @addNode="addNode"
    @editNode="editNode"
    @deleteNode="deleteNode"
  ></meta-context-menu>
  <layer-context-menu
    ref="layerMenu"
    :show="layerContextShow"
    @changed="modeChanged"
  ></layer-context-menu>
  <svg id="showArea" ref="showArea" xmlns="http://www.w3.org/2000/svg" />
</template>

<script lang="ts">
import { InstanceQueryCondition, Meta } from "@/domain";
import { Nature } from "@/service/nature";
import { HierarchyPointNode } from "d3";
import { Options, Vue } from "vue-class-component";
import { D3Tree, TreePara, TreeEvent, Shape } from "../service/d3tree";
import { data, data2, data3 } from "../testData/node";
import MetaContextMenu from "./MetaContextMenu.vue";
import LayerContextMenu, { LayoutMode } from "./LayerContextMenu.vue";

@Options({
  components: { MetaContextMenu, LayerContextMenu },
  data() {
    return {
      relationData: null,
      domainData: null,
      data2: data2,
      data3: data3,
      metaContextShow: false,
      layerContextShow: false,
      tree: null,
      treePara: (null as unknown) as TreePara,
      nature: (null as unknown) as Nature,
      currentMode: LayoutMode.relation,
    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMetaMenu(e: MouseEvent, d: Meta) {
      e.stopPropagation();
      if (this.layerContextShow) this.layerContextShow = false;
      var cm = this.$refs.metaMenu;
      cm.para = {
        top: e.clientY,
        left: e.clientX,
        meta: d,
      };
      this.metaContextShow = true;
    },
    hideMetaMenu() {
      this.metaContextShow = false;
    },
    showLayoutMenu(e: MouseEvent) {
      if (this.metaContextShow) this.metaContextShow = false;
      var lm = this.$refs.layerMenu;
      var mode =
        this.currentMode == LayoutMode.relation
          ? LayoutMode.domain
          : LayoutMode.relation;
      lm.para = {
        top: e.clientY,
        left: e.clientX,
        mode,
      };
      this.layerContextShow = true;
    },
    hideLayoutMenu() {
      this.layerContextShow = false;
    },
    modeChanged() {
      this.layerContextShow = false;
      if (this.currentMode == LayoutMode.relation) {
        this.currentMode = LayoutMode.domain;
        this.treePara.data = this.domainData;
        this.treePara.shape = Shape.rect;
      } else {
        this.currentMode = LayoutMode.relation;
        this.treePara.data = this.relationData;
        this.treePara.shape = Shape.circle;
      }
      this.tree.show(this.treePara);
    },
    locateInstance(e: InstanceQueryCondition) {
      this.metaContextShow = false;
      console.log(e);
    },
    recentInstances(e: Meta) {
      this.metaContextShow = false;
      console.log(e);
    },
    addNode(e: { name: string; parent: Meta }) {
      this.metaContextShow = false;
      let newNode = new Meta();
      newNode.name = e.name;
      if (e.parent.children) e.parent.children.push(newNode);
      else if (e.parent._children) e.parent._children.push(newNode);
      else e.parent.children = [newNode];
      this.tree.show(this.treePara);
    },
    editNode(e: Meta) {
      this.metaContextShow = false;
      console.log("editNode");
    },
    deleteNode(e: Meta) {
      this.metaContextShow = false;
      console.log("deleteNode");
    },
    nodeMoved(
      source: HierarchyPointNode<Meta>,
      target: HierarchyPointNode<Meta>
    ) {
      this.metaContextShow = false;
      // remove from parent
      let index = source.parent?.data.children?.indexOf(source.data) as number;
      if (index > -1) source.parent?.data.children?.splice(index, 1);
      else return;
      // add to target
      if (target.data.children) target.data.children.push(source.data);
      else if (target.data._children) target.data._children.push(source.data);
      else target.data.children = [source.data];
      // refresh
      this.tree.show(this.treePara);
    },
  },
  async mounted() {
    this.nature = new Nature();
    this.relationData = await this.nature.getRelation();
    this.domainData = this.nature.getDomain();

    this.treePara = {
      target: "#showArea",
      size: {
        width: this.center[0],
        height: this.center[1],
      },
      data: this.relationData,
      event: {
        showMetaMenu: this.showMetaMenu,
        hideMetaMenu: this.hideMetaMenu,
        showLayoutMenu: this.showLayoutMenu,
        hideLayoutMenu: this.hideLayoutMenu,
        nodeMoved: this.nodeMoved,
      },
      shape: Shape.circle,
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

<style lang="stylus">
.same {
  stroke: #3c2eff;
}
</style>
