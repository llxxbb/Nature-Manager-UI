<template>
  <svg
    @contextmenu="showMenu"
    id="showArea"
    ref="showArea"
    xmlns="http://www.w3.org/2000/svg"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { D3Tree, TreePara, Node, TreeEvent } from "./d3tree";
import { data as nodes } from "../testData/node";

@Options({
  components:{
  },
  data() {
    return {
      svg: null,
      data: nodes,

    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMenu(event: MouseEvent) {
      console.log("newdata!");
    },
  },
  mounted() {
    let para: TreePara = {
      target: "#showArea",
      size: {
        width: this.center[0],
        height: this.center[1],
      },
      data: this.data,
    };
    new D3Tree().show(para);
  },
})
export default class ShowArea extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#showArea {
  background-color: #f1d5d5;
  position: fixed;
  z-index: 1;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
}
</style>
