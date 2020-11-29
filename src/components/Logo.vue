<template>
  <div id="logo">
    <img @mouseover="showTips"
    alt="Nature logo" width="32" height="32" src="../assets/logo.png" />
  </div>
  <Tips ref="tips">
    Click the <b>Nature Icon</b> or double click <b>Data Item</b> can open
    <b>Function Panel</b>.</Tips
  >
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Tips from "./Tips.vue";

@Options({
  components: {
    Tips,
  },
  methods:{
    showTips(event: any){
        this.$refs.tips.ok.value = true
    }
  }
})
export default class Logo extends Vue {}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#logo {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
