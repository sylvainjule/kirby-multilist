<template>
    <div :aria-disabled="disabled" :class="['k-table', 'k-multilist-table', $attrs.class]" :style="$attrs.style" >
        <table :data-disabled="disabled" :data-indexed="hasIndexColumn" :data-selecting="selecting">
            <!-- <same> -->
            <thead>
                <tr>
                    <th v-if="hasIndexColumn" data-mobile="true" class="k-table-index-column">#</th>

                    <th v-for="(column, columnIndex) in columns"
                        :key="columnIndex + '-header'"
                        :data-align="column.align"
                        :data-column-id="columnIndex"
                        :data-mobile="column.mobile"
                        :style="{ width: width(column.width) }"
                        class="k-table-column"
                        @click="onHeader({column, columnIndex})">
                        <slot name="header" v-bind="{column, columnIndex, label: label(column, columnIndex)}">
                            {{ label(column, columnIndex) }}
                        </slot>
                    </th>

                    <th v-if="hasOptions" data-mobile="true" class="k-table-options-column"></th>
                </tr>
            </thead>

            <k-draggable :list="values" :options="dragOptions" :handle="true" element="tbody" 
                         @change="onChange" @end="onSort">

                <tr v-if="rows.length === 0">
                    <td :colspan="colspan" class="k-table-empty">
                        {{ empty }}
                    </td>
                </tr>

                <template v-else>
                    <tr v-for="(row, rowIndex) in values"
                        :key="row.id ?? row._id ?? row.value ?? JSON.stringify(row)"
                        :class="{'k-table-sortable-row': rowIsSortable(row)}"
                        :data-id="row.id ?? row._id ?? row.value ?? JSON.stringify(row)"
                        :data-selecting="selecting"
                        :data-selectable="rowIsSelectable(row)"
                        :data-sortable="rowIsSortable(row)">

                        <td v-if="hasIndexColumn" data-mobile="true" class="k-table-index-column">
                            <slot name="index" v-bind="{row, rowIndex}">
                                <div class="k-table-index" v-text="index + rowIndex" />
                            </slot>
                            <k-sort-handle v-if="rowIsSortable(row)" class="k-table-sort-handle"/>
                        </td>
                        <!-- </same> -->



                        <td v-for="(column, columnName) in columns" :id="columnName" :key="columnName" class="k-multilist-field-column" :mobile="column.mobile" :data-mobile="column.mobile" :style="{ width: width(column.width) }">
                            <component
                                  :is="'k-' + fields[columnName].type + '-field'"
                                  v-if="hasFieldType(fields[columnName].type)"
                                  :ref="'list-'+ fields[columnName].name +'-'+ rowIndex"
                                  v-model="value[rowIndex][columnName]"
                                  @input="$emit('input', value)"
                                  :name="columnName"
                                  :novalidate="novalidate"
                                  :disabled="disabled"
                                  :label="false"
                                  v-bind="fields[columnName]"
                                  @keydown.shift.enter.prevent="addItem"
                                  @keyup="onKeyup(index, columnName, fields[columnName], $event)" />
                        </td>



                        <!-- <same> -->
                        <td v-if="hasOptions" data-mobile="true" class="k-table-options-column">
                            <template v-if="selecting">
                                <label class="k-table-select-checkbox">
                                    <input :disabled="row.selectable === false" type="checkbox"
                                        @change="$emit('select', row, rowIndex)" />
                                </label>
                            </template>

                            <template v-else>
                                <slot name="options" v-bind="{ row, rowIndex }">
                                    <k-options-dropdown :options="row.options ?? options" :text="(row.options ?? options).length > 1" @option="onOption($event, row, rowIndex)" />
                                </slot>
                            </template>
                        </td>
                    </tr>
                </template>
            </k-draggable>
        </table>

        <k-pagination v-if="pagination" class="k-table-pagination" v-bind="pagination" @paginate="$emit('paginate', $event)" />
        <!-- </same> -->
    </div>
</template>


<script>
export default {
    extends: 'k-table',
    props: {
        value: Object
    },
    methods: {
        hasFieldType(type) {
            return this.$helper.isComponent('k-'+ type +'-field')
        },
    }
}
</script>