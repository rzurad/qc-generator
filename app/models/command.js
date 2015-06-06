import Ember from 'ember';
import deepFreeze from '../utils/deep-freeze';
import BoolArgument from './bool-argument';
import StringArgument from './string-argument';
import IntArgument from './int-argument';
import FloatArgument from './float-argument';
import FileArgument from './file-argument';
import KeywordArgument from './keyword-argument';


let ARGUMENTS = {
    'string-argument': StringArgument,
    'bool-argument': BoolArgument,
    'file-argument': FileArgument,
    'float-argument': FloatArgument,
    'int-argument': IntArgument,
    'keyword-argument': KeywordArgument
};

let CATEGORIES = {
    animation: 'Animation',
    collision: 'Collision',
    fundamentals: 'Fundamentals',
    textures: 'Textures',
    performance: 'Performance',
    utility: 'Utility'
};

// PREFABS serves as templates for all valid QC commands.
// Since we want absolutely no chance of anything modifying this object in any
// way whatsoever during runtime, we will deep freeze it.
let PREFABS = deepFreeze({
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
        category: CATEGORIES.fundamentals,
        args: [{ type: 'string-argument', label: '<folder>\\<modelname>.mdl' }],
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

let Command = Ember.Object.extend({
    cmd: null,
    category: null,
    args: [],
    comment: '',
    link: '',
    help: '',

    // TODO: this computed property should go on command component (if it can)
    string: function () {
        return this.toString();
    }.property('cmd', 'args.@each.value'),

    init: function () {
        this.set('args', this.get('args').map(function (obj) {
            if (!(obj.type in ARGUMENTS)) {
                throw new Error('Unknown Argument type: "' + obj.type + '"');
            }

            return ARGUMENTS[obj.type].create(obj);
        }));

        this._super();
    },

    toString: function () {
        var cmd = this.get('cmd'),
            args = this.get('args'),
            arr = [cmd].concat(args.map(function (arg) {
                return arg.toString();
            }));

        arr.removeObject('');

        return arr.join(' ');
    }
});

Command.reopenClass({
    ARGUMENTS: ARGUMENTS,
    CATEGORIES: CATEGORIES,
    PREFABS: (function () {
        let keys = {};

        Object.keys(PREFABS).forEach(function (key) {
            keys[key] = { cmd: key, category: PREFABS[key].category };
        });

        return keys;
    }()),

    createFromPrefab: function (cmd, comment) {
        if (!(cmd in Command.PREFABS)) {
            throw new Error('Unrecognized command: "' + cmd + '"');
        }

        // PREFABS is deeply frozen, so create a deep clone of the command schema object
        // so that Ember won't freak out if it tries to add meta properties to it
        let obj = Command.create(Ember.$.extend(true, { comment: comment }, PREFABS[cmd]));

        return obj;
    }
});

export default Command;
