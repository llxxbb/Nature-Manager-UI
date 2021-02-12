<template>
  <!-- Modal -->
  <div :class="canShow" id="insSel" tabindex="-1" role="dialog">
    <div
      class="modal-dialog"
      role="document"
      style="max-width: 900px"
    >
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">
            recent Instance
          </h5>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- body -->
        <div class="modal-body" style="overflow: auto; height: 600px">
          <!-- <div class="modal-body"> -->
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">key</th>
                <th scope="col">status</th>
                <th scope="col">query data flow</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in instances" :key="item.getKey()">
                <th scope="row">{{ item.getKey() }}</th>
                <td>{{ item.data.states }}</td>
                <td>
                  <button type="button" class="btn btn-success">Go</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close()">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Instance } from "@/domain/instance";
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {
      canShow: "modal_hide",
      instances: [],
    };
  },
  methods: {
    show(data: Instance[]) {
      this.instances = [];
      data.forEach((d) =>
        this.instances.push(Object.assign(new Instance(), d))
      );
      this.canShow = "modal_show";
    },
    close() {
      this.canShow = "modal_hide";
    },
  },
})
export default class InstanceSelector extends Vue {}
</script>
<style lang="stylus">
.modal_show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.modal_hide {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: none;
}
</style>
