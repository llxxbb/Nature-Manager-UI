<template>
  <!-- Modal -->
  <div
    :class="canShow"
    id="insSel"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">recent Instance</h5>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">...</div>
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
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {
      canShow: "modal_hide",
    };
  },
  props: {
    msg: String,
  },
  methods: {
    show() {
      this.canShow = "modal_show";
    },
    close() {
      this.canShow = "modal_hide";
    },
  },
})
export default class InstanceSelector extends Vue {
  msg!: string;
}
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
</style>>
