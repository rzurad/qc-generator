import { moduleFor, test } from 'ember-qunit';
import IntArgument from '../../../models/int-argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:int-argument', 'Unit | Model | IntArgument', {
    needs: [
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/numericality'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof IntArgument !== 'undefined');
    assert.ok(typeof IntArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), 0, 'default value is 0');
});

test('toString returns a stringified integer', function (assert) {
    let obj = this.subject({
            value: 123456.00032
        });

    assert.ok(typeof obj.toString() === 'string', 'toString returns string');
    assert.strictEqual(obj.toString(), '123456', 'toString truncates floats');

    obj.set('value', 0xff);
    assert.strictEqual(obj.toString(), '255', 'toString converts hex');

    obj.set('value', 3.14e7);
    assert.strictEqual(obj.toString(), '31400000', 'toString converts exponent notation');

    obj.set('value', -42);
    assert.strictEqual(obj.toString(), '-42', 'toString converts negatives');
});

test('toString works for isKeyValue', function (assert) {
    let obj = this.subject({ label: 'pie', value: 3, isKeyValue: true });

    assert.strictEqual(obj.toString(), 'pie 3', 'toString works for isKeyValue');
});

testValidPropertyValues('value', [1234, 0, -324, 0xff, 1.23e4]);
testInvalidPropertyValues('value', [null, NaN, '', void 0, 3.141, 'bad', false, Infinity]);
