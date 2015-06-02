import Ember from 'ember';
import deepFreeze from '../helpers/deep-freeze';
import Argument from './argument';

let Command;
export default Command = Ember.Object.extend({
    output: function () {
        var cmd = this.get('cmd'),
            args = this.get('args'),
            arr;

        arr = [cmd].concat(args.map(function (arg) {
            var value = arg.get('value');

            switch (arg.type) {
                case Argument.TYPES.bool:
                    console.log('outputting a bool arg:', value, value === 'yes' ? arg.get('label') : '');
                    return value === 'yes' ? arg.get('label') : '';
                case Argument.TYPES.string:
                case Argument.TYPES.enum:
                    return value;
                case Argument.TYPES.file:
                case Argument.TYPES.qstring: 
                    return '"' + value + '"';
                case Argument.TYPES.float:
                    return Number(value).toFixed(8).replace(/\.?0+$/, '');
                case Argument.TYPES.int:
                    return Number(value).toFixed(0);
                default:
                    throw new Error('No parser for type "' + arg.type + '"');
            }
        }));

        arr.removeObjects('');

        return arr.join(' ');
    }.property('cmd', 'args.@each.value')
});

let CATEGORIES = deepFreeze({
    animation: 'Animation',
    collision: 'Collision',
    fundamentals: 'Fundamentals',
    textures: 'Textures',
    performance: 'Performance',
    utility: 'Utility'
});

let COMMANDS = deepFreeze({
    $sequence: {
        cmd: '$sequence',
        category: CATEGORIES.animation,
        args: [{
            type: Argument.TYPES.string,
            label: 'name',
            validations: {
                value: { presence: true }
            },
            'default': 'idle'
        }, {
            type: Argument.TYPES.file,
            label: 'Animation SMD',
            validations: {
                value: { presence: true }
            }
        }, {
            type: Argument.TYPES.bool,
            label: 'loop',
            'default': 'yes',
            allowedValues: [
                { label: 'Loop animation', value: 'yes' },
                { label: 'Do not loop animation', value: 'no' }
            ]
        }],
        link: 'https://developer.valvesoftware.com/wiki/$sequence',
        help: 'Defines a skeletal animation for an SMD model<br><br>Required for all props'
    },
    $collisionmodel: {
        cmd: '$collisionmodel',
        category: CATEGORIES.collision,
        args: [{
            type: Argument.TYPES.file,
            label: 'Collision SMD',
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$collisionmodel',
        help: 'Embed a static collision mesh in a model for use in VPhysics calculations'
    },
    $body: {
        cmd: '$body',
        category: CATEGORIES.fundamentals,
        args: [{
            type: Argument.TYPES.string,
            label: 'name',
            validations: {
                value: { presence: true }
            }
        }, {
            type: Argument.TYPES.file,
            label: '<modelname>.smd',
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$body',
        help: 'Add a reference mesh to a model'
    },
    $model: {
        cmd: '$model',
        category: CATEGORIES.fundamentals,
        args: [{
            type: Argument.TYPES.qstring,
            label: 'name',
            'default': '',
            validations: {
                value: { presence: true }
            }
        }, {
            type: Argument.TYPES.file,
            label: '<modelname>.smd',
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$model',
        incomplete: true,
        help: 'Specifies a reference SMD file to be used as part of a complex model'
    },
    $modelname: {
        cmd: '$modelname',
        required: true,
        category: CATEGORIES.fundamentals,
        args: [{
            type: Argument.TYPES.qstring,
            label: '<folder>\\<modelname>.mdl',
            'default': '',
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$modelname',
        help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <strong>Game Directory</strong>'
    },
    $staticprop: {
        cmd: '$staticprop',
        category: CATEGORIES.performance,
        args: [],
        link: 'https://developer.valvesoftware.com/wiki/$staticprop',
        help: 'Specifies that the model being compiled does not have any moving parts'
    },
    $cdmaterials: {
        cmd: '$cdmaterials',
        category: CATEGORIES.textures,
        args: [{
            type: Argument.TYPES.qstring,
            label: 'Materials folder path',
            many: true,
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$cdmaterials',
        help: 'Defines the folders in which the game will search for the model\'s materials relative to <code>&lt;game&gt;\\materials\\</code><br><br>Subfolders are not searched'
    },
    $surfaceprop: {
        cmd: '$surfaceprop',
        category: CATEGORIES.textures,
        args: [{
            type: Argument.TYPES.qstring,
            label: 'name',
            validations: {
                value: { presence: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/Material_surface_properties',
        help: 'Links the surface of either a <code>material</code> or <code>model</code> to a set of physical properties.<br><br>Must be a value defined in the <code>surfaceproperties_manifest</code> text file'
    },
    $scale: {
        cmd: '$scale',
        category: CATEGORIES.utility,
        args: [{
            type: Argument.TYPES.float,
            label: 'Value',
            'default': 1,
            validations: {
                value: { presence: true, numericality: true }
            }
        }],
        link: 'https://developer.valvesoftware.com/wiki/$scale',
        help: 'Multiplies the size of all subsequent SMDs'
    },
    $upaxis: {
        cmd: '$upaxis',
        category: CATEGORIES.utility,
        args: [{
            type: Argument.TYPES.enum,
            label: 'Axis',
            'default': 'Z',
            allowedValues: [
                { label: 'X Axis', value: 'X' },
                { label: 'Y Axis', value: 'Y' },
                { label: 'Z Axis', value: 'Z' }
            ],
        }],
        link: 'https://developer.valvesoftware.com/wiki/$upaxis',
        help: 'Informs StudioMDL which axis in the SMD file should be considered \'up\''
    }
});

Command.reopenClass({
    CATEGORIES: CATEGORIES,
    COMMANDS: COMMANDS,
    TYPES: (function () {
        var keys = {};

        Object.keys(COMMANDS).forEach(function (key) {
            keys[key] = key;
        });

        return deepFreeze(keys);
    }()),

    createByType: function (type, comment) {
        if (!(type in Command.TYPES)) {
            throw new Error('Unrecognized command type: "' + type + '"');
        }

        // COMMANDS is deeply frozen, so create a deep clone of the command schema object
        // so that Ember won't freak out if it tries to add meta properties to it
        let obj = Command.create(Ember.$.extend(true, {}, Command.COMMANDS[type]));

        obj.set('comment', typeof comment === 'string' ? comment : '');
        obj.set('args', obj.get('args').map(function (obj) {
            return Argument.create(obj);
        }));

        return obj;
    }
});
