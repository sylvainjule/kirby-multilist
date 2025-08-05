import Multilist      from './fields/Multilist.vue'
import MultilistTable from './components/MultilistTable.vue'

panel.plugin('sylvainjule/multilist', {
    fields: {
        'multilist': Multilist,
    },
    components: {
        'k-multilist-table': MultilistTable,
    }
});
