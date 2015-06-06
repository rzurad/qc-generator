import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Command from '../../../models/command';
import Argument from '../../../models/argument';

moduleFor('model:command', 'Unit | Model | Command', {
    needs: [
        'ember-validations@validator:local/inclusion',
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/format',
        'ember-validations@validator:local/numericality'
    ],
    beforeEach: function () {
        // make ember-validations happy (see app/initializers/validations-hack.js for more info)
        Argument.reopen({ container: this.container });
    }
});

test('it exists', function (assert) {
    assert.ok(typeof Command !== 'undefined', 'imports');
    assert.ok(typeof Command.create === 'function', 'has create function');

    assert.ok(typeof Command.CATEGORIES === 'object', 'Class has CATEGORIES object');
    assert.ok(typeof Command.PREFABS === 'object', 'Class has PREFABS object');
    assert.ok(typeof Command.ARGUMENTS === 'object', 'Class has ARGUMENTS object');
    assert.ok(!Object.isFrozen(Command.ARGUMENTS), 'ARGUMENTS is not frozen');
    
    Command.ARGUMENTS.blah = Ember.Object.extend();

    assert.ok(typeof Command.ARGUMENTS.blah === 'function', 'Constructors can be placed on ARGUMENTS');
    assert.ok(this.subject() instanceof Command, 'can create');
});

test('toString works correctly', function (assert) {
    let obj = this.subject({
            cmd: '$staticprop',
            comment: '// this is a comment',
            link: 'fake.com',
            help: 'Call 911'
        });

    assert.strictEqual(obj.toString(), '$staticprop', 'command with no arguments toStrings correctly');
    assert.strictEqual(obj.get('comment'), '// this is a comment', 'comment is not put in toString');
});

test('toString works removes extra spaces when argument.toString returns an empty string', function (assert) {
    let obj = this.subject({
        cmd: '$animation',
        args: [
            { type: 'string-argument', value: 'hi' },
            { type: 'bool-argument', label: 'loop', value: 'no' },
            { type: 'int-argument', value: 123 }
        ]
    });

    assert.strictEqual(obj.toString(), '$animation "hi" 123', 'spaces between arguments is correct when an argument gives an empty string');
});

test('createFromPrefab works', function (assert) {
    let obj = Command.createFromPrefab('$modelname');

    assert.strictEqual(obj.get('cmd'), '$modelname', 'cmd works');
    assert.strictEqual(obj.get('category'), Command.CATEGORIES.fundamentals, 'category works');
    assert.strictEqual(obj.get('link'), 'https://developer.valvesoftware.com/wiki/$modelname', 'link works');
    assert.ok(typeof obj.get('help') === 'string' && obj.get('help').length, 'help works');
    assert.strictEqual(obj.get('args').length, 1, 'there is one argument');

    let arg = obj.get('args')[0];

    assert.strictEqual(arg.get('type'), 'string-argument', 'string-argument exists');
    assert.strictEqual(arg.get('value'), '', 'default value of argument set');
    assert.strictEqual(arg.get('label'), '<folder>\\<modelname>.mdl', 'label is set');
});

test('createFromPrefab accepts comment', function (assert) {
    let obj = Command.createFromPrefab('$modelname', '// this is a comment');

    assert.strictEqual(obj.get('comment'), '// this is a comment');
});

test('all PREFABS work', function (assert) {
    let keys = Object.keys(Command.PREFABS);

    assert.expect(keys.length);

    keys.forEach(function (key) {
        assert.ok(Command.createFromPrefab(key) instanceof Command, key + ' works');
    });
});

test('createFromPrefab throws error on unknown prefab', function (assert) {
    assert.throws(function () { Command.createFromPrefab(); }, Error, 'error thrown when given no arguments');
    assert.throws(function () { Command.createFromPrefab('bogus'); }, Error, 'error thrown on bogus prefab');
});
