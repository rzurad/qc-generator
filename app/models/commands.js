import Ember from 'ember';
import { ARG_TYPES, argFactory } from './args';

var COMMANDS = {
        $modelname: {
            cmd: '$modelname',
            required: true,
            category: 'fundamentals',
            args: [{ type: ARG_TYPES.file, label: 'MDL file path' }],
            link: 'https://developer.valvesoftware.com/wiki/$modelname',
            help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <a href="https://developer.valvesoftware.com/wiki/Game_Directory" target="_blank">Game Directory</a>.'
        },  
        $model: {
            cmd: '$model',
            category: 'fundamentals',
            args: [
                { type: ARG_TYPES.qstring, label: 'name', 'default': 'body' },
                { type: ARG_TYPES.file, label: 'SMD file' }
            ],
            link: 'https://developer.valvesoftware.com/wiki/$model',
            incomplete: true,
            help: 'Specifies a reference SMD file to be used as part of a complex model.'
        },
        $body: {
            cmd: '$body',
            category: 'fundamentals',
            args: [
                { type: ARG_TYPES.string, label: 'name' },
                { type: ARG_TYPES.file, label: 'SMD file' }
            ],
            link: 'https://developer.valvesoftware.com/wiki/$body',
            help: 'Add a reference mesh to a model.'
        },
        $cdmaterials: {
            cmd: '$cdmaterials',
            category: 'textures',
            args: [{ type: ARG_TYPES.qstring, label: 'Materials folder path' }],
            link: 'https://developer.valvesoftware.com/wiki/$cdmaterials',
            help: 'Defines the folders in which the game will search for the model\'s materials relative to <code><game>\\materials\\</code>. Subfolders are not searched.'
        },
        $staticprop: {
            cmd: '$staticprop',
            category: 'performance',
            args: [],
            link: 'https://developer.valvesoftware.com/wiki/$staticprop',
            help: 'Specifies that the model being compiled does not have any moving parts.'
        }
    },

    Command = Ember.Object.extend({
        output: function () {
            var cmd = this.get('cmd'),
                args = this.get('args');

            return [cmd].concat(args.map(function (arg) {
                switch (arg.type) {
                    case ARG_TYPES.file:
                    case ARG_TYPES.qstring: 
                        return '"' + arg.get('value') + '"';
                    case ARG_TYPES.string:
                        return arg.get('value');
                    default:
                        throw new Error('No parser for type "' + arg.type + '"');
                }
            })).join(' ');
        }.property('cmd', 'args.@each.value')
    });

export const CMD_TYPES = (function () {
    var keys = {};

    Object.keys(COMMANDS).forEach(function (key) {
        keys[key] = key;
    });

    return keys;
}());

export function commandFactory(command, comment) {
    if (!(command in COMMANDS)) {
        throw new Error('Unrecognized command: "' + command + '"');
    }

    let obj = Command.create(COMMANDS[command]);

    obj.set('comment', typeof comment === 'string' ? comment : '');
    obj.set('args', obj.get('args').map(function (obj) {
        return argFactory(obj);
    }));

    return obj;
}

export default commandFactory;
