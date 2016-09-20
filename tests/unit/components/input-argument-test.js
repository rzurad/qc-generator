import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Argument from '../../../models/argument';
import IntArgument from '../../../models/int-argument';
import KeywordArgument from '../../../models/keyword-argument';
import StringArgument from '../../../models/string-argument';
import BoolArgument from '../../../models/bool-argument';

moduleForComponent('input-argument', 'Unit | Component | input argument', {
    needs: [
        'template:bool-argument',
        'template:string-argument',
        'template:keyword-argument',
        'template:int-argument',
        'ember-validations@validator:local/presence',
        'ember-validations@validator:local/numericality',
        'ember-validations@validator:local/inclusion'
    ],
    beforeEach: function () {
        // ember-validations hack
        Argument.reopen({ container: this.container });
    }
});

test('it renders in its default state', function (assert) {
    let component = this.subject();

    assert.equal(component._state, 'preRender');

    this.render();

    assert.equal(component._state, 'inDOM');
    assert.ok(this.$().is('.argument'), 'has argument class on element');
    assert.ok(!component.get('isTouched'), 'not isTouched on init');
    assert.ok(!component.get('isInputFocused'), 'not focused on init');
    assert.ok(!component.get('isInvalid'), 'component is valid on init');
    assert.ok(!component.get('showErrorTooltip'), 'tooltip is not showing on init');
    assert.strictEqual(component.get('value'), '', 'default value is empty string');
    assert.strictEqual(component.get('argument'), null, 'default null argument');
});

test('has proper classNameBindings', function (assert) {
    let component = this.subject({ argument: StringArgument.create() });

    Ember.run(() => {
        assert.ok(this.$().is('.string-argument'), 'element gets argument type as css class');
        assert.ok(!component.get('isInvalid'), 'component is valid');
        assert.ok(!this.$().is('.is-invalid'), 'element does not have is-invalid css class');
        assert.ok(!this.$().is('.is-key-value'), 'element does not have the is-key-value class');
    });

    Ember.run(() => {
        component.set('argument', KeywordArgument.create({ isKeyValue: true }));
        component.set('isTouched', true);
    });

    assert.ok(component.get('isInvalid'), true, 'argument is invalid');
    assert.ok(this.$().is('.is-invalid'), 'element has is-invalid css class');
    assert.ok(this.$().is('.is-key-value'), 'element has is-key-value css class');
});

test('errors property is stringified error messages', function (assert) {
    let obj = this.subject({ argument: IntArgument.create() });

    assert.ok(obj.get('argument.isValid'), 'argument is valid');
    assert.strictEqual(obj.get('errors'), '', 'errors property is empty string');

    obj.set('value', '');
    obj.get('argument').validate().then(() => {
        assert.ok(false, 'argument should be invalid');
    }).catch(() => {
        assert.ok(!obj.get('isInvalid'), 'component is invalid');
        assert.ok(obj.get('errors'), "can't be blank, is not a number");
    });
});

test('component is only invalid if isTouched', function (assert) {
    let obj = this.subject({ argument: StringArgument.create() });

    assert.ok(obj.get('argument.isInvalid'), 'argument is invalid');
    assert.ok(!obj.get('isTouched'), 'component is not touched yet');
    assert.ok(!obj.get('isInvalid'), 'component is not invalid');

    Ember.run(() => {
        obj.set('isTouched', true);
    });

    assert.ok(obj.get('isInvalid'), 'component is now invalid');

    Ember.run(() => {
        obj.set('value', 'hi');
    });

    assert.ok(!obj.get('isInvalid'), 'component is now valid');
});

test('requestValidaiton causes component to be touched and sends validation request', function (assert) {
    assert.expect(4);

    let obj = this.subject({ argument: StringArgument.create() }),
        target = {
            actionReceiver: function () {
                assert.ok(true, 'validate action was called');
            }
        };

    this.$();
    obj.set('validate', 'actionReceiver');
    obj.set('targetObject', target);

    assert.ok(!obj.get('isTouched'), 'component is not yet touched');

    Ember.run(() => {
        obj.requestValidation();
    });

    assert.ok(obj.get('isTouched'), 'component is now touched');
    assert.ok(obj.get('isInvalid'), 'component is now invalid');
});

test('component value is set to arugment value on init', function (assert) {
    let obj = this.subject({ argument: IntArgument.create({ value: 42 }) });

    this.$();

    assert.strictEqual(
        obj.get('value'),
        obj.get('argument.value'),
        'component has been assigned argument value'
    );
});

test('label is drawn if isKeyValue', function (assert) {
    let obj = this.subject({ argument: StringArgument.create({ label: 'hello', isKeyValue: true }) });

    Ember.run(() => {
        this.$();
    });

    let $label = this.$().find('.arg-label');

    assert.strictEqual($label.length, 1, 'label element exists');
    assert.strictEqual($label.text(), 'hello:', 'label text is correct');
});

test('add icon is not visible unless argument is `many`', function (assert) {
    let obj = this.subject({ argument: StringArgument.create() });

    Ember.run(() => {
        this.$();
    });

    assert.strictEqual(this.$().find('.add').length, 0, 'there is no add icon');
    assert.strictEqual(this.$().find('.remove').length, 0, 'there is no remove icon');
});

test('add action is sent when add icon is clicked', function (assert) {
    assert.expect(1);

    let obj = this.subject({ argument: StringArgument.create({ many: true }) }),
        target = {
            actionReceiver: function () {
                assert.ok(true, 'add action was sent');
            }
        };

    Ember.run(() => {
        this.$();
        obj.set('add', 'actionReceiver');
        obj.set('targetObject', target);
    });

    this.$().find('.add').click();
});

test('remove action is sent when remove icon is clicked', function (assert) {
    assert.expect(1);

    let obj = this.subject({ argument: StringArgument.create({ many: true }) }),
        target = {
            actionReceiver: function () {
                assert.ok(true, 'remove action was setn');
            }
        };

    Ember.run(() => {
        this.$();
        obj.set('remove', 'actionReceiver');
        obj.set('targetObject', target);
    });

    this.$().find('.remove').click();
});
