<template>
  <svg
    id="showArea"
    ref="showArea"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100% 100%"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as d3 from "d3";
import { drag, DragBehavior } from "d3";

class Position {
  x: number = 0;
  y: number = 0;
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
    var data = [
      { x: 200, y: 200 },
      { x: 300, y: 300 },
    ];
    this.svg = d3.select("#showArea");

    const g = this.svg.append("g").attr("cursor", "grab");

    g
      .selectAll("nodes")
      .data(data)
      .join("circle")
      .attr("cx", (d: Position) => d.x)
      .attr("cy", (d: Position) => d.y)
      .attr("r", 100)
      .attr("fill", (d: any, i: number) => d3.interpolateRainbow(i / 360)).call;

    this.svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [100, 100],
        ])
        .on("zoom", zoomed)
    );

    function zoomed(x: SVGGElement) {
      g.attr("transform", x.transform);
    }
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
