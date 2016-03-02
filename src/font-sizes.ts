declare var jQuery:any;

export class TrumbowygFontSizesPlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
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
    }

    private static buildDropdown(func) {
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
    }
}
