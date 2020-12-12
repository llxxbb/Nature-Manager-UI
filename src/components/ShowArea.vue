<template>
  <svg
    id="showArea"
    ref="showArea"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 700"
    preserveAspectRatio="none"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as d3 from "d3";
import { HierarchyNode } from "d3";

class Position {
  x: number = 0;
  y: number = 0;
}

class Node{
  name: String = ""
  children: Node[] = []
}

@Options({
  data() {
    return {
      svg: null,
    };
  },
  computed: {
    center: function () {
      let area = this.$refs.showArea!;
      let x = area.clientWidth / 2;
      let y = area.clientHeight / 2;
      return [x, y];
    },
  },
  methods: {},
  mounted() {
    let data = {
      name:"parent",
      children:[
        {
          name: "c1",
        },
        {
          name: "c2"
        }
      ]
    }
    let x0 = Infinity;
    let x1 = -x0;
    let hierarchy = d3.hierarchy(data)
    let root = d3.tree()(hierarchy)
    root.x = 300
    root.y = 500
    // const root = tree(data);

    this.svg = d3.select("#showArea");
    const g = this.svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${10 / 3},${100 - x0})`);

    const link = g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          // .x((d) => d.y)
          // .y((d) => d.x)
      );

    const node = g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d:Position) => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("fill", (d:Node) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d:Node) => (d.children ? -6 : 6))
      .attr("text-anchor", (d:Node) => (d.children ? "end" : "start"))
      .text((d:{data:Node}) => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke", "white");
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
