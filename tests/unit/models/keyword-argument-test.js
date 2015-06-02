import { moduleFor, test } from 'ember-qunit';
import KeywordArgument from '../../../models/keyword-argument';
import {
    testValidPropertyValues,
    testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('model:keyword-argument', 'Unit | Model | KeywordArgument', {
    needs: [
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/format'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof KeywordArgument !== 'undefined');
    assert.ok(typeof KeywordArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), '', 'default value is the empty string');
});

testValidPropertyValues('value', ['hello', 'x', 'dear_john', '__yo__', 'Hello', 'thERE']);
testInvalidPropertyValues('value', ['', '23abd', 'abc-hello', 'abc hello', 'abc\nhello', '\\%$#@S/', '$no']);
