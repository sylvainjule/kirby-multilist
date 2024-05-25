(function(){"use strict";var _=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("k-field",t._b({staticClass:"k-multilist-field"},"k-field",t.$props,!1),[e("template",{slot:"options"},[t.canAdd?e("k-button",{attrs:{id:t._uid,icon:"add"},on:{click:t.addItem}},[t._v(" "+t._s(t.$t("add"))+" ")]):t._e()],1),t.isEmpty?e("k-empty",{attrs:{icon:"list-bullet"},on:{click:t.addItem}},[t._v(" "+t._s(t.empty||t.$t("field.structure.empty"))+" ")]):e("div",{staticClass:"k-table k-multilist-table"},[e("table",{attrs:{"data-sortable":t.isSortable}},[e("thead",[e("tr",[e("th",{staticClass:"k-table-index-column"},[t._v("#")]),t._l(t.columns,function(o,l){return e("th",{key:t.index,staticClass:"k-table-column",style:"width:"+t.width(t.fields[l].width)},[t._v(" "+t._s(t.fields[l].label)),t.fields[l].required?e("span",[t._v("*")]):t._e()])}),e("th",{staticClass:"k-table-options-column"})],2)]),e("k-draggable",{staticClass:"k-multilist-list",attrs:{list:t.localValue,handle:!0,element:"tbody",options:t.dragOptions},on:{end:t.onInput}},t._l(t.localValue,function(o,l){return e("tr",{key:l,staticClass:"k-multilist-item"},[e("td",{class:["k-table-index-column",{disabled:t.isLast(l)}],attrs:{"data-sortable":t.isSortable&&!t.isLast(l)}},[e("div",{staticClass:"k-table-index"},[t._v(t._s(l+1))]),t.isSortable&&!t.isLast(l)?e("k-sort-handle"):t._e()],1),t._l(t.columns,function(c,i){return e("td",{key:i,staticClass:"k-table-column multilist-field"},[t.hasFieldType(t.fields[i].type)?e("k-"+t.fields[i].type+"-field",t._b({ref:"list-"+t.fields[i].name+"-"+l,refInFor:!0,tag:"component",attrs:{name:i,novalidate:t.novalidate,disabled:t.disabled},on:{keydown:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")||!a.shiftKey?null:(a.preventDefault(),t.addItem.apply(null,arguments))},keyup:function(a){return t.onKeyup(l,i,t.fields[i],a)},input:function(a){return t.onColumnInput(l,i,a)}},model:{value:t.localValue[l][i],callback:function(a){t.$set(t.localValue[l],i,a)},expression:"localValue[index][columnName]"}},"component",t.fields[i],!1)):t._e()],1)}),e("td",{class:["k-table-options-column",{disabled:t.isLast(l)}]},[e("k-button",{staticClass:"k-table-options-button",attrs:{tooltip:t.$t("remove"),icon:"remove"},on:{click:function(c){return t.removeItem(l)}}})],1)],2)}),0)],1)])],2)},b=[],C="";function m(t,s,e,o,l,c,i,a){var n=typeof t=="function"?t.options:t;s&&(n.render=s,n.staticRenderFns=e,n._compiled=!0),o&&(n.functional=!0),c&&(n._scopeId="data-v-"+c);var r;if(i?(r=function(u){u=u||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!u&&typeof __VUE_SSR_CONTEXT__!="undefined"&&(u=__VUE_SSR_CONTEXT__),l&&l.call(this,u),u&&u._registeredComponents&&u._registeredComponents.add(i)},n._ssrRegister=r):l&&(r=a?function(){l.call(this,(n.functional?this.parent:this).$root.$options.shadowRoot)}:l),r)if(n.functional){n._injectStyles=r;var d=n.render;n.render=function(V,p){return r.call(p),d(V,p)}}else{var f=n.beforeCreate;n.beforeCreate=f?[].concat(f,r):[r]}return{exports:t,options:n}}const k={props:{columns:Object,label:String,disabled:Boolean,help:String,parent:String,empty:String,name:[String,Number],required:Boolean,type:String,duplicate:{type:Boolean,default:!0},empty:String,fields:Object,limit:Number,max:Number,min:Number,prepend:{type:Boolean,default:!1},sortable:{type:Boolean,default:!0},sortBy:String,value:{type:Array,default(){return[]}}},data(){return{novalidate:!1,localValue:this.value}},watch:{value:function(t){this.localValue!==t&&(this.localValue=this.sort(t))}},computed:{isEmpty(){return!this.localValue||!this.localValue.length},canAdd(){return!this.limit||!this.localValue||!this.localValue.length||this.localValue.length<this.limit},isSortable(){return this.sortable&&this.localValue.length>1},defaultItem(){let t={};return Object.keys(this.fields).forEach(s=>{const e=this.fields[s];e.default!==null&&e.default!==void 0?t[s]=this.$helper.clone(e.default):t[s]=null}),t},dragOptions(){return{disabled:!this.isSortable,fallbackClass:"k-table-row-fallback",ghostClass:"k-table-row-ghost"}},lastIndex(){return this.localValue.length-1}},methods:{addItem(t=!0){let s=this.defaultItem;this.prepend?this.localValue=[s].concat(this.localValue):this.localValue.push(s),this.onInput(),t&&this.$nextTick(()=>{this.setFocus()})},setFocus(){let t=this.prepend&&!this.autoAdd?0:this.lastIndex,s="list-"+Object.keys(this.columns)[0]+"-"+t,e=this.$refs[s];e&&e[0].focus()},removeItem(t){this.localValue.indexOf(t)&&this.localValue.splice(t,1),this.onInput()},onColumnInput(t,s,e){this.localValue[t][s]=e,this.onInput()},onInput(){this.$emit("input",this.localValue)},onKeyup(t,s,e,o){let l=!1;const c=["text","url","email","tel"].indexOf(e.type)>-1,i=["number","select","multiselect"].indexOf(e.type)>-1,a=["text","url","email","tel"].indexOf(e.type)>-1,n=o.target.selectionStart==0,r=o.target.selectionStart==o.target.value.length;if(c&&(o.key=="ArrowDown"||o.key=="ArrowUp")&&(t+=o.key=="ArrowDown"?1:-1,l=!0),o.key=="ArrowLeft"&&(i||a&&n)||o.key=="ArrowRight"&&(i||a&&r)){let d=Object.keys(this.fields);s=d[d.indexOf(s)+(o.key=="ArrowRight"?1:-1)],l=!0}if(l){let d="list-"+s+"-"+t,f=this.$refs[d];f&&f[0]&&f[0].focus()}},isLast(t){return this.localValue&&this.localValue.length>1&&t+1===this.localValue.length},hasFieldType(t){return this.$helper.isComponent("k-"+t+"-field")},sort(t){return this.sortBy?t.sortBy(this.sortBy):t},width(t){if(!t)return"auto";const s=t.toString().split("/");if(s.length!==2)return"auto";const e=Number(s[0]),o=Number(s[1]),l=parseFloat(100/o*e,2).toFixed(2)+"%";return l=="100.00%"?"auto":l}}},h={};var y=m(k,_,b,!1,g,null,null,null);function g(t){for(let s in h)this[s]=h[s]}var v=function(){return y.exports}();panel.plugin("sylvainjule/multilist",{fields:{multilist:v}})})();
