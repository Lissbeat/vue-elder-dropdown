import DropdownComponent from './src/component.vue'

const Options = {}

const install = Vue => {
  Vue.component('dropdown-component', DropdownComponent)
}

const setup = options => {
  for (let key in options) {
    if (!(key in Options)) return
    Options[key] = options[key]
  }
}

export default {
  install,
}

export { DropdownComponent, install as DropdownComponentInstaller, setup, Options }
