"use strict";
var TrumbowygFontsPlugin = (function () {
    function TrumbowygFontsPlugin() {
    }
    TrumbowygFontsPlugin.init = function (editor, lang) {
        TrumbowygFontsPlugin.editor = editor;
        // Set default fonts
        TrumbowygFontsPlugin.fonts = [
            "Arial",
            "Courier",
            "Courier New",
            "Georgia",
            "Helvetica",
            "Impact",
            "Monospace",
            "Sans-serif",
            "Serif",
            "Tahoma",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana"
        ];
        // Add all fonts in two dropdowns
        editor.plugins.fontName = {
            init: function (trumbowyg) {
                // console.log('fontName trumbowyg', trumbowyg);
                trumbowyg.o.plugins.fontName = trumbowyg.o.plugins.fontName || {};
                trumbowyg.addBtnDef('fontName', {
                    dropdown: TrumbowygFontsPlugin.buildDropdown('fontName', trumbowyg)
                });
            }
        };
    };
    TrumbowygFontsPlugin.buildDropdown = function (func, trumbowyg) {
        var dropdown = [];
        TrumbowygFontsPlugin.fonts.forEach(function (font, i) {
            // console.info('TrumbowygFontsPlugin', font, i);
            var fontAlias = font.toLowerCase().replace(' ', '').replace('-', '');
            var btn = func + '_' + fontAlias;
            trumbowyg.addBtnDef(btn, {
                fn: function (param, t) {
                    // console.info(param, t);
                    document.execCommand('fontName', false, param);
                    t.syncCode();
                },
                text: font,
                param: font
            });
            dropdown.push(btn);
        });
        return dropdown;
    };
    return TrumbowygFontsPlugin;
}());
exports.TrumbowygFontsPlugin = TrumbowygFontsPlugin;
