import Ember from 'ember';
import deepFreeze from '../helpers/deep-freeze';
import Argument from './argument';

let Command;
export default Command = Ember.Object.extend({
    output: function () {
        var cmd = this.get('cmd'),
            args = this.get('args');

        return [cmd].concat(args.map(function (arg) {
            var value = arg.get('value');

            switch (arg.type) {
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
        })).join(' ');
    }.property('cmd', 'args.@each.value')
});

let CATEGORIES = deepFreeze({
    fundamentals: 'Fundamentals',
    textures: 'Textures',
    performance: 'Performance',
    utility: 'Utility'
});

let COMMANDS = deepFreeze({
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
            label: 'SMD file',
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
            label: 'SMD file',
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
            label: 'MDL file path',
            'default': '<folder>\\<modelname>.mdl',
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
    $scale: {
        cmd: '$scale',
        category: CATEGORIES.utility,
        args: [{
            type: Argument.TYPES.float,
            label: 'Multiplier',
            'default': 1,
            validations: {
                value: { presence: true, numericality: true  }
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
