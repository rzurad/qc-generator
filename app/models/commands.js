import Ember from 'ember';
import { ARG_TYPES, argFactory } from './args';
import config from '../config/environment';

var COMMANDS = {
        $modelname: {
            cmd: '$modelname',
            required: true,
            category: 'fundamentals',
            args: [ARG_TYPES.file],
            link: 'https://developer.valvesoftware.com/wiki/$modelname',
            help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <a href="https://developer.valvesoftware.com/wiki/Game_Directory" target="_blank">Game Directory</a>.'
        },  
        $body: {
            cmd: '$body',
            category: 'fundamentals',
            args: [ARG_TYPES.string, ARG_TYPES.file],
            link: 'https://developer.valvesoftware.com/wiki/$body',
            help: 'Add a reference mesh to a model.'
        },
        $cdmaterials: {
            cmd: '$cdmaterials',
            category: 'textures',
            args: [ARG_TYPES.file],
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
                    case 'file': return '"' + arg.get('value') + '"'; break;
                    case 'string': return arg.get('value'); break;
                    default: throw new Error('No parser for type "' + arg.type + '"');
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
    obj.set('args', obj.get('args').map(function (argkey) {
        return argFactory(argkey);
    }));

    return obj;
}

export default commandFactory;
