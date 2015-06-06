import { moduleFor, test } from 'ember-qunit';
import BoolArgument from '../../../models/bool-argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:bool-argument', 'Unit | Model | BoolArgument', {
    needs: [
        'ember-validations@validator:local/inclusion'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof BoolArgument !== 'undefined');
    assert.ok(typeof BoolArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), 'yes', 'default value is yes');
});

test('toString returns label if value is yes', function (assert) {
    assert.strictEqual(
        this.subject({ label: 'hello' }).toString(),
        'hello',
        'label is given by toString()'
    );
});

test('toString returns empty string if value is no', function (assert) {
    assert.strictEqual(
        this.subject({ label: 'hello', value: 'no' }).toString(),
        '',
        'toString() gives empty string'
    );
});

test('toString ignores iKeyValue', function (assert) {
    assert.strictEqual(
        this.subject({ label: 'hello', isKeyValue: true }).toString(),
        'hello',
        'toString ignores isKeyValue'
    );
});

testValidPropertyValues('value', ['yes', 'no']);
testInvalidPropertyValues('value', [
    '',
    true,
    false,
    'true',
    'false',
    '0',
    '1',
    0,
    1,
    'Yes',
    'No',
    'YES',
    'NO',
    null,
    void 0
]);
