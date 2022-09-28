import {mount} from '@vue/test-utils';
import component from '@/Node.vue'
import data from './data.json';

describe( "component", () => {
    const props = {
        properties: { expanded: false },
        attributes: { name: 'the name'},
        children: [ {properties: { expanded: false } } ]
    }

    it("default properties", () => {
        const node = mount(component)
        expect(node.props()).toMatchSnapshot()
    })

    it('expand arrow not showing if empty children', async () => {
        const node = mount(component, {props: { children: [] }})
        expect(node.find('.arrow').exists()).toBeFalsy()
        await node.setProps({ children : [{}]})
        expect(node.find('.arrow').exists()).toBeTruthy()
    })

    it('expand classes', async () => {
        const $store = { dispatch: jest.fn()}
        const node = mount(component, {global: {mocks: { $store }}})
        expect(node.find('.children').exists()).toBeFalsy()
        expect(node.find('.arrow').exists()).toBeFalsy()
        await node.setProps({ properties: { expanded: true }, attributes: { name: 'test'}, children: [{}] })
        expect(node.find('.children').exists()).toBeTruthy()
        expect(node.find('.arrow').classes('arrow-right')).toBeFalsy()
        expect(node.find('.arrow').classes('arrow-down')).toBeTruthy()
        await node.setProps({ properties: { expanded: false }, attributes: { name: 'test'}, children: [{}] })
        expect(node.find('.children').exists()).toBeFalsy()
        expect(node.find('.arrow').classes('arrow-right')).toBeTruthy()
        expect(node.find('.arrow').classes('arrow-down')).toBeFalsy()
    })

    it('expand event', async() => {
        const $store = { dispatch: jest.fn()}
        const mockMethod = jest.spyOn(component.methods, 'expand')
        await mount(component,{global: { mocks: { $store } }, props}).find('.arrow').trigger('click')
        expect(mockMethod).toHaveBeenCalledTimes(1);
    })

    it('expand method', async() => {
        const $store = { dispatch: jest.fn() }
        const node = mount(component, {global: { mocks: { $store } }, props})
        await node.find('.arrow').trigger('click')
        expect($store.dispatch).toHaveBeenCalledTimes(1);
        expect($store.dispatch).toHaveBeenCalledWith('expand', 'the name')
    })

    it("render data", () => {
        let tree = data[0];
        const node = mount(component, {
            props: {
                properties: tree.properties,
                attributes: tree.attributes,
                children: tree.children
            }
        })
        expect(node.html()).toMatchSnapshot()
    })
})