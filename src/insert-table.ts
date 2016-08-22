declare var jQuery:any;

export class TrumbowygInsertTablePlugin {
    public static editor:any;

    public static elementsCache:any = {};

    public static init(editor:any, lang:string) {
        TrumbowygInsertTablePlugin.editor = editor;

        jQuery.extend(true, jQuery.trumbowyg, {
            plugins: {
                insertTable: {
                    init: function (trumbowyg) {
                        // console.log('trumbowyg', trumbowyg);
                        trumbowyg.o.plugins.insertTable = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.insertTable || {});
                        trumbowyg.addBtnDef('insertTable', {
                            dropdown: TrumbowygInsertTablePlugin.buildDropdown('insertTable', trumbowyg),
                            tag: 'table'
                        });

                        setTimeout(function () {
                            var i = 1;
                            var j = 1;
                            for (; i <= 10; i++) {
                                for (j = 1; j <= 10; j++) {
                                    TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j] = jQuery('.trumbowyg-_r' + i + '_c' + j + '_insertTable-dropdown-button', trumbowyg.$box);
                                }
                            }

                            jQuery('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button', trumbowyg.$box)
                                .off('mouseenter mouseleave')
                                .hover(function (e) {
                                    //console.log(e.target.classList);
                                    //$(e.target).attr('class').split('_')
                                    var tmp = jQuery(e.target).attr('class').split('_');
                                    var r = parseInt(tmp[1].replace('r', ''), 10);
                                    var c = parseInt(tmp[2].replace('c', ''), 10);
                                    // console.log('i', tmp, r, c);
                                    TrumbowygInsertTablePlugin.fillCells(r, c);

                                    //console.log($(e.target).attr('class').split('_'));
                                }, function (e) {
                                    // console.log(e);

                                    var tmp = jQuery(e.target).attr('class').split('_');
                                    var r = parseInt(tmp[1].replace('r', ''), 10);
                                    var c = parseInt(tmp[2].replace('c', ''), 10);
                                    // console.log('o', tmp, r, c);
                                    TrumbowygInsertTablePlugin.fillCells(r, c);
                                });
                        }, 1000);
                    },
                    //tagHandler: colorTagHandler
                }
            }
        });
    }

    private static buildTable(r, c) {
        var html = [];
        html.push('<table border="1" width="100%">');
        var i = 1;
        var j = 1;
        for (; i <= r; i++) {
            html.push('<tr>');
            for (j = 1; j <= c; j++) {
                html.push('<td>&nbsp;</td>');
            }
            html.push('</tr>');
        }
        html.push('</table>');
        return html;
    }

    private static fillCells(r, c) {
        jQuery('.insertTable-trumbowyg-dropdown.trumbowyg-dropdown button').removeClass('active');
        var i = 1;
        var j = 1;
        for (; i <= r; i++) {
            for (j = 1; j <= c; j++) {
                //console.log(jQuery('.trumbowyg-_r'+r+'_c'+c+'_insertTable-dropdown-button'));
                TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j].addClass('active');
            }
        }
    }

    private static buildDropdown(func, trumbowyg) {
        var dropdown = [];

        var i = 1;
        var j = 1;
        for (; i <= 10; i++) {
            for (j = 1; j <= 10; j++) {
                var btn = '_r' + i + '_c' + j + '_' + func;
                // trumbowyg.addBtnDef()
                // console.log('trumbowyg', trumbowyg);
                trumbowyg.addBtnDef(btn, {
                    forceCss: true,
                    fn: function (params, t) {
                        var html = TrumbowygInsertTablePlugin.buildTable(params.r, params.c).join('');
                        // console.info('HTML', params, t, buildTable(params.r, params.c).join(''), html);

                        t.restoreRange();
                        t.syncCode();

                        trumbowyg.execCmd('insertHTML', html);
                    },
                    text: ' ',
                    param: {
                        r: i,
                        c: j
                    }
                });
                dropdown.push(btn);
            }
        }

        return dropdown;
    }
}
