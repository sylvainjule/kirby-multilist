<template>
    <!-- <same> -->
    <k-field v-bind="$props" class="k-structure-field" @click.native.stop>
        <template v-if="hasFields && !disabled" #options>
            <k-button-group layout="collapsed">
                <k-button :autofocus="autofocus" :disabled="!more" :responsive="true" :text="$t('add')"
                          icon="add" variant="filled" size="xs" @click="add()" />
                <k-button icon="dots" size="xs" variant="filled" @click="$refs.options.toggle()" />
                <k-dropdown-content ref="options" :options="[
                        {
                            click: () => add(),
                            disabled: !more,
                            icon: 'add',
                            text: $t('add')
                        },
                        {
                            click: () => removeAll(),
                            disabled: items.length === 0 || disabled,
                            icon: 'trash',
                            text: $t('delete.all')
                        }
                    ]" align-x="end" />
            </k-button-group>
        </template>

        <k-input-validator v-bind="{ min, max, required }" :value="JSON.stringify(items)">
            <template v-if="hasFields">
                <k-empty v-if="items.length === 0" icon="list-bullet" @click="add()">
                    {{ empty ?? $t("field.structure.empty") }}
                </k-empty>

                <template v-else>
                <!-- </same> -->

                    <k-multilist-table
                        :columns="columns"
                        :disabled="disabled"
                        :fields="fields"
                        :empty="$t('field.structure.empty')"
                        :index="index"
                        :options="options"
                        :pagination="limit ? pagination : false"
                        :rows="paginatedItems"
                        :sortable="isSortable"
                        :value="paginatedItems"
                        ref="multilist-table"
                        @cell="open($event.row, $event.columnIndex)"
                        @input="onTableInput"
                        @option="option"
                        @paginate="paginate" />

                    <!-- <same> -->
                    <footer v-if="more">
                        <k-button :title="$t('add')" icon="add" size="xs" variant="filled" @click="add()" />
                    </footer>
                </template>
            </template>

            <template v-else>
                <k-empty icon="list-bullet">{{ $t("fields.empty") }}</k-empty>
            </template>
        </k-input-validator>
    </k-field>
    <!-- </same> -->
</template>

<script>
export default {
    extends: 'k-structure-field',
    data() {
        return {
            needsItemsSync: false,
            skipSort: false
        }
    },
    methods: {
        add(value = null) {
            // ↓ same
            if (this.more === false) {
                return false;
            }

            value = value ?? this.$helper.field.form(this.fields);

            // add a unique id, if it's not already defined
            value._id = value._id ?? this.$helper.uuid();

            if (this.prepend === true) {
                this.items.unshift(value);
            } else {
                this.items.push(value);
            }

            this.save();
            // ↑ same

            this.setFocus(value)
        },
        onTableInput(values) {
            // keep the existing _id
            var valuesArray = Object.values(values).map((item, index) => {
                const originalItem = this.items[index];
                return {
                    ...item,
                    _id: item._id || (originalItem && originalItem._id) || this.$helper.uuid()
                };
            });

            this.value = valuesArray

            if (this.limit) {
                valuesArray = this.items.toSpliced(
                    this.pagination.offset,
                    this.limit,
                    ...valuesArray
                );
            }

            this.needsItemsSync = true
            this.save(valuesArray);
        },
        open(item, field, replace = false) {
            // prevent running the toItems methods on first load
            // else drawer wouldn't open
            if (this.needsItemsSync) {
                this.items = this.toItems(this.value)
                this.needsItemsSync = false
            }

            // ↓ same
            const index = this.findIndex(item);

            if (this.disabled === true || index === -1) {
                return false;
            }

            this.$panel.drawer.open({
                component: "k-structure-drawer",
                id: this.id,
                props: {
                    icon: this.icon ?? "list-bullet",
                    next: this.items[index + 1],
                    prev: this.items[index - 1],
                    tabs: {
                        content: {
                            fields: this.form(field)
                        }
                    },
                    title: this.label,
                    value: item
                },
                replace: replace,
                on: {
                    input: (value) => {
                        const index = this.findIndex(item);

                        // update the prev/next navigation
                        this.$panel.drawer.props.next = this.items[index + 1];
                        this.$panel.drawer.props.prev = this.items[index - 1];

                        this.$set(this.items, index, value);
                        this.save();
                    },
                    next: () => {
                        this.navigate(item, 1);
                    },
                    prev: () => {
                        this.navigate(item, -1);
                    },
                    remove: () => {
                        this.remove(item);
                    }
                }
            });
            // ↑ same
        },
        save(values = this.items) {
            // use skipSort to prevent live-sorting the table
            // would cause issues with sortBy option
            this.skipSort = true
            this.$emit("input", values);
        
            this.$nextTick(() => { this.skipSort = false });
        },
        setFocus(value) {
            let id = value._id

            this.$nextTick(() => { 
                this.$refs['multilist-table'].$el.querySelector('[data-id="'+ id +'"] input').focus()
            })
        },
        toItems(value) {
            // ↓ same
            if (Array.isArray(value) === false) {
                return [];
            }

            value = value.map((row) => {
                return {
                    _id: row._id ?? this.$helper.uuid(),
                    ...row
                };
            });
            // ↑ same

            return this.skipSort ? value : this.sort(value);
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/css/styles.scss'
</style>
