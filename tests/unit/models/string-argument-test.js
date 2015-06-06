import { moduleFor, test } from 'ember-qunit';
import StringArgument from '../../../models/string-argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:string-argument', 'Unit | Model | StringArgument', {
    needs: [
        'ember-validations@validator:local/presence'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof StringArgument !== 'undefined');
    assert.ok(typeof StringArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), '', 'default value is the empty string');
});

test('toString returns value wrapped in quotes', function (assert) {
    let obj = this.subject({ value: 42 });

    assert.strictEqual(obj.toString(), '"42"', 'toString works');
});

test('toString escapes double-quotes', function (assert) {
    let obj = this.subject({ value: 'som"thing' });

    assert.strictEqual(obj.toString(), '"som\\"thing"', 'double-quotes are escaped');
});

test('toString works for isKeyValue', function (assert) {
    let obj = this.subject({ value: 'never change', label: 'some_things', isKeyValue: true });

    assert.strictEqual(obj.toString(), 'some_things "never change"', 'toString works for isKeyValue');
});

testValidPropertyValues(
    'value',
    ['a', 'qwertyuiopasdfghjklzxcvbnm', '1234567890', '!@#$%^&*()_+=-{}[];\':",.<>/?]`~\\ |']
);
testInvalidPropertyValues('value', ['']);
