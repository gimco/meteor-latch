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

Latch.isPaired = function () {
    var user = getUser();
    return !!user.latch;
};

Latch.isLocked = _.partial(Meteor.call, '_latchIsLocked');
Latch.pair = _.partial(Meteor.call, '_latchPair');
Latch.unpair = _.partial(Meteor.call, '_latchUnpair');