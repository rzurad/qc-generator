import { moduleFor, test } from 'ember-qunit';

moduleFor('view:application', 'Unit | View | application');

test('it exists', function (assert) {
    var view = this.subject();

    assert.ok(view);
    assert.ok(
        view.get('classNames').indexOf('application') > -1,
        'application view element has application class'
    );
});
