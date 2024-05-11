<template>
  <v-app>
    <v-main>
      <v-card max-width="800" class="mx-auto my-4">
        <v-card-title> Live Wallpaper Config Builder </v-card-title>
        <v-card-actions>
          <v-btn variant="tonal" color="primary" @click="show_import_config_dialog = true; json='';"> Import Config </v-btn>
          <v-btn variant="tonal" color="red" @click="clear_nodes"> Clear Nodes </v-btn>
          <v-btn variant="tonal" color="success" @click="show_export_config_dialog = true;"> Export config </v-btn>
        </v-card-actions>
        <template v-for="option of options" :key="option">
          <gx-option :id="option"/>
        </template>
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
      </v-card>
    </v-main>
    <app-footer/>
    <v-dialog v-model="show_import_config_dialog" max-width="600">
      <v-card>
        <v-card-title> Import configuration </v-card-title>
        <!-- either upload a file or accept copy-paste -->
        <v-card-text>
          <v-tabs v-model="tab">
            <v-tab text="Upload" :value="0"/>
            <v-tab text="Paste" :value="1"/>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="0">
              <v-file-input label="JSON file" v-model="json_file" @change="upload_file" accept="application/json"/>
            </v-tabs-window-item>
            <v-tabs-window-item :value="1">
              <v-textarea v-model="json" class="textarea-code"/>
              <v-btn @click="import_config"> Import </v-btn>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="show_export_config_dialog" max-width="600">
      <v-card>
        <v-card-title> Export configuration </v-card-title>
        <v-card-actions>
          <v-btn prepend-icon="mdi-download" variant="tonal" color="success" @click="download_file"> Download JSON file </v-btn>
          <v-btn prepend-icon="mdi-content-copy" variant="tonal" color="success" @click="copy_to_clipboard"> Copy JSON to clipboard </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="show_snackbar" :timeout="2000"> {{ snackbar_message }}</v-snackbar>
  </v-app>
</template>

<style>
    .textarea-code {
      font-family: 'Courier New', Courier, monospace;
    }
    .container-code {
      white-space: pre-wrap !important;
    }
</style>

<script>
  import * as config from './config-tree'
  import GxOption from '@/components/GxOption.vue';
  import AppFooter from '@/components/AppFooter.vue';


  export default {
    components: {
      GxOption,
      AppFooter
    },
    data: ()=>({
      options: [],
      types: [],
      unsub: null,
      show_import_config_dialog: false,
      show_export_config_dialog: false,
      json: '',
      json_file:null,
      json_export: '',
      tab: null,
      show_snackbar: false,
      snackbar_message:'',
    }),
    created(){
      this.types.splice(0,this.types.length);
      this.types.push(...config.types);
      this.unsub = config.subscribe('root',this.remove_node)
    },
    unmounted(){
      if (this.unsub) {
        this.unsub();
      }
    },
    methods: {
      async upload_file(e){
        const file = e.target.files[0];
        const text = await file.text();
        this.json = text;
        this.json_file = null;
        this.import_config();

      },
      import_config(){
        try {
          const json = JSON.parse(this.json);
          this.clear_nodes();
          config.load(json);
          this.options.push(...config.get());
          this.show_import_config_dialog = false;
        } catch(e) {
          console.error(e);
          alert('Probably invalid JSON');
        }
      },
      clear_nodes(){
        config.clear();
        this.options.splice(0,this.options.length);
      },
      list_nodes(){
        config.list_nodes();
      },
      add_node(type) {
        const id = config.create_node(type);
        this.options.push(id);
      },
      remove_node(event){
        if (event.type == 'delete') {
          const index = this.options.indexOf(event.id);
          if (index > -1) {
            this.options.splice(index,1);
          }
        }
      },
      export_config(){},
      copy_to_clipboard(){
        const json = this.export_config();
        this.show_snackbar = true;
        this.snackbar_message = 'Copied to cliboard'
      },
      download_file(){
        const json = this.export_config();
        this.show_snackbar = true;
        this.snackbar_message = 'Download started'
      },
    }
  }
</script>
