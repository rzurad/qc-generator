import { module, test } from 'qunit';
import Argument from '../../../models/argument';

module('Unit | Model | Argument');

test('it exists', function (assert) {
    assert.ok(typeof Argument !== 'undefined');

    assert.ok(typeof Argument.TYPES === 'object');
    assert.ok(Object.isFrozen(Argument.TYPES));
});
