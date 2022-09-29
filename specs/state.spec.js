import {getters, mutations, actions, state, search, deselectAll} from '@/tree.state'
import { testAction } from "./utils";
import data from './data.json';

describe("utils", () => {

    it("search", () => {
        search(data, 5, function (parent) {
            expect(parent).toMatchSnapshot();
        });
    })

    it("unselect", () => {
        let data = [
            {properties: {selected:false}, children: [
                {properties: {selected:true}, children: [
                    {properties: {selected:true}, children: []},
                ]},
            ]},
        ]
        expect(deselectAll(data)).toMatchSnapshot();
    })
})

describe("state", () => {

    it("tree", () => {
        expect(state().hasOwnProperty("tree")).toBeTruthy()
    })

    it("selected", () => {
        expect(state().hasOwnProperty("selected")).toBeTruthy()
    })
})

describe("getters", () => {

    it('tree', () => {
        const state = { tree: 1 }
        const result = getters.tree(state)
        expect(result).toBe(state.tree)
    });

    it('tree', () => {
        const state = { selected: 1 }
        const result = getters.selected(state)
        expect(result).toBe(state.selected)
    });
})

describe('mutations', () => {

    let state
    beforeEach(() => {
        state = {
            tree : JSON.parse(JSON.stringify(data)),
            selected: null
        }
    });

    it('set tree data', () => {
        mutations.tree(state,'two')
        expect(state.tree).toEqual('two')
    })

    it('add to entity', async () => {
        await mutations.add(state,{
            to: 7,
            entity: { attributes: { name:'Catherine Blum'}, children: [], properties: {} }
        })
        expect(state.tree).toMatchSnapshot();
    })

    it('add to selected entity', async () => {
        state.selected = 2
        await mutations.add(state,{
            entity: { attributes: { name:'Catherine Blum'}, children: [], properties: {} }
        })
        expect(state.tree).toMatchSnapshot();
    })

    it('expand entity', () => {
        mutations.expand(state, 4)
        expect(state.tree[0].children[2].properties.expanded).toBeTruthy();
        mutations.expand(state, 4)
        expect(state.tree[0].children[2].properties.expanded).toBeFalsy();
    })

    it('select entity', () => {
        expect(state.selected).toBeNull();
        mutations.select(state, 4)
        expect(state.tree[0].children[2].properties.selected).toBeTruthy();
        expect(state.selected).toBe(4);
        mutations.select(state, 2)
        expect(state.tree[0].children[2].properties.selected).toBeFalsy();
        expect(state.tree[0].children[0].properties.selected).toBeTruthy();
        expect(state.selected).toBe(2);
        // select same (deselect)
        mutations.select(state, 2)
        expect(state.tree[0].children[0].properties.selected).toBeFalsy();
        expect(state.selected).toBeNull();
    })

    it('deselect all entities', () => {
        state.selected = 2
        state.tree[0].properties.selected = true;
        state.tree[0].children[2].properties.selected = true;
        state.tree[0].children[2].children[0].properties.selected = true;
        mutations.deselectAll(state)
        expect(state.tree[0].properties.selected).toBeFalsy();
        expect(state.tree[0].children[2].properties.selected).toBeFalsy();
        expect(state.tree[0].children[2].children[0].properties.selected).toBeFalsy();
        expect(state.selected).toBeNull();
    })

    it('cut entity', async() => {
        expect(state.tree[0].children[2].children[1].children).toEqual([]);
        await mutations.cut(state, 5)
        expect(state.tree).toMatchSnapshot();
    })

    it('cut selected entity', async() => {
        state.selected = 5
        await mutations.cut(state)
        expect(state.tree).toMatchSnapshot();
    })
})

describe("actions", () => {

    let state
    beforeEach(() => {
        state = { tree : JSON.parse(JSON.stringify(data)) }
    });

    it("set tree", done => {
        const payload = {tree: "two"}
        testAction(actions.tree, payload, state, [
            { type: 'tree', payload },
        ], done)
    })

    it("add entity", done => {
        const payload = {to:1, entity: {children:[]}}
        testAction(actions.add, payload, state, [
            { type: 'add', payload },
        ], done)
    })

    it("toggle entity", done => {
        testAction(actions.expand, 1, state, [
            { type: 'expand', payload: 1 },
        ], done)
    })

    it("select entity", done => {
        testAction(actions.select, 1, state, [
            { type: 'select', payload: 1 },
        ], done)
    })

    it("cut entity", done => {
        testAction(actions.cut, 1, state, [
            { type: 'cut', payload: 1 },
        ], done)
    })
})
