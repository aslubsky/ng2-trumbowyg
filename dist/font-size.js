System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygFontSizePlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygFontSizePlugin = (function () {
                function TrumbowygFontSizePlugin() {
                }
                TrumbowygFontSizePlugin.init = function (editor, lang) {
                    TrumbowygFontSizePlugin.editor = editor;
                    // Create btnsDef entry
                    jQuery.extend(true, editor, {
                        opts: {
                            btnsDef: {}
                        }
                    });
                    // Add all fonts in two dropdowns
                    jQuery.extend(true, editor, {
                        plugins: {
                            fontSize: {
                                init: function (trumbowyg) {
                                    // Set default fonts
                                    if (!jQuery.trumbowyg.opts.fontSizes) {
                                        jQuery.trumbowyg.opts.fontSizes = [];
                                    }
                                    var i = 1;
                                    for (; i <= 7; i++) {
                                        //jQuery.trumbowyg.opts.fontSize.push($filter('translate')("Размер") + ' ' + i);
                                        jQuery.trumbowyg.opts.fontSizes.push(editor.langs[lang]['fontSize' + i]);
                                    }
                                    trumbowyg.o.plugins.fontSize = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.fontSize || {});
                                    trumbowyg.addBtnDef('fontSize', {
                                        dropdown: TrumbowygFontSizePlugin.buildDropdown('fontSize', trumbowyg)
                                    });
                                }
                            }
                        }
                    });
                };
                TrumbowygFontSizePlugin.buildDropdown = function (func, trumbowyg) {
                    var dropdown = [];
                    jQuery.trumbowyg.opts.fontSizes.forEach(function (size, i) {
                        var sizeAlias = size.replace('px', '');
                        var btn = '_' + func + sizeAlias;
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
                return TrumbowygFontSizePlugin;
            }());
            exports_1("TrumbowygFontSizePlugin", TrumbowygFontSizePlugin);
        }
    }
});
//# sourceMappingURL=font-size.js.map