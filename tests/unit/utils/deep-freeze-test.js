import { module, test } from 'qunit';
import deepFreeze from '../../../utils/deep-freeze';

module('Unit | Utils | deepFreeze');

test('it works', function (assert) {
    let obj = deepFreeze({ hi: 'there' });

    assert.ok(Object.isFrozen(obj), 'simple object is frozen');

    obj = deepFreeze({ how: { are: ['you', { doing: 'today?' }] } });

    assert.strictEqual(obj, deepFreeze(obj), 'deepFreeze returns the same object');
    assert.ok(Object.isFrozen(obj), 'base object is frozen');
    assert.ok(Object.isFrozen(obj.how), 'child object property is frozen');
    assert.ok(Object.isFrozen(obj.how.are), 'child array property is frozen');
    assert.ok(Object.isFrozen(obj.how.are[1]), 'object inside child array is frozen');
});
