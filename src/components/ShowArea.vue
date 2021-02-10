<template>
  <node-context-menu
    ref="metaMenu"
    :show="nodeContextShow"
    @instance="locateInstance"
    @list="recentInstances"
    @addNode="addNode"
    @editNode="editNode"
    @deleteNode="deleteNode"
  ></node-context-menu>
  <layer-context-menu
    ref="layerMenu"
    :show="layerContextShow"
    @changed="modeChanged"
  ></layer-context-menu>
  <svg id="showArea" ref="showArea" :class="bgMode" xmlns="http://www.w3.org/2000/svg" />
</template>

<script lang="ts">
import { Nature } from "@/service/nature";
import { HierarchyPointNode } from "d3";
import { Options, Vue } from "vue-class-component";
import { D3Tree } from "../service/d3tree";
import { data, data2, data3 } from "../testData/node";
import NodeContextMenu from "./NodeContextMenu.vue";
import LayerContextMenu, { LayoutMode } from "./LayerContextMenu.vue";
import { TreePara, D3Node, Shape } from "@/domain/node";
import { Meta } from "@/domain/meta";
import { InstanceQueryCondition } from "@/domain/instance";

@Options({
  components: { NodeContextMenu, LayerContextMenu },
  data() {
    return {
      relationData: null,
      domainData: null,
      data2: data2,
      data3: data3,
      nodeContextShow: false,
      layerContextShow: false,
      tree: null,
      treePara: (null as unknown) as TreePara,
      nature: (null as unknown) as Nature,
      currentMode: LayoutMode.relation,
      bgMode: "mode_relation",
    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMetaMenu(e: MouseEvent, d: D3Node) {
      e.stopPropagation();
      if (this.layerContextShow) this.layerContextShow = false;
      var cm = this.$refs.metaMenu;
      cm.para = {
        top: e.clientY,
        left: e.clientX,
        node: d,
      };
      this.nodeContextShow = true;
    },
    hideMetaMenu() {
      this.nodeContextShow = false;
    },
    showLayoutMenu(e: MouseEvent) {
      if (this.nodeContextShow) this.nodeContextShow = false;
      var lm = this.$refs.layerMenu;
      lm.para = {
        top: e.clientY,
        left: e.clientX,
        mode: this.currentMode,
      };
      this.layerContextShow = true;
    },
    hideLayoutMenu() {
      this.layerContextShow = false;
    },
    modeChanged(selected: LayoutMode) {
      this.layerContextShow = false;
      if (selected == LayoutMode.domain) {
        this.setMode(LayoutMode.domain);
        this.treePara.data = this.domainData;
        this.treePara.shape = Shape.rect;
      } else {
        this.setMode(LayoutMode.relation);
        this.treePara.data = this.relationData;
        this.treePara.shape = Shape.circle;
      }
      this.tree.show(this.treePara);
    },
    setMode(mode: LayoutMode) {
      this.currentMode = mode;
      this.bgMode = "mode_" + LayoutMode[mode];
    },
    async locateInstance(e: InstanceQueryCondition) {
      this.nodeContextShow = false;
      let data = await this.nature.getInstance(e);
      if (!data) return;
      this.setMode(LayoutMode.instance);
      this.treePara.data = data;
      this.treePara.shape = Shape.rectR;
      this.tree.show(this.treePara);
    },
    async navigateLeft(d: D3Node) {
      let data = await this.nature.getUpstream(d);
      this.treePara.data = data;
      this.treePara.shape = Shape.rectR;
      this.tree.show(this.treePara);
    },
    async navigateRight(d: D3Node) {
      let data = await this.nature.getDownstream(d);
      this.treePara.data = data;
      this.treePara.shape = Shape.rectR;
      this.tree.show(this.treePara);
    },
    recentInstances(e: Meta) {
      this.nodeContextShow = false;
      console.log(e);
    },
    addNode(e: { name: string; parent: D3Node }) {
      this.nodeContextShow = false;
      let newNode = new D3Node();
      newNode.name = e.name;
      e.parent.addChild(newNode);
      this.tree.show(this.treePara);
    },
    editNode(e: Meta) {
      this.nodeContextShow = false;
      console.log("editNode");
    },
    deleteNode(e: Meta) {
      this.nodeContextShow = false;
      console.log("deleteNode");
    },
    nodeMoved(source: HierarchyPointNode<D3Node>, target: HierarchyPointNode<D3Node>) {
      this.nodeContextShow = false;
      source.data.moveTo(target.data);
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
        navigateLeft: this.navigateLeft,
        navigateRight: this.navigateRight,
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
.mode_relation {
  background-color: #f1d5d5;
}

.mode_domain {
  background-color: #daf5f6;
}

.mode_instance {
  background-color: #eafce4;
}

#showArea {
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
