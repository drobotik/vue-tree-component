import { mount } from '@vue/test-utils';
import component from '@/Node.vue'
import data from './data.json';
const $store = {
    dispatch: jest.fn()
}
describe( "component", () => {


    it("default properties", () => {
        const node = mount(component)
        expect(node.props()).toMatchSnapshot()
    })

    it('expand classes', async () => {
        const node = mount(component, {global: {mocks: { $store }}})
        expect(node.find('.arrow').classes()).toContain('arrow-right')
        expect(node.find('.children').exists()).toBeFalsy()
        await node.setProps({ properties: { expanded: true }, attributes: { name: 'test'}, children: [] })
        expect(node.find('.children').exists()).toBeTruthy()
        expect(node.find('.arrow').classes('arrow-right')).toBeFalsy()
        expect(node.find('.arrow').classes('arrow-down')).toBeTruthy()
        await node.setProps({ properties: { expanded: false }, attributes: { name: 'test'}, children: []  })
        expect(node.find('.children').exists()).toBeFalsy()
        expect(node.find('.arrow').classes('arrow-right')).toBeTruthy()
        expect(node.find('.arrow').classes('arrow-down')).toBeFalsy()
    })

    it('expand event', async() => {
        const node = mount(component, {global: {mocks: { $store }}})
        node.vm.expand = jest.fn();
        await node.find('.arrow').trigger('click')
        expect(node.vm.expand).toHaveBeenCalledTimes(1);
    })

    it('expand method', async() => {
        const node = mount(component, {global: {mocks: { $store }}})
        await node.setProps({ attributes: { name: 'the name'} })
        node.vm.expand()
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