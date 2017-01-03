declare var jQuery: any;

export class TrumbowygFontsPlugin {
    public static editor: any;
    public static fonts: string[];

    public static init(editor: any, lang: string) {
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
            init: function (trumbowyg: any) {
                // console.log('fontName trumbowyg', trumbowyg);
                trumbowyg.o.plugins.fontName = trumbowyg.o.plugins.fontName || {};
                trumbowyg.addBtnDef('fontName', {
                    dropdown: TrumbowygFontsPlugin.buildDropdown('fontName', trumbowyg)
                });
            }
        }

    }

    private static buildDropdown(func: any, trumbowyg: any) {
        var dropdown: string[] = [];

        TrumbowygFontsPlugin.fonts.forEach((font: string, i: number) => {
            // console.info('TrumbowygFontsPlugin', font, i);
            var fontAlias = font.toLowerCase().replace(' ', '').replace('-', '');
            var btn = func + '_' + fontAlias;
            trumbowyg.addBtnDef(btn, {
                fn: function (param: any, t: any) {
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
    }
}
