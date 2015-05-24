import { module, test } from 'qunit';
import Command from '../../../models/command';

module('Unit | Model | Command');

test('it exists', function (assert) {
    assert.ok(typeof Command !== 'undefined');

    assert.ok(typeof Command.CATEGORIES === 'object');
    assert.ok(Object.isFrozen(Command.CATEGORIES));
    assert.ok(typeof Command.COMMANDS === 'object');
    assert.ok(Object.isFrozen(Command.COMMANDS));
    assert.ok(typeof Command.TYPES === 'object');
    assert.ok(Object.isFrozen(Command.TYPES));
});
