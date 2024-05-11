<template>
  <v-container>
    <v-card>
      <v-card-title> Select </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Label" v-model="label"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Key" v-model="name"/>
          </v-col>
          <v-col cols="9">
            Options: {{ options.join(', ') }}
            <br/>
            Default: {{ value }}
          </v-col>
          <v-col cols="3">
            <v-btn variant="flat" @click="show_select_dialog = true"> Set Options </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="show_select_dialog" max-width="600">
      <v-card>
        <v-card-title> Options </v-card-title>
        <v-card-text>
          Options
          <v-list>
            <v-list-item v-for="(option,i) of options" :key="`option-${i}`">
              <v-text-field v-model="options[i]" label="Value" append-inner-icon="mdi-delete" @click:append-inner="options.splice(i,1)"/>
            </v-list-item>
            <v-list-item>
              <v-text-field v-model="new_value" label="New Value" append-inner-icon="mdi-plus" @click:append-inner="options.push(new_value);new_value='';" @keyup.enter="options.push(new_value);new_value='';"/>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text>
          <v-select :items="options" v-model="value"/>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="show_select_dialog=false"> Dismiss </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {get_node, set_node} from '@/config-tree.js';
  export default {
    name: 'GxOptionSelect',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data:()=>({
      name: '',
      label: '',
      options:[],
      value: '',
      new_value: '',
      show_select_dialog: false,
    }),
    created(){
      const node = get_node(this.id);
      this.name = node.name;
      this.label = node.label;
      this.value = node.value;
    },
    methods:{

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