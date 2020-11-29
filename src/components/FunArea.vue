<template>
  <div id="fun-css">
  Fun Area
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class FunArea extends Vue {
  msg!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#fun-css
  position: fixed;
  top: 42px;
  right 0px;
  width 200px;
  border: 2px solid #0019ff;
  border-radius: 15px;
  background-color: rgba(92, 236, 255, 0.9);

</style>
