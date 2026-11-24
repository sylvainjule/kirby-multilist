<template>
    <div :aria-disabled="disabled" :class="['k-table', 'k-multilist-table', $attrs.class]" :style="$attrs.style">
        <table :data-disabled="disabled" :data-indexed="true" :data-selecting="selecting">
            <thead>
                <tr>
                    <th data-mobile="true" class="k-table-index-column" scope="col">#</th>
                    <th v-for="([key, column], columnIndex) in visibleColumns"
                        :key="key"
                        :data-align="column.align"
                        :data-column-id="key"
                        :data-mobile="mobileColumn(column, columnIndex) ? 'true' : 'false'"
                        :style="{ width: width(column.width) }"
                        class="k-table-column"
                        scope="col">
                        {{ column.label ?? fields[key]?.label ?? key }}
                    </th>
                    <th data-mobile="true" class="k-table-options-column" scope="col" />
                </tr>
            </thead>

            <k-draggable :list="dragRows" :options="dragOptions" :handle="true" element="tbody" @start="onSortStart" @end="onSortEnd">
                <tr v-if="rows.length === 0">
                    <td :colspan="visibleColumns.length + 2" class="k-table-empty">{{ empty }}</td>
                </tr>
                <tr v-else v-for="(row, rowIndex) in dragRows" :key="row._id ?? row.id ?? rowIndex" :data-id="row._id ?? row.id" :data-sortable="sortable" :class="{ 'k-table-sortable-row': sortable }">
                    <td data-mobile="true" class="k-table-index-column">
                        <span class="k-table-index">{{ index + rowIndex }}</span>
                        <k-sort-handle v-if="sortable && !disabled && !selecting" class="k-table-sort-handle" />
                    </td>

                    <td v-for="([key, column], columnIndex) in visibleColumns"
                        :key="key"
                        class="k-multilist-field-column"
                        :data-mobile="mobileColumn(column, columnIndex) ? 'true' : 'false'"
                        :data-align="column.align"
                        :style="{ width: width(column.width) }"
                        @dblclick.stop="$emit('cell', { row, columnIndex: key })">

                        <component :is="'k-' + fields[key].type + '-field'"
                                   v-if="canInline(fields[key]?.type) && !selecting"
                                   v-bind="fields[key]"
                                   :name="`${key}-${row._id ?? rowIndex}`"
                                   :label="false"
                                   :disabled="disabled || fields[key].disabled === true"
                                   :value="row[key]"
                                   @input="updateCell(row, key, $event)"
                                   @keydown.shift.enter.prevent.stop="$emit('add')" />

                        <button v-else-if="!selecting"
                                class="k-multilist-fallback"
                                type="button"
                                :disabled="disabled"
                                @click="$emit('cell', { row, columnIndex: key })">
                            {{ preview(row[key]) }}
                        </button>
                        <span v-else>{{ preview(row[key]) }}</span>
                    </td>
                    <td data-mobile="true" class="k-table-options-column">
                        <label v-if="selecting" class="k-table-select-checkbox">
                            <input type="checkbox" :disabled="disabled" :checked="selected.includes(row._id)" @change="toggleSelection(row._id)" />
                        </label>
                        <k-options-dropdown
                            v-else-if="!disabled && options?.length"
                            :options="row.options ?? options"
                            :text="(row.options ?? options).length > 1"
                            @option="$emit('option', $event, row, rowIndex)"
                        />
                    </td>
                </tr>
            </k-draggable>
        </table>

        <k-pagination v-if="pagination" class="k-table-pagination" v-bind="pagination" @paginate="$emit('paginate', $event)"/>
    </div>
</template>

<script>
import { moveRow } from '../helpers/rows.mjs';

export default {
    inheritAttrs: false,
    emits: ['add', 'cell', 'input', 'option', 'paginate', 'select'],
    props: {
        columns: { type: [Object, Array], default: () => ({}) },
        disabled: Boolean,
        empty: String,
        fields: { type: [Object, Array], default: () => ({}) },
        index: { type: Number, default: 1 },
        options: { type: Array, default: () => [] },
        pagination: { type: [Object, Boolean], default: false },
        rows: { type: Array, default: () => [] },
        selected: { type: Array, default: () => [] },
        selecting: Boolean,
        sortable: Boolean
    },
    data() {
        return {
            dragRows: [],
            beforeDrag: []
        };
    },
    computed: {
        visibleColumns() {
            const configured = Object.keys(this.columns ?? {}).length ? this.columns : this.fields;
            const entries = Object.entries(configured ?? {});
            return entries
                .filter(([key, column]) => column !== false && !!this.fields[key])
                .map(([key, column]) => [key, typeof column === 'string' ? { label: column } : (column ?? {})]);
        },
        dragOptions() {
            return {
                animation: 150,
                disabled: !this.sortable || this.disabled || this.selecting,
                handle: '.k-sort-handle'
            };
        }
    },
    watch: {
        rows: {
            handler(rows) {
                this.dragRows = rows.map((row) => ({ ...row }));
            },
            immediate: true
        }
    },
    methods: {
        mobileColumn(column, index) {
            return column.mobile === true || (index === 0 && column.mobile !== false);
        },
        width(value) {
            if (value == null || value === '') return undefined;
            if (typeof value === 'string' && /^\d+\/\d+$/.test(value)) {
                const [numerator, denominator] = value.split('/').map(Number);
                return denominator > 0 ? `${(numerator / denominator) * 100}%` : undefined;
            }
            return typeof value === 'number' ? `${value}px` : value;
        },
        canInline(type) {
            return [
                'color', 'date', 'email', 'multiselect', 'number', 'range',
                'select', 'slug', 'tel', 'text', 'time', 'tags', 'toggle', 'url'
            ].includes(type) && (this.$helper.isComponent?.(`k-${type}-field`) ?? true);
        },
        preview(value) {
            if (value == null) return '';
            if (Array.isArray(value)) return value.join(', ');
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
        },
        updateCell(row, field, value) {
            const rows = this.dragRows.map((item) =>
                item._id === row._id ? { ...item, [field]: value } : { ...item }
            );
            this.dragRows = rows;
            this.$emit('input', rows);
        },
        onSortStart() {
            this.beforeDrag = this.rows.map((row) => ({ ...row }));
        },
        onSortEnd(event) {
            if (!this.sortable || this.disabled || this.selecting) return;
            const from = event?.oldIndex;
            const to = event?.newIndex;
            if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return;
            const rows = moveRow(
                this.beforeDrag.length ? this.beforeDrag : this.rows,
                from,
                to
            );
            this.dragRows = rows;
            this.$emit('input', rows);
        },
        toggleSelection(id) {
            const selected = this.selected.includes(id)
                ? this.selected.filter(item => item !== id)
                : [...this.selected, id];

            this.$emit('select', selected);
        },
    }
};
</script>
