declare var jQuery:any;

export class TrumbowygFontsPlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
        TrumbowygFontsPlugin.editor = editor;

        // Create btnsDef entry
        jQuery.extend(true, TrumbowygFontsPlugin.editor, {
            opts: {
                btnsDef: {}
            }
        });

        // Set default fonts
        if (!TrumbowygFontsPlugin.editor.opts.fonts) {
            TrumbowygFontsPlugin.editor.opts.fonts = [
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
        }

        // Add all fonts in two dropdowns
        jQuery.extend(true, TrumbowygFontsPlugin.editor, {
            plugins: {
                fontName: {
                    init: function (trumbowyg) {
                        // console.log('fontName trumbowyg', trumbowyg);
                        trumbowyg.o.plugins.fontName = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.fontName || {});
                        trumbowyg.addBtnDef('fontName', {
                            dropdown: TrumbowygFontsPlugin.buildDropdown('fontName', trumbowyg)
                        });
                    }
                }
            }
        });

    }

    private static buildDropdown(func, trumbowyg) {
        var dropdown = [];

        jQuery.each(jQuery.trumbowyg.opts.fonts, function (i, font) {
            var fontAlias = font.toLowerCase().replace(' ', '').replace('-', '');
            var btn = '_' + func + fontAlias;
            trumbowyg.addBtnDef(btn, {
                fn: function (param, t) {
                    console.info(param, t);
                    document.execCommand('fontName', false, param);
                    t.syncCode();
                },
                text: font,
                param: font
            });
            dropdown.push(btn);
        });


        return dropdown;
    }
}
