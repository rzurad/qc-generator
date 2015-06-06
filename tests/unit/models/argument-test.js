import { moduleFor, test } from 'ember-qunit';
import Argument from '../../../models/argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:argument', 'Unit | Model | Argument', {
    needs: [
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/numericality',
        'ember-validations@validator:local/inclusion'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof Argument !== 'undefined');
    assert.ok(typeof Argument.create === 'function');
});

test('can create', function (assert) {
    let arg = this.subject({
            label: 'Test Argument'
        });

    assert.ok(Argument.detectInstance(arg), 'arg is an Argument');
    assert.strictEqual(arg.get('label'), 'Test Argument', 'arg has label set correctly');
    assert.strictEqual(arg.get('value'), null, 'arg property is defined');
    assert.strictEqual(arg.get('default'), null, 'default property is defined');
    assert.strictEqual(arg.get('many'), false, 'many is false by default');
    assert.ok(typeof arg.copy === 'function', 'has copy function');
    assert.ok(typeof arg.toString === 'function', 'has toString function');
});

test('value is assigned default when given on create', function (assert) {
    let obj = this.subject({ default: 42 });

    assert.strictEqual(obj.get('value'), 42, 'default value is set correctly when given on create');
});

test('toString returns value cast to a string', function (assert) {
    assert.strictEqual(this.subject({ value: 42 }).toString(), '42', 'toString works');
});

test('toString returns key/value-pair arguments correctly', function (assert) {
    let obj = this.subject({ default: 42, isKeyValue: true, label: 'meaning' });

    assert.strictEqual(obj.toString(), 'meaning 42', 'key/value pair arguments are rendered correctly');
});

test('validations given on create stack with base validations', function (assert) {
    let obj = this.subject({
            value: '',
            validations: {
                value: { numericality: true }
            }
        });

    obj.validate().then(function () {
        assert.ok(false, 'new empty argument should not validate');
    }).catch(function () {
        let errors = obj.get('errors.value');

        assert.strictEqual(errors.length, 2, 'two errors exist');
        assert.ok(errors.indexOf("can't be blank") > -1, 'presence error exists');
        assert.ok(errors.indexOf('is not a number') > -1, 'numericality error exists');
    });
});

test('inclusion validations work', function (assert) {
    let obj = this.subject({
            value: 'X',
            validations: {
                value: { inclusion: { in: ['X', 'Y', 'Z'] } }
            }
        });

    assert.deepEqual(obj.get('allowedValues'), [
        { label: 'X', value: 'X' },
        { label: 'Y', value: 'Y' },
        { label: 'Z', value: 'Z' }
    ], '`allowedValues` is correctly set when an inclusive validator is used');

    obj.validate().then(function () {
        assert.ok(true, 'argument validates by default');
    }).catch(function () {
        assert.ok(false, 'argument validates by default');
    });

    obj.set('value', 'T');

    obj.validate().then(function () {
        assert.ok(false, 'argument should not validate');
    }).catch(function () {
        assert.ok(true, 'argument should not validate');
    });
});

test('inclusion validations accept label/value hashes', function (assert) {
    let allowed = [
            { label: 'X Axis', value: 'X' },
            { label: 'Y Axis', value: 'Y' },
            { label: 'Z Axis', value: 'Z' }
        ];

    let obj = this.subject({
            value: 'X',
            validations: {
                value: { inclusion: { in: allowed } }
            }
        });

    assert.deepEqual(
        obj.get('allowedValues'),
        allowed,
        '`allowedValues` is correctly set when inclusion validator is used'
    );

    obj.validate().then(function () {
        assert.ok(true, 'argument validates by default');
    }).catch(function () {
        assert.ok(false, 'argument validates by default');
    });

    obj.set('value', 'T');

    obj.validate().then(function () {
        assert.ok(false, 'argument should not validate');
    }).catch(function () {
        assert.ok(true, 'argument should not validate');
    });
});

test('can copy', function (assert) {
    let obj1 = this.subject({
            value: 42,
            label: 'zomg',
            default: 93,
            validations: { value: { inclusion: { in: [42, 93] } } },
            many: true
        });

    let obj2 = obj1.copy();

    assert.ok(obj1 !== obj2, 'object and copy are not the same object');
    assert.strictEqual(obj1.get('value'), obj2.get('value'), 'value is copied');
    assert.strictEqual(obj1.get('label'), obj2.get('label'), 'label is copied');
    assert.strictEqual(obj1.get('default'), obj2.get('default'), 'default is copied');
    assert.deepEqual(obj1.get('_validations'), obj2.get('_validations'), '_validations cache is copied');
    assert.deepEqual(obj1.get('allowedValues'), obj2.get('allowedValues'), 'allowedValues is copied');
    assert.strictEqual(obj1.get('many'), obj2.get('many'), 'many is copied');
});

testValidPropertyValues('value', ['test', 'X', '12']);
testInvalidPropertyValues('value', ['']);
