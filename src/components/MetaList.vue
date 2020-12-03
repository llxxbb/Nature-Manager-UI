<template>
  <div id="meta-list-border" v-if="ok">
    <div>
      Meta List
      <button>+</button>
      <button>E</button>
      <button>X</button>
    </div>
    <div id="meta-list"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  props: {
    ok: Boolean,
  },
})
export default class MetaList extends Vue {
  ok!: Boolean;
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#meta-list-border {
  position: fixed;
  z-index: 100;
  background-attachment: fixed;
  margin: auto;
  top: 100px;
  bottom: 100px;
  left: 0px;
  width: 200px;
  border: 2px solid #fefe90;
  border-radius: 15px;
  background-color: rgba(255, 177, 140, 0.9);

  #meta-list {
    overflow-x: auto;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }
}
</style>
