<template>
  <v-container>
    <v-card>
      <v-card-title> Range </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Label" v-model="label"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Key" v-model="name"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Minimum" v-model="min" type="number"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Maximum" v-model="max" type="number"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Default Value" v-model="value" type="number"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Step" v-model="step" type="number"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
  import {get_node, set_node} from '@/config-tree.js';
  export default {
    name: 'GxOptionRange',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data:()=>({
      name: '',
      label: '',
      min: 0,
      max: 0,
      value: 0,
      step: 1,
    }),
    created(){
      const node = get_node(this.id);
      this.name = node.name;
      this.label = node.label;
      this.min = node.min;
      this.max = node.max;
      this.value = node.value;
      this.step = node.step;
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
      min(){
        set_node(this.id,'min',this.min);
      },
      max(){
        set_node(this.id,'max',this.max);
      },
      step(){
        set_node(this.id,'step',this.step);
      },
    }
  }
</script>