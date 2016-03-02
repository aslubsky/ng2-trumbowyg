System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygColorsPlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygColorsPlugin = (function () {
                function TrumbowygColorsPlugin() {
                }
                TrumbowygColorsPlugin.init = function (editor, lang) {
                    TrumbowygColorsPlugin.editor = editor;
                    // Create btnsDef entry
                    jQuery.extend(true, TrumbowygColorsPlugin.editor, {
                        opts: {
                            btnsDef: {}
                        }
                    });
                    // Set default colors
                    if (!TrumbowygColorsPlugin.editor.opts.colors)
                        TrumbowygColorsPlugin.editor.opts.colors = ['ffffff', '000000', 'eeece1', '1f497d', '4f81bd', 'c0504d', '9bbb59', '8064a2', '4bacc6', 'f79646', 'ffff00', 'f2f2f2', '7f7f7f', 'ddd9c3', 'c6d9f0', 'dbe5f1', 'f2dcdb', 'ebf1dd', 'e5e0ec', 'dbeef3', 'fdeada', 'fff2ca', 'd8d8d8', '595959', 'c4bd97', '8db3e2', 'b8cce4', 'e5b9b7', 'd7e3bc', 'ccc1d9', 'b7dde8', 'fbd5b5', 'ffe694', 'bfbfbf', '3f3f3f', '938953', '548dd4', '95b3d7', 'd99694', 'c3d69b', 'b2a2c7', 'b7dde8', 'fac08f', 'f2c314', 'a5a5a5', '262626', '494429', '17365d', '366092', '953734', '76923c', '5f497a', '92cddc', 'e36c09', 'c09100', '7f7f7f', '0c0c0c', '1d1b10', '0f243e', '244061', '632423', '4f6128', '3f3151', '31859b', '974806', '7f6000'];
                    // Add all colors in two dropdowns
                    jQuery.extend(true, TrumbowygColorsPlugin.editor, {
                        opts: {
                            btnsDef: {
                                foreColor: {
                                    dropdown: TrumbowygColorsPlugin.buildDropdown('foreColor')
                                },
                                backColor: {
                                    dropdown: TrumbowygColorsPlugin.buildDropdown('backColor')
                                }
                            }
                        }
                    });
                };
                TrumbowygColorsPlugin.buildDropdown = function (func) {
                    var dropdown = [];
                    jQuery.each(TrumbowygColorsPlugin.editor.opts.colors, function (i, color) {
                        var btn = '_' + func + color;
                        TrumbowygColorsPlugin.editor.opts.btnsDef[btn] = {
                            func: func,
                            param: '#' + color,
                            style: 'background-color: #' + color + ';'
                        };
                        dropdown.push(btn);
                    });
                    var btn = '_' + func + 'transparent';
                    TrumbowygColorsPlugin.editor.opts.btnsDef[btn] = {
                        func: func,
                        param: 'transparent',
                        style: 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkQAAfEJMRmwBYhoGBYQtMBYoAADziAp0jtJTgAAAAAElFTkSuQmCC);'
                    };
                    dropdown.push(btn);
                    return dropdown;
                };
                return TrumbowygColorsPlugin;
            }());
            exports_1("TrumbowygColorsPlugin", TrumbowygColorsPlugin);
        }
    }
});
//# sourceMappingURL=colors.js.map