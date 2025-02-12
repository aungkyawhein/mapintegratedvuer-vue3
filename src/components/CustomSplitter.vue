<template>
  <div style="height: 100%; width: 100%">
    <resize-sensor
      @resize="calculateStyles(index)">
    </resize-sensor>
    <splitpanes
      class="default-theme"
      :horizontal="isHorizontal"
      :dbl-click-splitter="false"
    >
      <template v-for="(child) in children">
        <pane :key="child" :ref="child">
          <resize-sensor
            v-if="customLayout[child].content"
            @resize="calculateStyles(child)">
          </resize-sensor>
          <custom-splitter 
            v-else
            :key="child"
            :index="child"
          />
        </pane>
      </template>
    </splitpanes>
  </div>
</template>


<script>
/* eslint-disable no-alert, no-console */
import CustomSplitter from "./CustomSplitter";
import EventBus from './EventBus';
import ResizeSensor from "./ResizeSensor";
import { Splitpanes, Pane } from "splitpanes";
import store from "../store";
import "splitpanes/dist/splitpanes.css";

export default {
  name: "CustomSplitter",
  components: {
    CustomSplitter,
    Splitpanes,
    Pane,
    ResizeSensor
  },
  props: {
    index: {
      type: String,
      default: function() {
        return "split-1";
      }
    }
  },
  methods: {
    requestStylesUpdate: function(refName) {
      if (this.$refs) {
        if (refName in this.$refs && this.$refs[refName] && 
        this.$refs[refName][0] && this.$refs[refName][0].$el) {
          const el = this.$refs[refName][0].$el;
          const rect = el.getBoundingClientRect();
          EventBus.$emit("PaneResize", {refName, rect});
        }
      }
    },
    /**
     * Callback when the vuers emit a selected event.
     */
    calculateStyles: function(refName) {
      if (this.$refs) {
        if (refName.startsWith("pane")) {
          this.requestStylesUpdate(refName);
        } else if (refName.startsWith("split")) {
          this.customLayout[refName].children.forEach((childName) => {
            if (childName.startsWith("pane")) {
               this.requestStylesUpdate(childName);
            }
          });
        }
      }
    },
  },
  computed: {
    children() {
      return this.customLayout[this.index].children;
    },
    customLayout() {
      return store.state.splitFlow.customLayout;
    },
    isHorizontal() {
      return this.customLayout[this.index].horizontal;
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

::v-deep .splitpanes.default-theme .splitpanes__pane {
  background-color: #ccc !important;
  position: relative;
}

::v-deep .splitpanes__splitter {
  margin: 0px 0px 0px 0px !important;
  z-index: 6 !important;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    transition: opacity 0.4s;
    background-color: rgba(131, 0, 191, 0.3) !important;
    opacity: 0;
    z-index: 7 !important;
    &:hover {
      opacity: 1;
    }
  }
}

::v-deep .splitpanes--horizontal > .splitpanes__splitter,
::v-deep .splitpanes--vertical > .splitpanes__splitter {
  background-color: #ccc !important;
  border-left: unset;
}

::v-deep .splitpanes--horizontal > .splitpanes__splitter {
  height: 1px;
  &::before {
    top: -2px;
    height: 10px;
    width: 100%;
  }
}

::v-deep .splitpanes--vertical > .splitpanes__splitter {
  width: 1px;
  &::before {
    left: -3px;
    width: 11px;
    height: 100%;
  }
}

</style>
