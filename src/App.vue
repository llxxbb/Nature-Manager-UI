<template>
  <Logo />
  <show-area />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Logo from "./components/Logo.vue";
import ShowArea from "./components/ShowArea.vue";

@Options({
  components: {
    Logo,
    ShowArea,
  },
})
export default class App extends Vue {}
</script>

<style lang="stylus">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
