import {createStore} from 'vuex'
export const search = (items, name, callback, siblings = false) => {
    for (let n = items.length - 1; n >= 0; n--) {
        if(items[n].attributes.name === name) {
            siblings
              ? callback(items, n)
              : callback(items[n])
            return true
        } else if(search(items[n].children, name, callback, siblings)) return true;
    }
    return false
}

export const deselectAll = (items) => {
    for (let n = items.length - 1; n >= 0; n--) {
        items[n].properties.selected = false
        deselectAll(items[n].children)
    }
    return items
}

export const state = () => {
    return {
        tree: {}
    }
}

export const getters = {
    tree: state => state.tree
}

export const actions = {
    tree({commit}, payload) {
        commit('tree', payload)
    },
    add({commit}, payload) {
        commit('add', payload)
    },
    toggle({commit}, name) {
        commit('toggle', name)
    },
    select({commit}, name) {
        commit('deselectAll')
        commit('select', name)
    },
    cut({commit}, name) {
        commit('cut', name)
    }
}

export const mutations = {
    tree(state, tree) {
        state.tree = tree
    },

    add(state, payload) {
        search(state.tree, payload.to, (parent) => {
            parent.children.push(payload.entity)
        })
    },

    toggle(state, name) {
        search(state.tree, name, (parent) => {
            parent.properties.expanded = !parent.properties.expanded
        })
    },

    deselectAll(state) {
        deselectAll(state.tree)
    },

    select(state, name) {
        search(state.tree, name, (parent) => {
            parent.properties.selected = !parent.properties.selected
        })
    },

    cut(state, name) {
        search(state.tree, name, (siblings, index) => {
            siblings.splice(index, 1)
        }, true)
    }
}

export const store = createStore({
    strict: true,
    state,
    actions,
    mutations,
    getters
})
