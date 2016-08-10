declare var jQuery:any;

export class TrumbowygFontSizePlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
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
                    init: (trumbowyg) => {
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
    }

    private static buildDropdown(func, trumbowyg) {
        var dropdown = [];

        jQuery.trumbowyg.opts.fontSizes.forEach((size, i) => {
            var sizeAlias = size.replace('px', '');
            var btn = '_' + func + sizeAlias;
            trumbowyg.addBtnDef(btn, {
                fn: (param, t) => {
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
    }
}
