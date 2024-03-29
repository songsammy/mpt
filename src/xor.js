'use strict';

(function(f) {
    var log = console.log;
    var def = f();
    var gbenv = {};

    try {
        if (global) {
            gbenv = global;
            module.exports = def;
        }
    } catch (e) {
        log('global err', e);
    }
    try {
        if (typeof window !== 'undefined') {
            gbenv = window;
        }
    } catch (e) {
        log('window err', e);
    }
    gbenv.xor = def;
})(function() {

    var def = {
        enc_xor: enc_xor, //加密方法 传入两个必填参数 1:原文字符串  2.密钥字符串  返回：密文
        encrypt: encrypt, //加密方法 传入两个必填参数 1:原文字符串  2.密钥字符串  返回：密文
        dec_xor: dec_xor, // 解密方法 传入两个必填参数 1.密文 2.密钥字符串   返回：原文
        decrypt: decrypt // 解密方法 传入两个必填参数 1.密文 2.密钥字符串   返回：原文
    };

    //任意utf8字符串  和任意utf8密钥 的异或加解密
    //返回ciphertext(密文)
    function enc_xor(plain_text, cipher_key) {
        if (!plain_text || !cipher_key) {
            return 'nil';
        }
        var c = str2hex(cipher_key);
        var p = str2hex(plain_text);
        var clen = c.length;
        var miss = p.length % clen;
        if (miss != 0) {
            miss = clen - miss;
            for (var missi = 0; missi < miss; missi++) {
                p = p + 'k';
            }
        }
        var parr = split_pretty(p, clen);
        var resarr = parr.map(function(item) {
            return xor_by_bit(item, c)
        });
        return resarr.join('');
    }

    // 如果密码错误 返回 'nil'
    function dec_xor(cipher_text, cipher_key) {
        if (!cipher_text || !cipher_key) {
            return 'nil';
        }
        var ck = str2hex(cipher_key);
        var ct = cipher_text;
        var clen = ck.length;
        var miss = ct.length % clen;
        if (miss != 0) {
            return 'nil'
        }
        var ct_arr = split_pretty(ct, clen);
        var resarr = ct_arr.map(function(item) {
            return xor_by_bit(item, ck)
        });
        var res = resarr.join('');
        res = hex2str(res);
        return res;
    }

    function str2hex(str) {
        var res = '';
        for (var i = 0; i < str.length; i++) {
            res = res + ('k' + str.charCodeAt(i).toString(16));
        }
        return res;
    }

    function hex2str(str) {
        var strarr = str.split("k")
        var res = '';
        for (var i = 0; i < strarr.length; i++) {
            if (strarr[i] && parseInt(strarr[i], 16)) {
                res = res + (String.fromCharCode(parseInt(strarr[i], 16)))
            }
        }
        return res;
    }

    function encrypt(plain_text, cipher_key) {
        if (!plain_text || !cipher_key) {
            return 'nil';
        }
        var c = str2hex(cipher_key);
        var p = str2hex(plain_text);
        var clen = c.length;
        var plen = p.length;
        var ci = 0;
        var res = '';
        for (var i = 0; i < plen; i++) {
            if (i < clen) {
                ci = i
            } else {
                ci = i % clen
            }
            var m = parseInt(p.charAt(i), 36);
            var k = parseInt(c.charAt(ci), 36);
            res = res + (m ^ k).toString(36);
        }
        return res;
    }

    function decrypt(cipher_text, cipher_key) {
        if (!cipher_text || !cipher_key) {
            return 'nil';
        }
        var ck = str2hex(cipher_key);
        var ct = cipher_text;
        var cklen = ck.length;
        var ctlen = ct.length;
        var ki = 0;
        var res = '';
        for (var i = 0; i < ctlen; i++) {
            if (i < cklen) {
                ki = i
            } else {
                ki = i % cklen
            }
            var m = parseInt(ct.charAt(i), 36);
            var k = parseInt(ck.charAt(ki), 36);
            res = res + (m ^ k).toString(36);
        }
        return hex2str(res);
    }

    function split_pretty(s, d) {
        var slen = s.length;
        if (slen < d) {
            return 'nil';
        }
        var res_arr = [];
        var arr_item = '';
        for (var i = 0; i < slen; i++) {
            arr_item = arr_item + s.charAt(i);
            if (arr_item.length == d) {
                res_arr.push(arr_item);
                arr_item = '';
            }
        }
        if (arr_item) {
            res_arr.push(arr_item)
        }
        return res_arr;
    }

    function xor_by_bit(a, b) {
        var bits = b.length;
        var res = '';
        for (var i = 0; i < bits; i++) {
            var m = parseInt(a.charAt(i), 36);
            var k = parseInt(b.charAt(i), 36);
            res = res + (m ^ k).toString(36);
        }
        return res;
    }
    return def;
});