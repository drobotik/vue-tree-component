<template>
<div>
  <div>
    <span :class="arrowClass" @click="expand"></span>
    <span v-text="attributes.name"></span>
  </div>
  <div v-if="this.properties.expanded" class="children">
    <node
      v-for="(entity,index) in children"
      v-bind:key="index"
      :attributes="entity.attributes"
      :children="entity.children"
      :properties="entity.properties"
      :depth="depth + 1"
    >
    </node>
  </div>
</div>
</template>

<script>
import {computed} from "vue";

export default {
  name: "Node",
  props: {
    attributes: {
      type: Object,
      default: () => { return {} }
    },
    properties: {
      type: Object,
      default: () => {
        return {
          expanded: false,
          selected: false
        }
      }
    },
    children: {
      type: Array,
      default: () => { return [] }
    },
    depth: {
      type: Number,
      default: () => { return 0 }
    }
  },
  setup(props) {
    return {
      arrowClass: computed(() => {
          let result = {'arrow': true}
          result[props.properties.expanded ? 'arrow-down' : 'arrow-right'] = true
          return result
      })
    }
  },
  methods: {
    expand() {
      this.$store.dispatch('toggle', this.attributes.name)
    }
  }
}
</script>

<style scoped>
.children {
  padding-left: 8px;
}
.arrow {
  outline: 0;
  padding: 5px 25px 5px 5px;
}
.arrow-right {
  background: url("./assets/caret-right-fill.png") no-repeat center right;
}
.arrow-down {
  background: url("./assets/caret-down-fill.png") no-repeat center right;
}
</style>