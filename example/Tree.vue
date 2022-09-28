<template>
<div>
  <node v-for="(entity, index) in tree"
        v-bind:key="index"
        :attributes="entity.attributes"
        :properties="entity.properties"
        :children="entity.children"
  >
  </node>
</div>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import Node from '@/Node'
import data from '../specs/data.json'

export default {
  name: "Tree",
  components: {
    Node
  },
  setup() {
    const store = useStore()
    store.dispatch("tree", data)
    return {
      tree: computed(() => store.getters.tree),
    }
  }

}
</script>

<style scoped>

</style>