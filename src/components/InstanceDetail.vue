<template>
  <!-- Modal -->
  <div
    :class="canShow"
    id="insSel"
    tabindex="-1"
    role="dialog"
    @keyup.esc="close()"
  >
    <div class="modal-dialog" role="document" style="max-width: 900px">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">
            Instance Detail
          </h5>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- body -->
        <div class="modal-body" style="overflow: auto; height: 600px">
          <table class="table table-striped table-hover">
            <tbody>
              <tr>
                <th scope="row">key:</th>
                <td colspan="2">{{ ins.getKey() }}</td>
                <th scope="row">create time:</th>
                <td colspan="2">{{ time }}</td>
              </tr>
              <tr>
                <td colspan="3">
                  <table class="table">
                    <tbody>
                      <tr>
                        <th scope="row">states:</th>
                        <td colspan="2">{{ ins.data.states }}</td>
                      </tr>
                      <tr>
                        <th scope="row">state_version:</th>
                        <td colspan="2">{{ ins.data.state_version }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td colspan="3">
                  <span class="font-weight-bold">from:</span><br />
                  <textarea
                    class="form-control"
                    rows="5"
                    v-model="from"
                    cols="50"
                  ></textarea>
                </td>
              </tr>
              <tr>
                <th scope="row">context:</th>
                <td colspan="2">{{ ins.data.context }}</td>
                <th scope="row">sys_context:</th>
                <td colspan="2">{{ ins.data.sys_context }}</td>
              </tr>
              <tr>
                <th scope="row">content:</th>
                <td colspan="5">
                  <textarea
                    class="form-control"
                    rows="10"
                    v-model="content"
                    cols="100"
                  ></textarea>
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
      ins: new Instance(),
      from: "",
      content: "",
      time: "",
    };
  },
  methods: {
    show(data: Instance) {
      console.log(data);
      this.ins = data;
      this.from = JSON.stringify(data.data.from, null, "\t");
      this.content = JSON.stringify(data.data.content, null, "\t");
      this.time = new Date(data.create_time).toLocaleString();
      this.canShow = "modal_show";
    },
    close() {
      this.canShow = "modal_hide";
    },
  },
})
export default class InstanceDetail extends Vue {}
</script>
<style lang="stylus">
.modal_show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2100;
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
