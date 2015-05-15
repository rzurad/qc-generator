import Ember from 'ember';
import config from './config/environment';

var Router;

Router = Ember.Router.extend({
    location: config.locationType
});

export default Router.map(function () {});
