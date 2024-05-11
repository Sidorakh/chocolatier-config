<template>
  <v-container>
    <v-card>
      <v-card-title> Section </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Label" v-model="label"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Key" v-model="name"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ children.length == 1 ? '1 item' : (children.length == 0 ? 'No' : `${children.length}`) + ' items' }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container>
                <template v-for="child of children" :key="child">
                  <gx-option :id="child"/>
                </template>
              </v-container>
              <v-card-actions>
                <v-menu>
                  <template v-slot:activator="{props}">
                    <v-btn density="compact" variant="tonal" icon="mdi-plus" color="blue" v-bind="props"/>
                  </template>
                  <v-list>
                    <v-list-item v-for="t of types" :key="t.id" @click="add_node(t.id)">
                      Add {{ t.name }}
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import {get_node, set_node, create_node, types, subscribe} from '@/config-tree.js';
  export default {
    name: 'GxSection',
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data:()=>({
      name: '',
      label: '',
      children:[],
      types:[],
      unsub: null,
    }),
    created(){
      const node = get_node(this.id);
      this.name = node.name;
      this.label = node.label;
      this.children.push(...node.children);
      this.types.push(...types)
      this.unsub = subscribe(this.id,this.remove_node)
    },
    methods:{
      add_node(type){
        const child = create_node(type,this.id);
        this.children.push(child);
      },
      remove_node(event) {
        if (event.type == 'delete') {
          const index = this.children.indexOf(event.id);
          if (index > -1) {
            this.children.splice(index,1);
          }
        }
      }
    },
    watch: {
      name() {
        set_node(this.id,'name',this.name);
      },
      label(){
        set_node(this.id,'label',this.label);
      },
    }
  }
</script>