const tree = [];
const nodes = {};
/** @type {[key: string]: Function[]} */
const cb = {};


class GxOption {
    id = '';
    name = '';
    label = '';
    constructor(id,name,label) {
        this.id = id;
        this.name = name;
        this.label = label;
    }
}

class GxSection extends GxOption {
    type = 'section';
    children = [];
    constructor(id,name,label,children=[]) {
        super(id,name,label);
        this.children = children;
    }
}

class GxOptionRange extends GxOption {
    type = 'range';
    value = 0;
    min = 0;
    max = 0;
    step = 0;
    constructor(id,name,label,min,max,step,value) {
        super(id,name,label);
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = value;
    }
}

class GxOptionBoolean extends GxOption {
    type = 'boolean';
    value = false;
    constructor(id,name,label,value) {
        super(id,name,label);
        this.value = value;
    }
}

class GxOptionString extends GxOption {
    type = 'string';
    value = '';
    constructor(id,name,label,value='') {
        super(id,name,label);
        this.value = value;
    }
}

class GxOptionMultilineString extends GxOption {
    type = 'string_multiline';
    value = '';
    constructor(id,name,label,value='') {
        super(id,name,label);
        this.value = value;
    }
}

class GxOptionColor extends GxOption {
    type = 'color';
    value = '#000000'
    constructor(id,name,label,value='#000000') {
        super(id,name,label);
        this.value = value;
    }
}

class GxOptionFile extends GxOption {
    type = 'file';
    value = '';
    constructor(id,name,label) {
        super(id,name,label);
    }
}

class GxOptionFolder extends GxOption {
    type = 'folder';
    value = '';
    constructor(id,name,label) {
        super(id,name,label);
    }
}

class GxOptionSelect extends GxOption {
    type = 'select';
    options = [];
    value = undefined;
    description = '';
    constructor(id,name,label,options,value) {
        super(id,name,label);
        this.options = options;
        this.value = value;
    }
}

/** @typedef { 'section' | 'range' | 'boolean' | 'string' | 'string_multiline' | 'color' | 'file' | 'folder' | 'select'} GxOptionType */

/**
 * @typedef GxConfig
 * @prop {GxOptionType} type
 * @prop {string} name
 * @prop {string} label
 * @prop {GxConfig[]} children
 */

export function clear() {
    for (const key of Object.keys(nodes)) {
        delete nodes[key];
    }
    tree.splice(0,tree.length);
}

export function load(/** @type {GxConfig[]} */ config){
    // clear out everything
    clear();


    // walk the tree!
    tree.push(...walk_config_tree(config));
}

function walk_config_tree(/** @type {GxConfig[]} */ config) {
    const children = [];
    for (const option of config) {
        const id = crypto.randomUUID();
        children.push(id);
        if (option.type == 'section') {
            // it's a section, time to walk the tree more!
            const node_children = walk_config_tree(option.children);
            const node = new GxSection(id,option.name,option.label,node_children);
            console.log(option.name);
            console.log(option.label);
            console.log(node);
            nodes[id] = node;
            
        } else if (option.type == 'range') {
            const node = new GxOptionRange(id,option.name,option.label,option.min,option.max,option.step,option.value);
            nodes[id] = node;
        } else if (option.type == 'boolean') {
            const node = new GxOptionBoolean(id,option.name,option.label,option.value);
            nodes[id] = node;
        } else if (option.type == 'string') {
            const node = new GxOptionString(id,option.name,option.label,option.value);
            nodes[id] = node;
        } else if (option.type == 'string_multiline') {
            const node = new GxOptionMultilineString(id,option.name,option.label,option.value);
            nodes[id] = node;
        } else if (option.type == 'color' || option.type == 'colour') {
            let colour = option.value;
            if (typeof(colour) === 'number') {
                // assume BGR - run conversion
                colour = ((colour & 0xFF) << 16) | ( colour & 0xFF00) | (colour >> 16);
                colour = '#' + colour.toString(16);
            } else {
                // it's a css colour string, don't bother
            }
            const node = new GxOptionColor(id,option.name,option.label,colour);
            nodes[id] = node;
        } else if (option.type == 'file') {
            const node = new GxOptionFile(id,option.name,option.label);
            nodes[id] = node;
        } else if (option.type == 'folder') {
            const node = new GxOptionFolder(id,option.name,option.label);
            nodes[id] = node;
        } else if (option.type == 'select') {
            const node = new GxOptionSelect(id,option.name,option.label,option.options,option.value);
            nodes[id] = node;
        }
    }
    return children;
}

export function get() {
    return tree;
}

export function get_node(node) {
    return nodes[node];
}

export function set_node(node,field,value) {
    nodes[node][field] = value;
}

export function list_nodes() {
    console.log(nodes);

}

export function create_node(/** @type {GxOptionType}*/ type, /** @type {string | null } */ parent=null) {
    let node;
    const id = crypto.randomUUID();
    switch (type) {
        case 'section':
            node = new GxSection(id,'','');
        break;
        case 'range':
            node = new GxOptionRange(id,'','');
        break;
        case 'boolean':
            node = new GxOptionBoolean(id,'','');
        break;
        case 'string':
            node = new GxOptionString(id,'','');
        break;
        case 'string_multiline':
            node = new GxOptionMultilineString(id,'','');
        break;
        case 'color':
        case 'colour':
            node = new GxOptionColor(id,'','');
        break;
        case 'file':
            node = new GxOptionFile(id,'','');
        break;
        case 'folder':
            node = new GxOptionFolder(id,'','');
        break;
        case 'select':
            node = new GxOptionSelect(id,'','',[],undefined);
        break;
    }
    nodes[id] = node;
    if (parent == null) {
        tree.push(id);
    } else {
        const parent_node = nodes[parent];
        parent_node.children.push(id);
    }
    return id;
}

export function delete_node(id) {
    if (nodes[id].children) {
        for (const child of nodes[id].children) {
            delete nodes[child];
        }
    }
    delete nodes[id];
    if (tree.indexOf(id) != -1) {
        tree.splice(tree.indexOf(id),1);
        return run_callback('root',{type: 'delete', id: id});
    }
    const keys = Object.keys(nodes);
    for (const key of keys) {
        const node = nodes[key];
        if (node.children && node.children.indexOf(id) != -1) {
            node.children.splice(node.children.indexOf(id),1);
            return run_callback(key,{type: 'delete', id: id});
        }
    }
}

// Listen for updates on a particular node (adding/deleting children)
// Returns an unsubscribe function
export function subscribe(id,callback) {
    if (cb[id] == undefined) {
        cb[id] = [];
    }
    const index = cb[id].push(callback)-1;

    return ()=>{
        unsubscribe(id,index);
    };
}

function unsubscribe(id,index) {
    cb[id][index] = null;
}
function run_callback(id,event) {
    if (cb[id]) {
        for (const fn of cb[id]) {
            if (fn) {
                fn(event);
            }
        }
    }
}

export const types = [
    {id:'section',name:'Section'},
    {id:'range',name:'Range'},
    {id:'boolean',name:'Boolean'},
    {id:'string',name:'String'},
    {id:'string_multiline',name:'Multi-line String'},
    {id:'color',name:'Colour'},
    {id:'select',name:'Select'}
];