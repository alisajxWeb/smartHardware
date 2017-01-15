/**
 * @file 项目中用到的一些通用的方法集
 * @author zhangshaolong
 */

define(function (require, exports) {

    var XPI = 3.14159265358979324 * 3000.0 / 180.0;

    /**
     * 对数据进行深度拷贝
     * @param {*} source 数据源
     * @return {*} 数据源的拷贝
     */
    exports.deepCopy = function (source) {
        var deepSource;
        var constructor = source.constructor;
        (function recursive(source, result, idx) {
            var constructor = source && source.constructor,
                obj,
                key,
                i,
                len,
                isTop = result === undefined;
            if (constructor === Object) {
                obj = (isTop ? deepSource = {} : result[idx] = {});
                for (key in source) {
                    recursive(source[key], obj, key);
                }
            } else if (constructor === Array) {
                i = 0, len = source.length;
                obj = (isTop ? deepSource = [] : result[idx] = []);
                while (i < len) {
                    recursive(source[i], obj, i++);
                }
            } else if (constructor === Function) {
                try {
                    result[idx] = new Function('return ' + source.toString())();
                } catch (e) {
                    result[idx] = source;
                }
            } else if (typeof source === 'object') {
                result[idx] = new constructor(source);
            } else {
                result[idx] = source;
            }
        })(source);
        return deepSource;
    };

    /**
     * 更新浏览器URL中的参数
     * @param {string|Object} key 指定需要获取的key的值或者key value组成的map结构
     * @param {string} value 指定需设置key对应的值
     */
    exports.refreshQuery = function (key, value, isHash) {
        var search = location.search;
        if (!key) {
            return '';
        }
        if (typeof key === 'string') {
            var keyMap = {};
            keyMap[key] = value;
            key = keyMap;
        }
        if (search && !isHash) {
            for (var ki in key) {
                var has = false;
                search = search.replace(new RegExp('([?&]' + ki + '=)([^&$]*)'), function (all, k, v) {
                    has = true;
                    return k + key[ki];
                });
                if (!has) {
                    search += '&' + ki + '=' + key[ki];
                }
            }
        } else {
            var args = [];
            for (var ki in key) {
                args.push(ki + '=' + key[ki]);
            }
            args.sort();
            return '?' + args.join('&');
        }
        return search;
    };

    /**
     * 获取浏览器URL中的参数
     * @param {string} key 指定需要获取的key的值，默认全部
     * @return {string|Object} 如果指定了key，则返回对应的值，否则返回由key->value的map
     */
    exports.getQuery = function (key, isHash) {
        var search = location.search;
        var querys = {};
        if (!arguments.length) {
            if (!search) {
                return querys;
            }
            search.replace(/(?:\?|&)([^=]+)=([^&$]*)/g, function (all, key, val) {
                querys[key] = val;
            });
            return querys;
        } else {
            if (typeof key === 'string') {
                if (isHash) {
                    search = location.hash;
                }
            } else if (key) {
                location.hash.replace(/(?:\?|&)([^=]+)=([^&$]*)/g, function (all, key, val) {
                    querys[key] = val;
                });
                return querys;
            }
            var rst = new RegExp('[?&]' + key + '=([^&$]*)').exec(search);
            return rst && rst[1];
            
        }
    };


    /**
     * 对值的格式化处理，比如123456 -> 123,456
     * @param {string} val 需要格式化的值
     * @param {string} ch 用ch设置的字符填充到对应的位置，默认为‘,’
     * @param {integer} len 每隔len间隔做填充处理，默认为3
     * @return {string} 格式化的字符串
     */
    exports.format = function (val, ch, len) {
        ch = ch || ',';
        len = len || 3;
        return ('' + val).replace(new RegExp('(\\d{1,' + len + '})(?=(\\d{' + len + '})+(?:$|\\.))', 'g'), '$1' + ch);
    };

    exports.parseToDate = function (str) {
        return exports.toDate(exports.parseToTimestamp(str));
    };
    exports.parseToTimestamp = function (str) {
        return Date.parse(str.replace(/\-/g, '/'));
    };
    exports.addDay = function (date, num) {
        var d = exports.toDate(exports.toTimestamp(date));
        d.setDate(d.getDate() + num);
        return d;
    };
    exports.toYMD = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = date.getDate();
        if(month < 10){
            month = '0' + month;
        }
        if(d < 10){
            d = '0' + d;
        }
        return year + '-' + month + '-' + d;
    };
    exports.toYMDHMS = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return year + '-' + month + '-' + d + ' ' + h + ':' + m + ':' + s;
    };
    exports.toTimestamp = function (date) {
        return date.getTime();
    };
    exports.toDate = function (timestamp) {
        return new Date(timestamp);
    }
    exports.compareTo = function (date, date1) {
        return exports.toTimestamp(date) - exports.toTimestamp(date1);
    };
    exports.offsetOfWeek = function (date) {
        return (date.getDay() || 7) - 1;
    };
    exports.firstOfWeek = function (date) {
        return exports.addDay(date, -exports.offsetOfWeek(date));
    };

    exports.getFormData = function (container, rule) {
        var data = {};
        rule = rule || '[name]'
        container.find(rule).each(function () {
            data[this.name] = this.value;
        });
        return data;
    };

    exports.flatMap = function (map) {
        var result = {};
        for (var key in map) {
            if (typeof map[key] === 'object') {
                for (var subkey in map[key]) {
                    map[key][subkey] != null && (result[subkey] = map[key][subkey])   
                } 
            } else {
                map[key] && (result[key] = map[key])
            }
        }
        return result;
    };

    /**
     * @param data  json格式的数据，必填
     * @param codeStyle 是否高亮显示
     * @param space 默认使用的缩进空白
     * @param indents 当前行需要的缩进（内部参数，调用者不要设置）
     */
     var formatJSON = exports.formatJSON = function (data, codeStyle, space, indents) {
        if (null == data) {
            return '' + data;
        }
        space = space != null ? space : '    ';
        indents = indents || '';
        var constructor = data.constructor;
        if (constructor === String) {
            return codeStyle ? '<span class="json-string-value">"' + data + '"</span>' : '"' + data + '"';
        } else if (constructor === Number || constructor == Boolean) {
            return codeStyle ? '<span class="json-number-value">' + data + '</span>' : data;
        } else if (constructor === Array) {
            var astr = codeStyle ? '<span class="json-array-tag">[</span>\n' : '[\n';
            for (var i = 0, len = data.length; i < len - 1; i++) {
                astr += indents + space + formatJSON(data[i], codeStyle, space, indents + space) + ',\n';
            }
            astr += indents + space + formatJSON(data[len - 1], codeStyle, space, indents + space) + '\n';
            return astr + indents + (codeStyle ? '<span class="json-array-tag">]</span>' : ']');
        } else if (constructor === Object) {
            var ostr = codeStyle ? '<span class="json-object-tag">{</span>\n' : '{\n';
            var isEmpty = true;
            for (var key in data) {
                isEmpty = false;
                ostr += indents + space + (codeStyle ? '<span class="json-object-key">' + '"' + key + '"' + '</span>' : '"' + key + '"') + ': ' + formatJSON(data[key], codeStyle, space, indents + space) + ',\n';
            }
            if (!isEmpty) {
                ostr = ostr.slice(0, -2);
            }
            return ostr + '\n' + indents + (codeStyle ? '<span class="json-object-tag">}</span>' : '}');
        }
    };

    // 中国正常坐标系GCJ02协议的坐标
    // 转到 百度地图对应的 BD09 协议坐标
    exports.Convert_GCJ02_To_BD09 = function (lat, lng) {
        var x = lng;
        var y = lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * XPI);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * XPI);
        return [z * Math.sin(theta) + 0.006, z * Math.cos(theta) + 0.0065];
    };

   
        
      
    // 百度地图对应的 BD09 协议坐标
    // 转到 中国正常坐标系GCJ02协议的坐标
    exports.Convert_BD09_To_GCJ02 = function (lat, lng) {
        var x = lng - 0.0065;
        var y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * XPI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * XPI);
        return [z * Math.sin(theta), z * Math.cos(theta)];
    };
});