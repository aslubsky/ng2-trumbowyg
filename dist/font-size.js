"use strict";
var TrumbowygFontSizePlugin = (function () {
    function TrumbowygFontSizePlugin() {
    }
    TrumbowygFontSizePlugin.init = function (editor, lang) {
        TrumbowygFontSizePlugin.editor = editor;
        var i = 1;
        for (; i <= 7; i++) {
            //jQuery.trumbowyg.opts.fontSize.push($filter('translate')("Размер") + ' ' + i);
            TrumbowygFontSizePlugin.fontSizes.push(editor.langs[lang]['fontSize' + i]);
        }
        // Add all fonts in two dropdowns
        editor.plugins.fontSize = {
            init: function (trumbowyg) {
                console.log('fontSize init');
                // trumbowyg.o.plugins.fontSize = trumbowyg.o.plugins.fontSize || {};
                trumbowyg.addBtnDef('fontSize', {
                    dropdown: TrumbowygFontSizePlugin.buildDropdown('fontSize', trumbowyg)
                });
            }
        };
    };
    TrumbowygFontSizePlugin.buildDropdown = function (func, trumbowyg) {
        var dropdown = [];
        TrumbowygFontSizePlugin.fontSizes.forEach(function (size, i) {
            var btn = func + '_' + i;
            trumbowyg.addBtnDef(btn, {
                fn: function (param, t) {
                    //console.info(param, t);
                    document.execCommand('fontSize', false, param);
                    t.syncCode();
                },
                text: size,
                param: i + 1
            });
            dropdown.push(btn);
        });
        return dropdown;
    };
    TrumbowygFontSizePlugin.fontSizes = [];
    return TrumbowygFontSizePlugin;
}());
exports.TrumbowygFontSizePlugin = TrumbowygFontSizePlugin;
