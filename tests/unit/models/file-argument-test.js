import { moduleFor, test } from 'ember-qunit';
import FileArgument from '../../../models/file-argument';

moduleFor('model:file-argument', 'Unit | Model | FileArgument', {
    needs: [
        'ember-validations@validator:local/presence'
    ]
});

test('it exists', function (assert) {
    assert.ok(typeof FileArgument !== 'undefined');
    assert.ok(typeof FileArgument.create === 'function');
});

test('can be created', function (assert) {
    let obj = this.subject();

    assert.strictEqual(obj.get('value'), '', 'default value is the empty string');
});
