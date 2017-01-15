define(function (require, exports) {
    return {
        required: function (isRequired) {
            var val = this.value;
            if (isRequired === 'false') {
                if (!val) {
                    return {
                        force: true
                    }
                } else {
                    return true;
                }
            } else {
                return val.length > 0;
            }
        },
        number: function () {
            return /^\d+$/g.test(this.value.replace(/^\s+/g, '').replace(/\s+$/g, ''));
        }
    };
});