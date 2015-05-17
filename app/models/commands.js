import Ember from 'ember';
import { ARG_TYPES, argFactory } from './args';
import config from '../config/environment';

var COMMANDS = {
        $modelname: {
            cmd: '$modelname',
            required: true,
            category: 'Fundamentals',
            args: [ARG_TYPES.file],
            link: 'https://developer.valvesoftware.com/wiki/$modelname',
            help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <a href="https://developer.valvesoftware.com/wiki/Game_Directory" target="_blank">Game Directory</a>.'
        },
        $staticprop: {
            cmd: '$staticprop',
            category: 'Performance',
            args: [],
            link: 'https://developer.valvesoftware.com/wiki/$staticprop',
            help: 'Specifies that the model being compiled does not have any moving parts.'
        }
    };

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

    let obj = Ember.Object.create(COMMANDS[command]);

    obj.comment = typeof comment === 'string' ? comment : '';
    /*
    obj.args = COMMANDS[command].args.map(function (arg) {
        return argFactory(arg);
    });
    */

    return obj;
}

export default commandFactory;