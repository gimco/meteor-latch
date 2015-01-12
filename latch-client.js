
Latch.isPaired = function () {
    var user = getUser();
    return !!user.latch;
};

Latch.isLocked = _.partial(Meteor.call, '_latchIsLocked');
Latch.pair = _.partial(Meteor.call, '_latchPair');
Latch.unpair = _.partial(Meteor.call, '_latchUnpair');