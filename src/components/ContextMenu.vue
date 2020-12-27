<template>
  <div
    class="my-menu"
    :style="{ top: para.top + 'px', left: para.left + 'px' }"
  >
    <h1>Hello</h1>
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
</style>