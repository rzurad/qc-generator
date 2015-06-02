import { moduleFor, test } from 'ember-qunit';
import FloatArgument from '../../../models/float-argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:float-argument', 'Unit | Model | FloatArgument', {
    needs: [
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/numericality'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof FloatArgument !== 'undefined');
    assert.ok(typeof FloatArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), 0, 'default value is 0');
});

test('toString returns a stringified float to 8 precision points', function (assert) {
    let obj = this.subject({
            value: 123456.78987654321
        });

    assert.ok(typeof obj.toString() === 'string', 'toString returns string');
    assert.strictEqual(obj.toString(), '123456.78987654', 'toString truncates to 8 precision points');

    obj.set('value', 0xff);
    assert.strictEqual(obj.toString(), '255', 'toString converts hex');

    obj.set('value', 3.14e7);
    assert.strictEqual(obj.toString(), '31400000', 'toString converts exponent notation');

    obj.set('value', -3.14);
    assert.strictEqual(obj.toString(), '-3.14', 'toString converts negatives');
});

testValidPropertyValues('value', [1234, 0, -324, 0xff, 1.23e4, Math.PI, -Math.E, 1.337]);
testInvalidPropertyValues('value', [null, NaN, '', void 0, 'bad', false, Infinity]);
