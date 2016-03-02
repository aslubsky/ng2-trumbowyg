System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygFontSizesPlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygFontSizesPlugin = (function () {
                function TrumbowygFontSizesPlugin() {
                }
                TrumbowygFontSizesPlugin.init = function (editor, lang) {
                    TrumbowygFontSizesPlugin.editor = editor;
                    // Create btnsDef entry
                    jQuery.extend(true, editor, {
                        opts: {
                            btnsDef: {}
                        }
                    });
                    // Set default fonts
                    if (!editor.opts.fontSizes) {
                        editor.opts.fontSizes = [];
                    }
                    var i = 1;
                    for (; i <= 7; i++) {
                        //jQuery.trumbowyg.opts.fontSizes.push($filter('translate')("Размер") + ' ' + i);
                        jQuery.trumbowyg.opts.fontSizes.push(editor.langs[lang]['fontSize' + i]);
                    }
                    // Add all fonts in two dropdowns
                    jQuery.extend(true, editor, {
                        opts: {
                            btnsDef: {
                                fontSize: {
                                    dropdown: TrumbowygFontSizesPlugin.buildDropdown('fontSize')
                                }
                            }
                        }
                    });
                };
                TrumbowygFontSizesPlugin.buildDropdown = function (func) {
                    var dropdown = [];
                    jQuery.each(TrumbowygFontSizesPlugin.editor.opts.fontSizes, function (i, size) {
                        var sizeAlias = size.replace('px', '');
                        var btn = '_' + func + sizeAlias;
                        TrumbowygFontSizesPlugin.editor.opts.btnsDef[btn] = {
                            func: function (param, t) {
                                //console.info(param, t);
                                document.execCommand('fontSize', false, param);
                                t.syncCode();
                            },
                            text: size,
                            param: i + 1
                        };
                        dropdown.push(btn);
                    });
                    return dropdown;
                };
                return TrumbowygFontSizesPlugin;
            }());
            exports_1("TrumbowygFontSizesPlugin", TrumbowygFontSizesPlugin);
        }
    }
});
//# sourceMappingURL=font-sizes.js.map