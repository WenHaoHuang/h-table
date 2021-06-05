import Table from './main';
import './style/index.scss';

/* istanbul ignore next */
const install = function(Vue) {
  Vue.component(Table.name, Table);
}

Table.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default Table;
