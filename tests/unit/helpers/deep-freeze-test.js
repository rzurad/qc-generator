import { deepFreeze } from '../../../helpers/deep-freeze';
import { module, test } from 'qunit';

module('Unit | Helper | deep freeze');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = deepFreeze(42);
  assert.ok(result);
});
