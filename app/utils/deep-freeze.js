export function deepFreeze(obj) {
    Object.freeze(obj); // First freeze the object.

    for (let propKey in obj) {
        let prop = obj[propKey];

        if (!obj.hasOwnProperty(propKey) || typeof prop !== 'object' || Object.isFrozen(prop)) {
            // If the object is on the prototype, not an object, or is already frozen,
            // skip it. Note that this might leave an unfrozen reference somewhere in the
            // object if there is an already frozen object containing an unfrozen object.
            continue;
        }

        deepFreeze(prop); // Recursively call deepFreeze.
    }

    return obj;
}

export default deepFreeze;
