"use strict";
require('rxjs/add/operator/toPromise');
var TrumbowygTidyPlugin = (function () {
    function TrumbowygTidyPlugin() {
    }
    TrumbowygTidyPlugin.init = function (editor, lang, http) {
        TrumbowygTidyPlugin.editor = editor;
        editor.plugins.tidy = {
            init: function (t) {
                // console.log('TrumbowygCodemirrorPlugin');
                t.toggle = function () {
                    var prefix = t.o.prefix;
                    t.semanticCode(false, true);
                    setTimeout(function () {
                        t.doc.activeElement.blur();
                        t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                        t.$btnPane.toggleClass(prefix + 'disable');
                        t.$btnPane.find('.' + prefix + 'viewHTML-button').toggleClass(prefix + 'active');
                        if (t.$box.hasClass(prefix + 'editor-visible')) {
                            t.$ta.attr('tabindex', -1);
                        }
                        else {
                            if (TrumbowygTidyPlugin.editor.tidyUrl) {
                                // console.log(t.$ed.html());
                                http.post(TrumbowygTidyPlugin.editor.tidyUrl, t.$ed.html()).toPromise()
                                    .then(function (res) {
                                    // console.log('tidy res', res.text());
                                    t.$ta.val(res.text());
                                });
                            }
                            t.$ta.removeAttr('tabindex');
                        }
                    }, 0);
                };
            }
        };
    };
    return TrumbowygTidyPlugin;
}());
exports.TrumbowygTidyPlugin = TrumbowygTidyPlugin;
