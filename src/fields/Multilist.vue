<template>
    <k-field v-bind="$props" class="k-multilist-field">
        <template slot="options">
            <k-button v-if="canAdd" :id="_uid" icon="add" @click="addItem">
                {{ $t('add') }}
            </k-button>
        </template>

        <k-empty v-if="isEmpty" icon="list-bullet">
            {{ empty || $t("field.structure.empty") }}
        </k-empty>
        <table v-else :data-sortable="isSortable" class="k-structure-table k-multilist-table">
            <thead>
                <tr>
                    <th class="k-structure-table-index">#</th>
                    <th v-for="(field, index) in fields" :key="index" class="k-structure-table-column" :style="'width:' + width(field.width)">
                        {{ field.label }}<span v-if="field.required">*</span>
                    </th>
                    <th></th>
                </tr>
            </thead>

            <k-draggable :list="localValue" :handle="true" element="tbody" class="k-multilist-list" :options="dragOptions" @end="onInput">
                <tr v-for="(item, index) in localValue" :key="index" class="k-multilist-item">
                    <td :class="['k-structure-table-index', {'disabled': isLast(index) }]">
                        <k-sort-handle v-if="isSortable && !isLast(index)" />
                        <div class="k-structure-table-index-number">{{ index + 1 }}</div>
                    </td>

                    <td v-for="(field, key) in fields" :key="key" class="k-structure-table-column multilist-field">
                        <component
                              :is="'k-' + field.type + '-field'"
                              v-if="hasFieldType(field.type)"
                              :ref="'list-'+ field.name +'-'+ index"
                              v-model="localValue[index][key]"
                              :name="key"
                              :novalidate="novalidate"
                              :disabled="disabled"
                              v-bind="field"
                              @input="onColumnInput(index, key, $event)"
                            />
                    </td>

                    <td :class="['k-structure-table-options', {'disabled': isLast(index) }]">
                        <k-button
                          :tooltip="$t('remove')"
                          class="k-structure-table-options-button"
                          icon="remove"
                          @click="removeItem(index)"
                        />
                    </td>
                </tr>
            </k-draggable>
        </table>
    </k-field>
</template>

<script>
export default {
    props: {
        label: String,
        disabled: Boolean,
        help: String,
        parent: String,
        empty: String,
        name: [String, Number],
        required: Boolean,
        type: String,

        duplicate: {
            type: Boolean,
            default: true
        },
        empty: String,
        fields: Object,
        limit: Number,
        max: Number,
        min: Number,
        prepend: {
            type: Boolean,
            default: false
        },
        sortable: {
            type: Boolean,
            default: true
        },
        sortBy: String,
        value: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    data() {
        return {
            novalidate: false,
            localValue: this.value
        }
    },
    watch: {
        value: function(value) {
            if(this.localValue !== value) {
                this.localValue = this.sort(value)
            }
        },
    },
    computed: {
        isEmpty() {
            return !this.localValue || !this.localValue.length
        },
        canAdd() {
            return !this.limit || !this.localValue || !this.localValue.length || this.localValue.length < this.limit
        },
        isSortable() {
            return this.sortable && this.localValue.length > 1
        },
        defaultItem() {
            let data = {}

            Object.keys(this.fields).forEach(fieldName => {
                const field = this.fields[fieldName]
                if (field.default !== null && field.default !== undefined) {
                    data[fieldName] = this.$helper.clone(field.default)
                } else {
                    data[fieldName] = null
                }
            })

            return data
        },
        dragOptions() {
            return {
                disabled: !this.isSortable,
                fallbackClass: "k-sortable-row-fallback"
            }
        },
        lastIndex() {
            return this.localValue.length - 1
        },
    },
    methods: {
        addItem(focus = true) {
            let newItem = this.defaultItem

            if(this.prepend) {
                this.localValue = [newItem].concat(this.localValue)
            }
            else {
                this.localValue.push(newItem)
            }

            this.onInput()
            if(focus) {
                this.$nextTick(() => { this.setFocus() })
            }
        },
        setFocus() {
            let index   = this.prepend && !this.autoAdd ? 0 : this.lastIndex
            let ref     = 'list-'+ Object.keys(this.fields)[0] +'-'+ index
            let focusOn = this.$refs[ref]

            if(focusOn) focusOn[0].focus()
        },
        removeItem(index) {
            if(this.localValue.indexOf(index)) {
                this.localValue.splice(index, 1)
            }
            this.onInput()
        },
        onColumnInput(index, key, value) {
            this.localValue[index][key] = value

            this.onInput()
        },
        onInput() {
            this.$emit('input', this.localValue)
        },
        isLast(index) {
            return this.localValue && this.localValue.length > 1 && index + 1 === this.localValue.length
        },
        hasFieldType(type) {
            return this.$helper.isComponent('k-'+ type +'-field')
        },
        sort(items) {
            if (!this.sortBy) return items
            return items.sortBy(this.sortBy)
        },
        width(fraction) {
            if (!fraction) { return 'auto' }
            const parts = fraction.toString().split("/")
            if (parts.length !== 2) { return 'auto' }

            const a = Number(parts[0])
            const b = Number(parts[1])
            const w = parseFloat(100 / b * a, 2).toFixed(2) + '%'

            return w == '100.00%' ? 'auto' : w
        },
    }
};
</script>

<style lang="scss">
    @import '../assets/css/styles.scss'
</style>
