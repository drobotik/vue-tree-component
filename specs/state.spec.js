import {getters, mutations, actions, state, search, deselectAll} from '@/tree.state'
import { testAction } from "./utils";
import data from './data.json';

describe("utils", () => {

    it("search", () => {
        search(data, 'Miguel de Cervantes', function (parent) {
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
})

describe("getters", () => {

    it('tree', () => {
        const state = { tree: 1 }
        const result = getters.tree(state)
        expect(result).toBe(state.tree)
    });
})

describe('mutations', () => {

    let state
    beforeEach(() => {
        state = { tree : JSON.parse(JSON.stringify(data)) }
    });

    it('set tree data', () => {
        mutations.tree(state,'two')
        expect(state.tree).toEqual('two')
    })

    it('add entity', async () => {
        await mutations.add(state,{
            to:"Alexandre Dumas",
            entity: { attributes: { name:'Catherine Blum'}, children: [], properties: {} }
        })
        expect(state.tree).toMatchSnapshot();
    })

    it('expand entity', () => {
        mutations.expand(state, "Adventure")
        expect(state.tree[0].children[2].properties.expanded).toBeTruthy();
        mutations.expand(state, "Adventure")
        expect(state.tree[0].children[2].properties.expanded).toBeFalsy();
    })

    it('select entity', () => {
        mutations.select(state, "Adventure")
        expect(state.tree[0].children[2].properties.selected).toBeTruthy();
        mutations.select(state, "Fantastic")
        expect(state.tree[0].children[0].properties.selected).toBeTruthy();
    })

    it('deselect all entities', () => {
        state.tree[0].properties.selected = true;
        state.tree[0].children[2].properties.selected = true;
        state.tree[0].children[2].children[0].properties.selected = true;
        mutations.deselectAll(state)
        expect(state.tree[0].properties.selected).toBeFalsy();
        expect(state.tree[0].children[2].properties.selected).toBeFalsy();
        expect(state.tree[0].children[2].children[0].properties.selected).toBeFalsy();
    })

    it('cut entity', async() => {
        expect(state.tree[0].children[2].children[1].children).toEqual([]);
        await mutations.cut(state, "Miguel de Cervantes")
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
        const payload = {to:"Test", entity: {children:[]}}
        testAction(actions.add, payload, state, [
            { type: 'add', payload },
        ], done)
    })

    it("toggle entity", done => {
        const name = "Test"
        testAction(actions.expand, name, state, [
            { type: 'expand', payload: name },
        ], done)
    })

    it("select entity", done => {
        const name = "Test"
        testAction(actions.select, name, state, [
            { type: 'deselectAll', payload: undefined },
            { type: 'select', payload: name },
        ], done)
    })

    it("cut entity", done => {
        const name = "Test"
        testAction(actions.cut, name, state, [
            { type: 'cut', payload: name },
        ], done)
    })
})
