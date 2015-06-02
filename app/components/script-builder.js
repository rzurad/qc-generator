import Ember from 'ember';
import Command from '../models/command';

/* global saveAs, ClipboardEvent */

export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['script-builder', 'sections'],
    showNewCommandEditor: false,
    isDownloadAvailable: typeof Blob !== 'undefined',
    filename: 'generated.qc',
    validationTrigger: 0,

    commands: Object.keys(Command.COMMANDS).map(function (key) {
        return Ember.$.extend(true, {}, Command.COMMANDS[key]);
    }),

    script: [],

    change: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('#new-command select')) {
            this.get('script').pushObject(Command.createByType($target.val()));
            this.set('showNewCommandEditor', false);
        }
    },

    validate: function () {
        let instance = this;

        return new Ember.RSVP.Promise(function (resolve, reject) {
            instance.incrementProperty('validationTrigger');

            Ember.run.scheduleOnce('afterRender', instance, function () {
                if (Ember.$(this.get('element')).find('.is-invalid').length) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    },

    toArray: function () {
        let arr = [];

        this.get('script').forEach(function (cmd) {
            let string,
                comment = cmd.get('comment');

            if (comment) {
                arr.push(comment);
            }

            string = cmd.get('string');
            arr.push(comment ? string + '\r\n' : string);
        });

        return arr;
    },

    toString: function () {
        return this.toArray().join('\r\n');
    },

    actions: {
        addCommand: function () {
            this.set('showNewCommandEditor', true);
        },

        deleteCommand: function (command) {
            this.get('script').removeObject(command);
        },

        replaceCommand: function (command, type) {
            let script = this.get('script'),
                index = script.indexOf(command);

            script.removeAt(index);
            script.insertAt(index, Command.createByType(type, command.get('comment')));
        },

        download: function () {
            let instance = this;

            this.validate().then(function () {
                let script = instance.toString(),
                    filename = instance.get('filename');

                saveAs(new Blob([script], { type: 'text/plain;charset=utf-8' }), filename);
            }, function () {
                console.log('no go on download');
            });
        },

        copyToClipboard: function () {
            function showTooltip(msg, isError) {
                console.log(msg, isError);
            }

            this.validate().then(function () {
                if (document.queryCommandSupported('copy')) {
                    let event = new ClipboardEvent('copy', { dataType: 'text/plain', data: 'hello from the clipboard!' });
                    document.dispatchEvent(event);
                    showTooltip('success');
                } else {
                    showTooltip('not supported', true);
                }
            }, function () {
                showTooltip('not validated', true);
            });
        }
    }
});
