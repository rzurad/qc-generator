import Ember from 'ember';
import deepFreeze from '../utils/deep-freeze';
import Argument from './argument';

let Command;

export default Command = Ember.Object.extend({
    cmd: null,
    category: null,
    args: [],
    link: '',
    help: '',

    toString: function () {
        var cmd = this.get('cmd'),
            args = this.get('args'),
            arr = [cmd].concat(args.map(function (arg) {
                return arg.toString();
            }));

        arr.removeObject('');

        return arr.join(' ');
    },

    string: function () {
        return this.toString();
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
        args: [
            { type: 'string-argument', label: 'name', 'default': 'idle' },
            { type: 'file-argument', label: '<animation>.smd' },
            { type: 'bool-argument', label: 'loop' }
        ],
        link: 'https://developer.valvesoftware.com/wiki/$sequence',
        help: 'Defines a skeletal animation for an SMD model<br><br>Required for all props'
    },
    $collisionmodel: {
        cmd: '$collisionmodel',
        category: CATEGORIES.collision,
        args: [{ type: 'file-argument', label: '<collision>.smd' }],
        link: 'https://developer.valvesoftware.com/wiki/$collisionmodel',
        help: 'Embed a static collision mesh in a model for use in VPhysics calculations'
    },
    $body: {
        cmd: '$body',
        category: CATEGORIES.fundamentals,
        args: [
            { type: 'keyword-argument', label: 'name' },
            { type: 'file-argument', label: '<modelname>.smd' }
        ],
        link: 'https://developer.valvesoftware.com/wiki/$body',
        help: 'Add a reference mesh to a model'
    },
    $model: {
        cmd: '$model',
        category: CATEGORIES.fundamentals,
        args: [
            { type: 'string-argument', label: 'name' },
            { type: 'file-argument', label: '<modelname>.smd' }
        ],
        link: 'https://developer.valvesoftware.com/wiki/$model',
        incomplete: true,
        help: 'Specifies a reference SMD file to be used as part of a complex model'
    },
    $modelname: {
        cmd: '$modelname',
        required: true,
        category: CATEGORIES.fundamentals,
        args: [{ type: 'file-argument', label: '<folder>\\<modelname>.mdl' }],
        link: 'https://developer.valvesoftware.com/wiki/$modelname',
        help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <strong>Game Directory</strong>'
    },
    $staticprop: {
        cmd: '$staticprop',
        category: CATEGORIES.performance,
        link: 'https://developer.valvesoftware.com/wiki/$staticprop',
        help: 'Specifies that the model being compiled does not have any moving parts'
    },
    $cdmaterials: {
        cmd: '$cdmaterials',
        category: CATEGORIES.textures,
        args: [{ type: 'string-argument', label: 'Materials folder path', many: true }],
        link: 'https://developer.valvesoftware.com/wiki/$cdmaterials',
        help: 'Defines the folders in which the game will search for the model\'s materials relative to <code>&lt;game&gt;\\materials\\</code><br><br>Subfolders are not searched'
    },
    $surfaceprop: {
        cmd: '$surfaceprop',
        category: CATEGORIES.textures,
        args: [{ type: 'string-argument', label: 'name' }],
        link: 'https://developer.valvesoftware.com/wiki/Material_surface_properties',
        help: 'Links the surface of either a <code>material</code> or <code>model</code> to a set of physical properties.<br><br>Must be a value defined in the <code>surfaceproperties_manifest</code> text file'
    },
    $scale: {
        cmd: '$scale',
        category: CATEGORIES.utility,
        args: [{ type: 'float-argument', label: 'Multiplier', 'default': 1 }],
        link: 'https://developer.valvesoftware.com/wiki/$scale',
        help: 'Multiplies the size of all subsequent SMDs'
    },
    $upaxis: {
        cmd: '$upaxis',
        category: CATEGORIES.utility,
        args: [{
            type: 'keyword-argument',
            label: 'Axis',
            'default': 'Z',
            validations: {
                value: {
                    inclusion: {
                        in: [
                            { label: 'X Axis', value: 'X' },
                            { label: 'Y Axis', value: 'Y' },
                            { label: 'Z Axis', value: 'Z' }
                        ]
                    }
                }
            }
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
            return Argument.prototype.container.lookupFactory('model:' + obj.type).create(obj);
        }));

        return obj;
    }
});
