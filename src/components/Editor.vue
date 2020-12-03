<template>
  <div id="edit-window" translate="fade">Fun Area</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String,
  },
})
export default class Editor extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#edit-window {
  position: fixed;
  z-index: 500;
  top: 20%;
  bottom: 20%;
  right: 20%;
  width: 20%;
  border: 2px solid yellow;
  border-radius: 15px;
  background-color: rgba(254, 224, 210, 0.9);
}
</style>
