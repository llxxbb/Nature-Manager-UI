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

@Options({
  data() {
    return {
      svg: null,
      data: {
        name: "L1",
        children: [
          {
            name: "L2-2",
            children: [],
          },
          {
            name: "L2-1",
            _children: [
              {
                name: "L3-1",
                children: [
                  {
                    name: "L4-1",
                    _children: [
                      {
                        name: "L5-1",
                        children: [
                          {
                            name: "L6-1",
                            _children: [
                              { name: "L7-1", children: [] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { name: "L3-2", children: [] },
            ],
          },
          {
            name: "L2-3",
            children: [],
          },
          {
            name: "L2-4",
            children: [],
          },
          {
            name: "L2-5",
            children: [],
          },
          {
            name: "L2-6",
            children: [],
          },
          {
            name: "L2-7",
            children: [],
          },
          {
            name: "L2-8",
            children: [],
          },
          {
            name: "L2-9",
            children: [],
          },
          {
            name: "L2-10",
            children: [],
          },
          {
            name: "L2-11",
            children: [],
          },
          {
            name: "L2-12",
            children: [],
          },
          {
            name: "L2-13",
            children: [],
          },
          {
            name: "L2-14",
            children: [],
          },
        ],
      },
    };
  },
  computed: {
    center() {
      let area = this.$refs.showArea!;
      return [area.clientWidth, area.clientHeight];
    },
  },
  methods: {
    showMenu() {},
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
<style lang="stylus">
.folder {
  color: Blue;
}

.folder-open {
  color: Chocolate;
}
</style>
