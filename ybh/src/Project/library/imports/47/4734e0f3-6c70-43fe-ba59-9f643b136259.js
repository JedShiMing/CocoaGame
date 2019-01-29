"use strict";
cc._RF.push(module, '4734eDzbHBD/rpZn2Q7E2JZ', 'af-fast-hash');
// framework/utils/af-fast-hash.js

'use strict';

/**
 * 快速hash
 */

var Long = require('long');
var ByteBuffer = require('bytebuffer');

var fastHash = {

    fasthash64: function fasthash64(buff) {
        var seed_low = 0;
        var seed_high = 0;
        var m = Long.fromString("0x880355f21e6d1965", true, 16);
        var k = Long.fromString("0x2127599bf4325c37", true, 16);
        var h = new Long(seed_low, seed_high, true);
        var len = buff.length;

        var lenmm = new Long(len, 0, true);
        var mm = lenmm.multiply(m);
        h = h.xor(mm);
        var bb = ByteBuffer.wrap(buff);

        while (len - bb.offset >= 8) {
            var L1 = bb.readUint8();
            var L2 = bb.readUint8();
            var L3 = bb.readUint8();
            var L4 = bb.readUint8();

            var H1 = bb.readUint8();
            var H2 = bb.readUint8();
            var H3 = bb.readUint8();
            var H4 = bb.readUint8();

            var pos_high = H4 * 0x1000000 + H3 * 0x10000 + H2 * 0x100 + H1;
            var pos_low = L4 * 0x1000000 + L3 * 0x10000 + L2 * 0x100 + L1;

            var v = new Long(pos_low, pos_high, true);
            v = v.xor(v.shiftRightUnsigned(23));
            v = v.multiply(k);
            var v1 = new Long(v.low, v.high, true);
            v1 = v1.shiftRightUnsigned(47);
            v = v.xor(v1);
            h = h.xor(v);
            h = h.multiply(m);
        }

        var index = len & 7;
        if (index < 8 && index > 0) {
            var L1 = 0;
            var L2 = 0;
            var L3 = 0;
            var L4 = 0;

            var H1 = 0;
            var H2 = 0;
            var H3 = 0;
            var H4 = 0;

            if (bb.offset < len) {
                L1 = bb.readUint8();
            }
            if (bb.offset < len) {
                L2 = bb.readUint8();
            }
            if (bb.offset < len) {
                L3 = bb.readUint8();
            }
            if (bb.offset < len) {
                L4 = bb.readUint8();
            }
            if (bb.offset < len) {
                H1 = bb.readUint8();
            }
            if (bb.offset < len) {
                H2 = bb.readUint8();
            }
            if (bb.offset < len) {
                H3 = bb.readUint8();
            }
            if (bb.offset < len) {
                H4 = bb.readUint8();
            }

            var pos_high = H4 * 0x1000000 + H3 * 0x10000 + H2 * 0x100 + H1;
            var pos_low = L4 * 0x1000000 + L3 * 0x10000 + L2 * 0x100 + L1;

            var v = new Long(pos_low, pos_high, true);
            var v1 = new Long(v.low, v.high, true);
            v1 = v1.shiftRightUnsigned(23);
            v = v.xor(v1);
            v = v.multiply(k);
            var v2 = new Long(v.low, v.high, true);
            v2 = v2.shiftRightUnsigned(47);
            v = v.xor(v2);
            h = h.xor(v);
            h = h.multiply(m);
        }

        var h1 = new Long(h.low, h.high, true);
        h1 = h1.shiftRightUnsigned(23);
        h = h.xor(h1);
        h = h.multiply(k);
        var h2 = new Long(h.low, h.high, true);
        h2 = h2.shiftRightUnsigned(47);
        h = h.xor(h2);
        return h.toString();
    },

    fasthash64x: function fasthash64x(buff) {
        var seed_low = 0;
        var seed_high = 0;
        var m = Long.fromString("0x880355f21e6d1965", true, 16);
        var k = Long.fromString("0x2127599bf4325c37", true, 16);
        var h = new Long(seed_low, seed_high);
        var len = buff.length;

        var lenmm = new Long(len, 0);
        var mm = lenmm.multiply(m);
        h = h.xor(mm);
        var bb = ByteBuffer.wrap(buff);

        while (len - bb.offset >= 8) {
            var L1 = bb.readUint8();
            var L2 = bb.readUint8();
            var L3 = bb.readUint8();
            var L4 = bb.readUint8();

            var H1 = bb.readUint8();
            var H2 = bb.readUint8();
            var H3 = bb.readUint8();
            var H4 = bb.readUint8();

            var pos_high = H4 * 0x1000000 + H3 * 0x10000 + H2 * 0x100 + H1;
            var pos_low = L4 * 0x1000000 + L3 * 0x10000 + L2 * 0x100 + L1;

            var v = new Long(pos_low, pos_high);
            v = v.xor(v.shiftRightUnsigned(23));
            v = v.multiply(k);
            var v1 = new Long(v.low, v.high, true);
            v1 = v1.shiftRightUnsigned(47);
            v = v.xor(v1);
            h = h.xor(v);
            h = h.multiply(m);
        }

        var index = len & 7;
        if (index < 8 && index > 0) {
            var L1 = 0;
            var L2 = 0;
            var L3 = 0;
            var L4 = 0;

            var H1 = 0;
            var H2 = 0;
            var H3 = 0;
            var H4 = 0;

            if (bb.offset < len) {
                L1 = bb.readUint8();
            }
            if (bb.offset < len) {
                L2 = bb.readUint8();
            }
            if (bb.offset < len) {
                L3 = bb.readUint8();
            }
            if (bb.offset < len) {
                L4 = bb.readUint8();
            }
            if (bb.offset < len) {
                H1 = bb.readUint8();
            }
            if (bb.offset < len) {
                H2 = bb.readUint8();
            }
            if (bb.offset < len) {
                H3 = bb.readUint8();
            }
            if (bb.offset < len) {
                H4 = bb.readUint8();
            }

            var pos_high = H4 * 0x1000000 + H3 * 0x10000 + H2 * 0x100 + H1;
            var pos_low = L4 * 0x1000000 + L3 * 0x10000 + L2 * 0x100 + L1;

            var v = new Long(pos_low, pos_high);
            var v1 = new Long(v.low, v.high, true);
            v1 = v1.shiftRightUnsigned(23);
            v = v.xor(v1);
            v = v.multiply(k);
            var v2 = new Long(v.low, v.high, true);
            v2 = v2.shiftRightUnsigned(47);
            v = v.xor(v2);
            h = h.xor(v);
            h = h.multiply(m);
        }

        var h1 = new Long(h.low, h.high, true);
        h1 = h1.shiftRightUnsigned(23);
        h = h.xor(h1);
        h = h.multiply(k);
        var h2 = new Long(h.low, h.high, true);
        h2 = h2.shiftRightUnsigned(47);
        h = h.xor(h2);
        return h.toUnsigned().toString();
    }
};

var AF = window.AF = window.AF || {};
AF.util = AF.util || {};
cc.js.mixin(AF.util, fastHash);

module.exports = fastHash;

cc._RF.pop();