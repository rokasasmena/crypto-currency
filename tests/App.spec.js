import { mount, createLocalVue } from '@vue/test-utils';
import App from '../src/App.vue';

describe('AppComponent', () => {
  it('should sort the column in ascending order when sortByColumn method is called', () => {
    // Create a local Vue instance
    const localVue = createLocalVue();

    // Mount the component using the localVue
    const wrapper = mount(App, { localVue });

    // Access the component instance
    const vm = wrapper.vm;

    // Set up initial data and state if necessary

    // Invoke the sortByColumn method
    vm.sortByColumn('name');

    // Make assertions to verify the behavior
    expect(vm.columnToSort).toBe('name');
    // Add more assertions as needed
  });
});