<template>
<div>
  <div class="nav">
    <input v-model="name" type="text" placeholder="name">
    <button @click="add" :disabled="this.name === null || this.name === ''">Add</button>
    <button @click="cut" :disabled="selected == null">Remove</button>
    <button @click="dump=!dump">Data</button>
  </div>
  <div>
    <node v-for="entity in tree"
          v-bind:key="entity.identifier"
          :identifier="entity.identifier"
          :attributes="entity.attributes"
          :properties="entity.properties"
          :children="entity.children">
    </node>
  </div>
  <pre v-if="dump" class="dump">{{tree}}</pre>
</div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { createID } from "./helpers";
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
      dump: ref(false),
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
.nav {
  margin-bottom: 15px;
}
.dump {
  font-size: 10px;
}
</style>