/*
 * Latch integration for Meteor framework
 * Copyright (C) 2015 Bruno Orcha García <gimcoo@gmail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

var crypto = Npm.require("crypto");

var LATCH_HOST = "https://latch.elevenpaths.com";
var LATCH_BASE = "/api/0.9";
var LATCH_AUTH_TEMPLATE = _.template("11PATHS <%=appId%> <%=signedData%>");

// {"error":{"code":201,"message":"Account not paired"}}
var LATH_ERROR_NOT_PAIRED = 201;

var isErrorNotPaired = function (response) {
    return !!response.error
        && response.error.code == LATH_ERROR_NOT_PAIRED;
};

var getAccountId = function (user) {
    if (!user.services || !user.services.latch
        || _.isUndefined(user.services.latch.accountId)) {
        throw new Meteor.Error(500, 'User not paired.');
    }
    return user.services.latch.accountId;
};

var getConfig = function () {
    var config = ServiceConfiguration.configurations.findOne({service:'latch'});
    check(config, Match.ObjectIncluding({secret: Object}));
    check(config.secret, {appId: String, secretKey: String});
    return config.secret;
};

var httpRequest = function (config, service, param) {
    var path = [LATCH_BASE, service, param].join("/");
    var url = LATCH_HOST + path;

    var utc = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    var hmac = crypto.createHmac("sha1", config.secretKey);
    hmac.setEncoding("base64");
    hmac.write(["GET", utc, "", path].join("\n"));
    hmac.end();

    var auth = LATCH_AUTH_TEMPLATE({
        appId: config.appId,
        signedData: hmac.read()
    });
    res = HTTP.get(url, {
        headers: {
            "Authorization": auth,
            "X-11Paths-Date": utc
        }
    });
    return res.data;
};

Latch.isLocked = function (user) {
    if (!user) {
        user = getUser();
    }
    var accountId = getAccountId(user);
    var config = getConfig();
    var response = httpRequest(config, "status", accountId);
    // The latch information is incorrect! Auto unpair
    if (_.isObject(response) && isErrorNotPaired(response)) {
        Meteor.users.update(
            {_id: user._id},
            {$unset:{
                'services.latch':1,
                'latch':1
            }}
        );
        throw new Meteor.Error(500, 'User not paired.');
    }
    return response.data.operations[config.appId].status === 'off';
};

Latch.pair = function (token) {
    check(token, String);
    var user = getUser();
    var config = getConfig();

    var response = "";
    try {
        response = httpRequest(config, "pair", token);
        var accountId = response.data.accountId;
        Meteor.users.update(
            {_id: user._id},
            {$set:{
                'services.latch.accountId':accountId,
                'latch':true
            }}
        );
        return true;
    } catch(e) {
        console.log(e, response);
        throw new Meteor.Error(500, 'Error pairing');
    }
};

Latch.unpair = function () {
    var user = getUser();
    var accountId = getAccountId(user);
    var config = getConfig();

    var response = "";
    try {
        response = httpRequest(config, "unpair", accountId);
        if (_.isObject(response)
                && (_.isEmpty(response) || isErrorNotPaired(response))) {
            Meteor.users.update(
                {_id: Meteor.userId()},
                {$unset:{
                    'services.latch':1,
                    'latch':1
                }}
            );
        }
        return true;
    } catch(e) {
        console.log(e, response);
        throw new Meteor.Error(500, 'Error unpairing');
    }
};

Meteor.methods({
    _latchIsLocked: function() {
        var user = getUser();
        try {
            return Latch.isLocked(user);
        } catch (e) {
            return true;
        }
    },
    _latchPair: Latch.pair,
    _latchUnpair: Latch.unpair
});

Accounts.validateLoginAttempt(function (attempt) {
    if (!attempt.user || !attempt.user.latch) {
        return true;
    }
    var locked = Latch.isLocked(attempt.user);
    if (locked) {
        throw new Meteor.Error(403, 'Account is locked');
    }
    return true;
});
// Accounts.addAutopublishFields({forLoggedInUser:['latch']});
Meteor.publish("_latchField", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'latch': 1}});
  } else {
    this.ready();
  }
});
