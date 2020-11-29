<template>
  <div class="hello">
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

</style>
