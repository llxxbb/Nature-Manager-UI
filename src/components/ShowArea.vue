<template>
  <div id="showArea">
  Show Area
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class ShowArea extends Vue {
  msg!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#showArea
  position: fixed;
  z-index: 1;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border: 2px solid yellow;
</style>
