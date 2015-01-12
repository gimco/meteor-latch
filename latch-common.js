if (typeof Latch === 'undefined') {
  Latch = {};
}

getUser = function () {
    var user = Meteor.user();
    if (!user) {
        throw new Meteor.Error(500, 'Not logged user');
    }
    return user;
};