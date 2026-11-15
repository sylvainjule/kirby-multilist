<template>
    <k-field v-bind="$props" :class="['k-structure-field', 'k-multilist-field', $attrs.class]" :input="false" :style="$attrs.style" @click.stop>
        <template v-if="hasFields && !disabled" #options>
            <k-button-group v-if="isSelecting" :buttons="batchEditingButtons" size="xs" variant="filled" />
            <k-button-group v-else>
                <k-button v-if="canSelect" v-bind="batchEditingToggle" size="xs" variant="filled"/>
                <k-button-group layout="collapsed">
                    <k-button :autofocus="autofocus" :disabled="!more" :responsive="true" :text="$t('add')" icon="add" size="xs" variant="filled" @click="add()" />
                    <k-button icon="dots" size="xs" variant="filled" @click="$refs.options.toggle()" />
                    <k-dropdown ref="options" :options="bulkOptions" align-x="end" />
                </k-button-group>
            </k-button-group>
        </template>

        <k-input-validator v-bind="{ min, max, required }" :value="JSON.stringify(items)">
            <template v-if="hasFields">
                <k-empty v-if="items.length === 0" icon="list-bullet" @click="add()">
                    {{ empty ?? $t('field.structure.empty') }}
                </k-empty>

                <template v-else>
                    <k-multilist-table
                        ref="multilistTable"
                        :columns="columns"
                        :disabled="disabled"
                        :fields="fields"
                        :empty="$t('field.structure.empty')"
                        :index="index"
                        :options="options"
                        :pagination="limit && !isSelecting ? pagination : false"
                        :rows="paginatedItems"
                        :selecting="isSelecting"
                        :sortable="isSortable && !isSelecting"
                        @add="add()"
                        @cell="open($event.row, $event.columnIndex)"
                        @input="onTableInput"
                        @option="option"
                        @paginate="paginate"
                        @select="onSelect" />

                    <footer v-if="more">
                        <k-button :title="$t('add')" icon="add" size="xs" variant="filled" @click="add()" />
                    </footer>
                </template>
            </template>
            <k-empty v-else icon="list-bullet">{{ $t('fields.empty') }}</k-empty>
        </k-input-validator>
    </k-field>
</template>

<script>
import { mergeEditedRows } from '../helpers/rows.mjs';


export default {
    extends: 'k-structure-field',
    inheritAttrs: false,
    emits: ['input'],
    data() {
        return {
            skipSort: false
        };
    },
    computed: {
        bulkOptions() {
            return [
                {
                    click: () => this.add(),
                    disabled: !this.more,
                    icon: 'add',
                    text: this.$t('add')
                },
                {
                    click: () => this.removeAll(),
                    disabled: this.items.length === 0 || this.disabled,
                    icon: 'trash',
                    text: this.$t('delete.all')
                }
            ];
        }
    },
    methods: {
        add(value = null) {
            if(!this.more) return false;

            const row = {
                ...(value ?? this.$helper.field.form(this.fields)),
                _id: value?._id ?? this.$helper.uuid()
            };

            if(this.prepend) {
                this.items.unshift(row);
                if(this.limit) this.page = 1;
            } else {
                this.items.push(row);
                if(this.limit) this.page = Math.ceil(this.items.length / this.limit);
            }

            this.save();
            this.$nextTick(() => this.focusRow(row._id));
            return true;
        },
        focusRow(id) {
            const root = this.$refs.multilistTable?.$el;
            if(!root) return;
            const row = Array.from(root.querySelectorAll('[data-id]'))
                .find((element) => element.dataset.id === String(id));
            row?.querySelector('input:not([type="hidden"]), textarea, select, button')?.focus();
        },
        onTableInput(editedRows) {
            const rows = mergeEditedRows(
                this.items,
                editedRows,
                this.limit ? this.pagination.offset : 0,
                this.limit,
                () => this.$helper.uuid()
            );
            this.items = rows;
            this.save(rows);
        },
        open(item, field, replace = false) {
            const index = this.findIndex(item);
            if(this.disabled || index === -1) return false;

            this.stopSelecting?.();
            this.$panel.drawer.open({
                component: 'k-structure-drawer',
                id: this.id,
                props: {
                    disabled: this.disabled,
                    icon: this.icon ?? 'list-bullet',
                    next: this.items[index + 1],
                    prev: this.items[index - 1],
                    tabs: { content: { fields: this.form(field) } },
                    title: this.label,
                    value: item
                },
                replace,
                on: {
                    input: (value) => {
                        const currentIndex = this.findIndex(item);
                        if(currentIndex === -1) return;
                        const previous = this.items[currentIndex];
                        this.items.splice(currentIndex, 1, {
                            ...value,
                            _id: previous._id
                        });
                        const next = this.items[currentIndex + 1];
                        const prev = this.items[currentIndex - 1];
                        this.$panel.drawer.props.next = next;
                        this.$panel.drawer.props.prev = prev;
                        this.save();
                    },
                    next: () => this.navigate(item, 1),
                    prev: () => this.navigate(item, -1),
                    remove: () => this.remove(item)
                }
            });
            return true;
        },
        save(values = this.items) {
            this.skipSort = true;
            this.$emit('input', values);
            this.$nextTick(() => {
                this.skipSort = false;
            });
        },
        toItems(value) {
            if(!Array.isArray(value)) return [];
            const rows = value.map((row) => ({
                ...row,
                _id: row._id ?? this.$helper.uuid()
            }));
            return this.skipSort ? rows : this.sort(rows);
        }
    }
};
</script>

<style lang="scss">
    @import '../assets/css/styles.scss';
</style>
