<template>
  <div
    v-show="show"
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <ul class="list-group">
      <li
        v-show="canNavigateInstance()"
        class="list-group-item item list-group-item-action"
      >
        <div class="container">
          <div class="row">
            <div v-show="canNavigateLeft()" class="col">
              get upstream:
              <img src="../assets/nav-left.svg" @click="leftInstance" />
            </div>
            <div v-show="canNavigateRight()" class="col">
              get downstream:
              <img src="../assets/nav-right.svg" @click="rightInstance" />
            </div>
          </div>
        </div>
      </li>
      <li
        v-show="canQueryInstance()"
        class="list-group-item item list-group-item-action"
      >
        <img src="../assets/locate.svg" />
        query instance
        <div class="input-group">
          <input
            v-model="instanceId"
            type="text"
            title="default 0"
            class="form-control"
            placeholder="id"
          />
          <input
            v-model="instancePara"
            type="text"
            class="form-control"
            placeholder="para"
          />
          <input
            v-show="isState()"
            v-model="instanceStaVer"
            title="default -1 : for all version"
            type="text"
            class="form-control"
            placeholder="status version"
          />
          <img
            src="../assets/relation.svg"
            class="btn btn-outline-success"
            title="show data flow of this `Instance`"
            @click="query"
          />
        </div>
      </li>
      <li
        v-show="canQueryInstance()"
        class="list-group-item item list-group-item-action"
        @click="list"
      >
        <img src="../assets/list.svg" />
        query recent instances
      </li>
      <li
        v-show="false"
        class="list-group-item item list-group-item-action"
        @click="editNode"
      >
        <img src="../assets/node-edit.svg" />
        edit node
      </li>
      <li class="list-group-item item list-group-item-action" v-show="canAdd()">
        <img src="../assets/node-plus.svg" />
        add child node
        <input v-model="metaName" class="form-control" @keyup.enter="addNode" />
      </li>
      <li
        v-show="false"
        class="list-group-item item list-group-item-action"
        @click="deleteNode"
      >
        <img src="../assets/node-minus.svg" />
        delete node
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Meta } from "@/domain/meta";
import { Instance } from "@/domain/instance";
import { D3Node, NatureData, DataType } from "@/domain/node";
import { Options, Vue } from "vue-class-component";
import { InstanceQueryCondition } from "@/domain/instance";
import { INSTANCE_RELATED_AUTO } from "@/config";

export class CMPara {
  left = 0;
  top = 0;
  node: D3Node = (undefined as any) as D3Node;
  id = "";
  para = "";
}

@Options({
  data() {
    return {
      instanceId: "",
      instancePara: "",
      instanceStaVer: "",
      metaName: "",
      show: false,
    };
  },
  props: {
    para: CMPara,
  },
  emits: [
    "instance",
    "list",
    "editNode",
    "addNode",
    "deleteNode",
    "insLeft",
    "insRight",
  ],
  methods: {
    showMenu(data: CMPara) {
      this.para = data;
      this.instanceId = data.id ? data.id : "";
      this.instancePara = data.para ? data.para : "";
      this.show = true;
    },
    hideMenu() {
      this.show = false;
    },
    leftInstance() {
      this.show = false;
      this.$emit("insLeft", this.para.node);
    },
    rightInstance() {
      this.show = false;
      this.$emit("insRight", this.para.node);
    },
    query(e: KeyboardEvent) {
      this.show = false;
      let data = this.para.node.data as NatureData;
      // init and meta
      let meta: Meta;
      if (data.dataType == DataType.META) {
        meta = data.data;
      } else {
        meta = (data.data as Instance).meta;
      }
      // init state version
      let staVer: number = 0;
      if (this.instanceStaVer.length > 0)
        staVer = new Number(this.instanceStaVer) as number;
      if (staVer == 0 && meta.isState()) staVer = -1;
      // query
      let cond = new InstanceQueryCondition();
      cond.id = this.instanceId;
      cond.meta = meta;
      cond.para = this.instancePara;
      cond.staVer = staVer;
      this.$emit("instance", cond);
      this.instanceId = "";
      this.instancePara = "";
      this.instanceStaVer = "";
    },
    list() {
      this.show = false;
      // init meta
      let node = this.para.node;
      if (!node.data) return null;
      let nd = node.data as NatureData;
      let meta;
      if (nd.dataType === DataType.META) meta = (nd.data as Meta).name;
      else if (nd.dataType === DataType.INSTANCE)
        meta = (nd.data as Instance).data.meta;
      else return;
      this.$emit("list", meta);
    },
    editNode() {
      this.show = false;
      this.$emit("editNode", this.para.node);
    },
    deleteNode() {
      this.show = false;
      this.$emit("deleteNode", this.para.node);
    },
    addNode() {
      this.show = false;
      this.$emit("addNode", {
        name: this.metaName,
        parent: this.para.node,
      });
      this.metaName = "";
    },
    canNavigateInstance() {
      return this.getInstance() && !INSTANCE_RELATED_AUTO;
    },
    canQueryInstance() {
      if (!this.getNatureData()) return false;
      return true;
    },
    canNavigateLeft() {
      if (!this.para.node) return false;
      return !this.para.node.leftNavDone;
    },
    canNavigateRight() {
      if (!this.para.node) return false;
      return !this.para.node.rightNavDone;
    },
    canAdd() {
      let nd = this.getNatureData();
      if (!nd) return true;
      if (nd.dataType == DataType.INSTANCE) return false;
      return true;
    },
    getInstance(): Instance | null {
      let nd = this.getNatureData();
      if (!nd) return null;
      if (nd.dataType == DataType.INSTANCE) return nd.data as Instance;
      return null;
    },
    getNatureData(): NatureData | null {
      let node = this.para.node as D3Node;
      if (!node) return null;
      return node.data as NatureData;
    },
    isState() {
      let nd = this.getNatureData();
      if (!nd) return false;
      if (nd.dataType == DataType.META) return nd.data.isState();
      else if (nd.dataType == DataType.INSTANCE)
        return (nd.data as Instance).meta.isState();
      return false;
    },
  },
})
export default class NodeContextMenu extends Vue {
  para: CMPara = new CMPara();
}
</script>
<style scoped lang="stylus">
.my-menu {
  z-index: 900;
  position: absolute;
}
</style>
