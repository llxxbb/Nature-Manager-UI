<template>
  <div
    v-show="show"
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <ul class="list-group">
      <li
        v-show="modeDomain()"
        class="list-group-item item list-group-item-action"
      >
        <img src="../assets/domain.svg" />
        Domain Mode
      </li>
      <li
        v-show="modeRelation()"
        class="list-group-item item list-group-item-action"
        @click="list"
      >
        <img src="../assets/relation.svg" />
        Relation Mode
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

export enum LayoutMode {
  domain,
  relation,
}

export class LMPara {
  left = 0;
  top = 0;
  mode: LayoutMode = LayoutMode.relation;
}

@Options({
  props: {
    show: Boolean,
    para: LMPara,
  },
  emits: ["changed"],
  methods: {
    modeDomain() {
      return this.para.mode == LayoutMode.relation;
    },
    modeRelation() {
      return this.para.mode == LayoutMode.domain;
    },
    click() {
      this.$emit("changed");
    },
  },
})
export default class LayerContextMenu extends Vue {
  para = new LMPara();
}
</script>
<style scoped lang="stylus">
.my-menu {
  z-index: 900;
  position: absolute;
}
</style>
