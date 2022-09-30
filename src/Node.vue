<template>
<div>
  <div>
    <span v-if="children.length > 0" :class="arrowClass" @click="expand"></span>
    <span v-text="attributes.name" :class="selectedClass" @click="select"></span>
  </div>
  <div v-if="this.properties.expanded" class="children">
    <node
      v-for="(entity,index) in children"
      v-bind:key="index"
      :identifier="entity.identifier"
      :attributes="entity.attributes"
      :children="entity.children"
      :properties="entity.properties"
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
    identifier: {
      type: [Number, String],
      default: () => { return null }
    },
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
    }
  },
  setup(props) {
    return {
      arrowClass: computed(() => {
        let result = {'arrow': true}
        result[props.properties.expanded ? 'arrow-down' : 'arrow-right'] = true
        return result
      }),
      selectedClass: computed(() => {
        let result = {'name': true}
        if (props.properties.selected)
          result['selected'] = true
        return result
      }),
    }
  },
  methods: {
    expand() {
      this.$store.dispatch('expand', this.identifier)
    },
    select() {
      this.$store.dispatch('select', this.identifier)
    }
  }
}
</script>

<style scoped>
.children {
  padding-left: 15px;
}
.arrow {
  cursor: pointer;
  outline: 0;
  padding: 5px 10px 5px 5px;
}
.arrow-right {
  background: url("../assets/caret-right-fill.png") no-repeat center right;
}
.arrow-down {
  background: url("../assets/caret-down-fill.png") no-repeat center right;
}
.name {
  cursor: pointer;
  user-select: none;
}
.selected {
  color: rgb(25, 103, 210)
}
</style>