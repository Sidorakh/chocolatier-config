<template>
  <div>
    <template v-if="type=='section'">
      <gx-section :id="id"/>
    </template>
    <template v-else-if="type == 'range'">
      <gx-option-range :id="id"/>
    </template>
    <template v-else-if="type == 'boolean'">
      <gx-option-boolean :id="id"/>
    </template>
    <template v-else-if="type == 'string'">
      <gx-option-string :id="id"/>
    </template>
    <template v-else-if="type == 'string_multiline'">
      <gx-option-multiline-string :id="id"/>
    </template>
    <template v-else-if="type == 'color'">
      <gx-option-color :id="id"/>
    </template>
    <template v-else-if="type == 'select'">
      <gx-option-select :id="id"/>
    </template>
    <v-card-actions>
      <v-tooltip :text="`Delete ${this.type} option`">
        <template v-slot:activator="{ props }">
          <v-btn color="red" icon="mdi-delete" v-bind="props" @click="delete_node"/>
        </template>
      </v-tooltip>
    </v-card-actions>
  </div>
</template>
<script>
import {get_node, set_node, delete_node} from '@/config-tree.js';
  export default {
    props: {
      id: {
        type: String,
        default: '',
      }
    },
    data:()=>({
      type: '',
    }),
    created(){
      const node = get_node(this.id);
      if (node) {
        this.type = node.type;
      }
    },
    methods:{
      delete_node() {
        delete_node(this.id);
      }
    }
  }
</script>