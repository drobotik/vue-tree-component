<template>
<div>
  <div style="margin-bottom: 30px">
    <div>
      <input v-model="name" type="text" placeholder="name" >
      <button @click="add" :disabled="selected == null">Add</button>
      <button @click="cut" :disabled="selected == null">Remove</button>
    </div>
  </div>
  <div>
    <node v-for="(entity, index) in tree"
          v-bind:key="index"
          :identifier="entity.identifier"
          :attributes="entity.attributes"
          :properties="entity.properties"
          :children="entity.children"
    >
    </node>
  </div>
</div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import Node from '@/Node'
import data from '../specs/data.json'

const maxId = ({identifier, children = []}) => {
  return Math.max (identifier, ...children.map(maxId))
}

export const createID = (items) => {
  let number = 0
  for (let n = items.length - 1; n >= 0; n--) {
    let max = maxId(items[n])
    if(max > number)
      number = max
  }
  return number + 1
}

export default {
  name: "Tree",
  components: {
    Node
  },
  setup() {
    const store = useStore()
    store.dispatch("tree", data)
    return {
      name: ref(null),
      tree: computed(() => store.getters.tree),
      selected: computed(() => store.getters.selected),
      add() {
        store.dispatch('add', {
          entity: {
            identifier: createID(store.getters.tree),
            attributes: { name: this.name },
            properties: {},
            children: []
          }
        })
      },
      cut() {
        store.dispatch('cut')
      }
    }
  }
}
</script>

<style scoped>

</style>