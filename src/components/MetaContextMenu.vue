<template>
  <div
    v-show="show"
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <ul class="list-group">
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
          <button type="button" class="btn btn-success" @click="query">
            go
          </button>
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
      <li class="list-group-item item list-group-item-action">
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
import { Meta, NatureData } from "@/domain";
import { D3Node } from "@/service/d3tree";
import { Options, Vue } from "vue-class-component";

export class CMPara {
  left = 0;
  top = 0;
  node: D3Node = (undefined as any) as D3Node;
}

@Options({
  data() {
    return {
      instanceId: "",
      instancePara: "",
      instanceStaVer: "",
      metaName: "",
    };
  },
  props: {
    show: Boolean,
    para: CMPara,
  },
  emits: ["instance", "list", "editNode", "addNode", "deleteNode"],
  methods: {
    query(e: KeyboardEvent) {
      let staVer: Number = 0;
      if (this.instanceStaVer.length > 0)
        staVer = new Number(this.instanceStaVer);
      else if (this.para.meta.isState()) staVer = -1;
      this.$emit("instance", {
        id: this.instanceId,
        meta: this.para.meta,
        para: this.instancePara,
        staVer,
      });
      this.instanceId = "";
      this.instancePara = "";
      this.instanceStaVer = "";
    },
    list() {
      this.$emit("list", this.para.node);
    },
    editNode() {
      this.$emit("editNode", this.para.node);
    },
    deleteNode() {
      this.$emit("deleteNode", this.para.node);
    },
    addNode() {
      this.$emit("addNode", {
        name: this.metaName,
        parent: this.para.node,
      });
      this.metaName = "";
    },
    canQueryInstance() {
      if (!this.para.node) return false;
      if (!this.para.node.data) return false;
      return true;
    },
    isState() {
      if (!this.para.node) return false;
      let nd = (this.para.node as D3Node).data;
      if (!nd) return false;
      if (nd.data) return nd.data.isState();
      return false;
    },
  },
})
export default class MetaContextMenu extends Vue {
  para: CMPara = new CMPara();
}
</script>
<style scoped lang="stylus">
.my-menu {
  z-index: 900;
  position: absolute;
}
</style>
