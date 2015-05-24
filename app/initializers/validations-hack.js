// EmberValidations is in alpha and still has remenants of version 1, which was really
// only useful on controllers. EV assumes that anything it's mixed into will have a reference
// to the container. This is not true. Our Argument Objects do not have a
// reference to the container, so any time you create an Argument object, EV throws an
// error while trying to lookup factories on the container.
//
// This initializer is a hack to grab a reference to the App container and add it to the
// Argument prototype so that each Argument instance can look up validators on the container.
//
// This hack will go away when EV is out of alpha and (hopefully) removes all their deprecation
// warnings
import Argument from '../models/argument';

export function initialize(container/*, application */) {
    Argument.reopen({ container: container });
}

export default {
    name: 'validations-hack',
    initialize: initialize
};
