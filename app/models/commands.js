import Ember from 'ember';
import deepFreeze from '../helpers/deep-freeze';
import { ARG_TYPES, argFactory } from './args';

var CATEGORIES = {
        fundamentals: 'Fundamentals',
        textures: 'Textures',
        performance: 'Performance',
        utility: 'Utility'
    },
    
    CMDS = {
        $body: {
            cmd: '$body',
            category: CATEGORIES.fundamentals,
            args: [
                { type: ARG_TYPES.string, label: 'name' },
                { type: ARG_TYPES.file, label: 'SMD file' }
            ],
            link: 'https://developer.valvesoftware.com/wiki/$body',
            help: 'Add a reference mesh to a model.'
        },
        $model: {
            cmd: '$model',
            category: CATEGORIES.fundamentals,
            args: [
                { type: ARG_TYPES.qstring, label: 'name', 'default': 'body' },
                { type: ARG_TYPES.file, label: 'SMD file' }
            ],
            link: 'https://developer.valvesoftware.com/wiki/$model',
            incomplete: true,
            help: 'Specifies a reference SMD file to be used as part of a complex model.'
        },
        $modelname: {
            cmd: '$modelname',
            required: true,
            category: CATEGORIES.fundamentals,
            args: [{ type: ARG_TYPES.file, label: 'MDL file path' }],
            link: 'https://developer.valvesoftware.com/wiki/$modelname',
            help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <a href="https://developer.valvesoftware.com/wiki/Game_Directory" target="_blank">Game Directory</a>.'
        },
        $staticprop: {
            cmd: '$staticprop',
            category: CATEGORIES.performance,
            args: [],
            link: 'https://developer.valvesoftware.com/wiki/$staticprop',
            help: 'Specifies that the model being compiled does not have any moving parts.'
        },
        $cdmaterials: {
            cmd: '$cdmaterials',
            category: CATEGORIES.textures,
            args: [{ type: ARG_TYPES.qstring, label: 'Materials folder path', many: true }],
            link: 'https://developer.valvesoftware.com/wiki/$cdmaterials',
            help: 'Defines the folders in which the game will search for the model\'s materials relative to <code><game>\\materials\\</code>. Subfolders are not searched.'
        },
        $scale: {
            cmd: '$scale',
            category: CATEGORIES.utility,
            args: [{ type: ARG_TYPES.float, label: 'Multiplier', 'default': 1 }],
            link: 'https://developer.valvesoftware.com/wiki/$scale',
            help: 'Multiplies the size of all subsequent SMDs.'
        },
        $upaxis: {
            cmd: '$upaxis',
            category: CATEGORIES.utility,
            args: [{
                type: ARG_TYPES.enum,
                label: 'Axis',
                default: 'Z',
                allowedValues: [
                    { label: 'X Axis', value: 'X' },
                    { label: 'Y Axis', value: 'Y' },
                    { label: 'Z Axis', value: 'Z' }
                ],
            }],
            link: 'https://developer.valvesoftware.com/wiki/$upaxis',
            help: 'Informs StudioMDL which axis in the SMD file should be considered \'up\'.'
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
                    case ARG_TYPES.float:
                    case ARG_TYPES.int:
                    case ARG_TYPES.string:
                    case ARG_TYPES.enum:
                        return arg.get('value');
                    default:
                        throw new Error('No parser for type "' + arg.type + '"');
                }
            })).join(' ');
        }.property('cmd', 'args.@each.value')
    });

deepFreeze(CMDS);

export const COMMANDS = CMDS;

export const CMD_TYPES = (function () {
    var keys = {};

    Object.keys(COMMANDS).forEach(function (key) {
        keys[key] = key;
    });

    return deepFreeze(keys);
}());

export function commandFactory(command, comment) {
    if (!(command in COMMANDS)) {
        throw new Error('Unrecognized command: "' + command + '"');
    }

    // COMMANDS is deeply frozen, so create a deep clone of the command schema object
    // so that Ember won't freak out if it tries to add meta properties to it
    let obj = Command.create(Ember.$.extend(true, {}, COMMANDS[command]));

    obj.set('comment', typeof comment === 'string' ? comment : '');
    obj.set('args', obj.get('args').map(function (obj) {
        return argFactory(obj);
    }));

    return obj;
}

export default commandFactory;
