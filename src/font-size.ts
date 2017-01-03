declare var jQuery: any;

export class TrumbowygFontSizePlugin {
    public static editor: any;
    public static fontSizes: string[] = [];

    public static init(editor: any, lang: string) {
        TrumbowygFontSizePlugin.editor = editor;

        var i = 1;
        for (; i <= 7; i++) {
            //jQuery.trumbowyg.opts.fontSize.push($filter('translate')("Размер") + ' ' + i);
            TrumbowygFontSizePlugin.fontSizes.push(editor.langs[lang]['fontSize' + i]);
        }

        // Add all fonts in two dropdowns
        editor.plugins.fontSize = {
            init: (trumbowyg: any) => {
                // console.log('fontSize init');
                // trumbowyg.o.plugins.fontSize = trumbowyg.o.plugins.fontSize || {};
                trumbowyg.addBtnDef('fontSize', {
                    dropdown: TrumbowygFontSizePlugin.buildDropdown('fontSize', trumbowyg)
                });
            }
        }
    }

    private static buildDropdown(func: any, trumbowyg: any) {
        var dropdown: string[] = [];

        TrumbowygFontSizePlugin.fontSizes.forEach((size: string, i: number) => {
            var btn = func + '_' + i;
            trumbowyg.addBtnDef(btn, {
                fn: (param: any, t: any) => {
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
