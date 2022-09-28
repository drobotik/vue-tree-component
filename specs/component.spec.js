import { mount } from '@vue/test-utils';
import component from '@/Node.vue'
import data from './data.json';
import {store} from "@/tree.state";

describe( "component", () => {

    it("default properties", () => {
        const node = mount(component)
        expect(node.props()).toMatchSnapshot()
    })

    it('toggle', async () => {
        const node = mount(component, {global: {plugins: [store]}})
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