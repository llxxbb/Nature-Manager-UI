<template>
  <div
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <ul class="list-group">
      <li class="list-group-item item">
        <img src="../assets/query-instance.svg" />
        query instance
        <input />
      </li>
      <li class="list-group-item item">
        <img src="../assets/query-instance.svg" />
        query recent instances
      </li>
      <li class="list-group-item item">
        <img src="../assets/node-edit.svg" />
        edit node
      </li>
      <li class="list-group-item item">
        <img src="../assets/node-plus.svg" />
        add child node
      </li>
      <li class="list-group-item item">
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
  props: {
    para: CMPara,
  },
})
export default class ContextMenu extends Vue {
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