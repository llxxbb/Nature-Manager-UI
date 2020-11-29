<template>
  <div id="tip-block" v-if="ok">
    <h2>Nature Manager Tips</h2>
    <div id="tip-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  props: {
    ok: Boolean,
  },
})
export default class Tips extends Vue {
  ok!: Boolean;
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#tip-block {
  position: fixed;
  background-attachment: fixed;
  margin: auto;
  top: 10px;
  left: 200px;
  right: 200px;
  border: 2px solid yellow;
  border-radius: 15px;
  background-color: rgba(255, 177, 140, 0.9);
}

#tip-content {
  font-size: 150%;
}
</style>
