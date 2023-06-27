import { mount, createLocalVue } from '@vue/test-utils';
import App from '../src/App.vue';

describe('AppComponent', () => {
  it('should sort the column in ascending order when sortByColumn method is called', () => {
    const localVue = createLocalVue();

    const wrapper = mount(App, { localVue });

    const vm = wrapper.vm;

    vm.sortByColumn('name');

    expect(vm.columnToSort).toBe('name');
  });
});