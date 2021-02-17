<template>
  <div id="settings-border" v-show="show" :style="{ top: top + 'px', left: left + 'px' }">
    <table class="table">
      <tbody>
        <tr v-show="meta?.name">
          <th scope="row">key:&ensp;</th>
          <td>{{ meta?.name }}</td>
        </tr>
        <tr v-show="meta?.states" class="text-wrap">
          <th scope="row">states:&ensp;</th>
          <td class="wrap">{{ meta?.states }}</td>
        </tr>
        <tr v-show="meta?.fields">
          <th scope="row">fields:&ensp;</th>
          <td class="wrap">{{ meta?.fields }}</td>
        </tr>
        <tr v-show="meta?.config">
          <th scope="row">config:&ensp;</th>
          <td class="wrap">{{ meta?.config }}</td>
        </tr>
        <tr v-show="meta?.create_time">
          <th scope="row">created:&ensp;</th>
          <td>{{ meta?.create_time }}</td>
        </tr>
        <tr v-show="meta?.description">
          <th scope="row">desc:&ensp;</th>
          <td class="wrap">{{ meta?.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { D3Node, DataType } from "@/domain/node";
import { Vue, Options } from "vue-class-component";

@Options({
  data() {
    return {
      meta: undefined,
      left: 0,
      top: 0,
      show: false,
    };
  },
  methods: {
    setPara(node: D3Node, x: number, y: number) {
      this.meta = undefined;
      if (!node) return;
      if (!node.data) return;
      if (node.data.dataType != DataType.META) return;
      this.meta = node.data.data;
      this.left = x;
      this.top = y;
      this.show = true;
    },
    hide() {
      this.show = false;
    },
  },
})
export default class MetaToolTip extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#settings-border {
  position: fixed;
  z-index: 100;
  background-attachment: fixed;
  margin: auto;
  top: 100px;
  left: 0px;
  width: 400px;
  border: 2px solid #fefe90;
  border-radius: 15px;
  background-color: rgba(254, 210, 190, 1);
}

.table td, .table th {
  padding: 0rem;
}

.wrap {
  word-break: break-all;
}
</style>
