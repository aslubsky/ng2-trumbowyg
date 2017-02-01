"use strict";
var TrumbowygTidyPlugin = (function () {
    function TrumbowygTidyPlugin() {
    }
    TrumbowygTidyPlugin.init = function (editor, lang) {
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
                                TrumbowygTidyPlugin.sendToTidy(t, t.$ed.html());
                            }
                            t.$ta.removeAttr('tabindex');
                        }
                    }, 0);
                };
            }
        };
    };
    TrumbowygTidyPlugin.sendToTidy = function (t, html) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                // console.log(xhr.responseText);
                t.$ta.val(xhr.responseText);
            }
        };
        xhr.open('POST', TrumbowygTidyPlugin.editor.tidyUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('html=' + encodeURIComponent(html));
    };
    return TrumbowygTidyPlugin;
}());
exports.TrumbowygTidyPlugin = TrumbowygTidyPlugin;
