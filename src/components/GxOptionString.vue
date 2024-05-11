<template>
  <v-container>
    <v-card>
      <v-card-title> String </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Label" v-model="label"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Key" v-model="name"/>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Default Value" v-model="value"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import {get_node, set_node} from '@/config-tree.js';
  export default {
    name: 'GxOptionString',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data:()=>({
      name: '',
      label: '',
      value: false,
    }),
    created(){
      const node = get_node(this.id);
      this.name = node.name;
      this.label = node.label;
      this.value = node.value;
    },
    watch: {
      name() {
        set_node(this.id,'name',this.name);
      },
      label(){
        set_node(this.id,'label',this.label);
      },
      value(){
        set_node(this.id,'value',this.value);
      },
    }
  }
</script>