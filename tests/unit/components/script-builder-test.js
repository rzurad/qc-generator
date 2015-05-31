import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

let App;

moduleForComponent('script-builder', {
    // Specify the other units that are required for this test
    setup: function () {
        App = startApp();
    },

    teardown: function () {
        Ember.run(App, 'destroy');
    }
});

test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();

    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();

    assert.equal(component._state, 'inDOM');
});
