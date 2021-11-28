// import Vue from 'vue';
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// // import DataTables and DataTablesServer together
// import VueDataTables from '~/node_modules/vue-data-tables'
// Vue.use(VueDataTables)

// Vue.use(ElementUI)

import Vue from 'vue';
import VuejsSimpleDatatable from "~/node_modules/vuejs-simple-datatable";
Vue.use(VuejsSimpleDatatable);

/*
REJECT 1
import Vue from 'vue';
import { VuejsDatatableFactory } from '~/node_modules/vuejs-datatable'

Vue.use(VuejsDatatableFactory);

VuejsDatatableFactory
  .registerTableType('my-awesome-table', tableType => {
    tableType
      .mergeSettings()
      .setFilterHandler()
      .setSortHandler();
  });
*/
