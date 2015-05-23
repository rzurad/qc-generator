import Ember from 'ember';
import config from '../config/environment';
import { commandFactory, COMMANDS, CMD_TYPES } from '../models/commands';

/* global saveAs */

export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['script-builder', 'sections'],
    showNewCommandEditor: false,
    isDownloadAvailable: typeof Blob !== 'undefined',
    filename: 'qc-generator.qc',

    commands: Object.keys(COMMANDS).map(function (key) {
        return Ember.$.extend(true, {}, COMMANDS[key]);
    }),

    script: [
        commandFactory(CMD_TYPES.$modelname, '// Generated by http://blackmesasource/qc v' + config.version)
    ],

    isValid: function () {
        return this.get('childViews').every(function (cmdComponent) {
            return cmdComponent.get('isValid');
        });
    }.property('childViews.@each.isValid'),

    disabledClass: function () {
        return this.get('isValid') ? '' : 'disabled';
    }.property('isValid'),

    change: function (e) {
        var $target = Ember.$(e.target);

        if ($target.is('#new-command select')) {
            this.get('script').pushObject(commandFactory($target.val()));
            this.set('showNewCommandEditor', false);
        }
    },

    toArray: function() {
        var arr = [];

        this.get('script').forEach(function (cmd) {
            var output,
                comment = cmd.get('comment');

            if (comment) {
                arr.push(comment);
            }

            output = cmd.get('output');
            arr.push(comment ? output + '\r\n' : output);
        });

        return arr;
    },

    toString: function () {
        return this.toArray().join('\r\n');
    },

    validateScript: function () {
        this.get('childViews').forEach(function (cmdComponent) {
            cmdComponent.get('command.args').forEach(function (arg) {
                arg.validate();
            });

            cmdComponent.send('validation');
        });
    },

    actions: {
        addCommand: function () {
            this.set('showNewCommandEditor', true);
        },

        deleteCommand: function (command) {
            this.get('script').removeObject(command);
        },

        replaceCommand: function (command, type) {
            var script = this.get('script'),
                index = script.indexOf(command);

            script.removeAt(index);
            script.insertAt(index, commandFactory(type, command.get('comment')));
        },

        download: function () {
            this.validateScript();

            if (this.get('isValid')) {
                saveAs(new Blob([this.toString()], { type: 'text/plain;charset=utf-8' }), this.get('filename'));
            }
        },

        copyToClipboard: function () {
            this.validateScript();

            if (this.get('isValid')) {
                //var event = new ClipboardEvent('copy', { dataType: 'text/plain', data: 'hello from the clipboard!' });
                //document.dispatchEvent(event);
            }
        }
    }
});
