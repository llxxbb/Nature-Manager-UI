<template>
  <div
    v-show="show"
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <ul class="list-group">
      <li class="list-group-item item list-group-item-action">
        <img src="../assets/locate.svg" />
        query instance
        <input v-model="instanceId" @keyup.enter="query" />
      </li>
      <li class="list-group-item item list-group-item-action" @click="list">
        <img src="../assets/list.svg" />
        query recent instances
      </li>
      <li class="list-group-item item list-group-item-action" @click="editNode">
        <img src="../assets/node-edit.svg" />
        edit node
      </li>
      <li class="list-group-item item list-group-item-action">
        <img src="../assets/node-plus.svg" />
        add child node
        <input v-model="metaName" @keyup.enter="addNode" />
      </li>
      <li class="list-group-item item list-group-item-action">
        <div class="dropdown">
          <img src="../assets/node-move.svg" />
          move to
          <input v-model="targetMeta" @keyup.enter="moveNode" />
          <button
            type="button"
            class="btn btn-info dropdown-toggle dropdown-toggle-split"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></button>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
        </div>
      </li>
      <li
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
import { Options, Vue } from "vue-class-component";

export class CMPara {
  left = 0;
  top = 0;
  node?: Node;
}

@Options({
  data() {
    return {
      instanceId: "",
      metaName: "",
      targetMeta: "",
    };
  },
  props: {
    show: Boolean,
    para: CMPara,
  },
  emits: ["instance", "list", "editNode", "addNode", "deleteNode", "hide"],
  methods: {
    add() {},
    query(e: KeyboardEvent) {
      this.$emit("hide");
      this.$emit("instance", { id: this.instanceId, meta: this.para.node });
      this.instanceId = "";
    },
    list() {
      this.$emit("hide");
      this.$emit("list", this.para.node);
    },
    editNode() {
      this.$emit("hide");
      this.$emit("editNode", this.para.node);
    },
    deleteNode() {
      this.$emit("hide");
      this.$emit("deleteNode", this.para.node);
    },
    addNode() {
      this.$emit("hide");
      this.$emit("addNode", { name: this.metaName, parent: this.para.node });
      this.metaName = "";
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

.item {
}
</style>
