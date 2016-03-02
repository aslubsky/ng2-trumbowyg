System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygInsertTablePlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygInsertTablePlugin = (function () {
                function TrumbowygInsertTablePlugin() {
                }
                TrumbowygInsertTablePlugin.init = function (editor, lang) {
                    TrumbowygInsertTablePlugin.editor = editor;
                    jQuery('.insertTable-trumbowyg-dropdown.trumbowyg-dropdown button')
                        .off('mouseenter mouseleave')
                        .hover(function (e) {
                        //console.log(e.target.classList);
                        //jQuery(e.target).attr('class').split('_')
                        var tmp = jQuery(e.target).attr('class').split('_');
                        var r = parseInt(tmp[1].replace('r', ''), 10);
                        var c = parseInt(tmp[2].replace('c', ''), 10);
                        //console.log('i', tmp, r, c);
                        TrumbowygInsertTablePlugin.fillCells(r, c);
                        //console.log(jQuery(e.target).attr('class').split('_'));
                    }, function (e) {
                        //console.log(e);
                        var tmp = jQuery(e.target).attr('class').split('_');
                        var r = parseInt(tmp[1].replace('r', ''), 10);
                        var c = parseInt(tmp[2].replace('c', ''), 10);
                        //console.log('o', tmp, r, c);
                        TrumbowygInsertTablePlugin.fillCells(r, c);
                    });
                    jQuery.extend(true, TrumbowygInsertTablePlugin.editor, {
                        insertTable: {},
                        opts: {
                            btnsDef: {
                                insertTable: {
                                    dropdown: TrumbowygInsertTablePlugin.buildDropdown('insertTable')
                                }
                            }
                        }
                    });
                };
                TrumbowygInsertTablePlugin.buildTable = function (r, c) {
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
                };
                TrumbowygInsertTablePlugin.fillCells = function (r, c) {
                    jQuery('.insertTable-trumbowyg-dropdown.trumbowyg-dropdown button').removeClass('active');
                    var i = 1;
                    var j = 1;
                    for (; i <= r; i++) {
                        for (j = 1; j <= c; j++) {
                            //console.log(jQuery('.trumbowyg-_r'+r+'_c'+c+'_insertTable-dropdown-button'));
                            jQuery('.trumbowyg-_r' + i + '_c' + j + '_insertTable-dropdown-button').addClass('active');
                        }
                    }
                };
                TrumbowygInsertTablePlugin.buildDropdown = function (func) {
                    var dropdown = [];
                    var i = 1;
                    var j = 1;
                    for (; i <= 10; i++) {
                        for (j = 1; j <= 10; j++) {
                            var btn = '_r' + i + '_c' + j + '_' + func;
                            TrumbowygInsertTablePlugin.editor.opts.btnsDef[btn] = {
                                func: function (params, t) {
                                    //console.info(params, t, buildTable(params.r, params.c).join(''));
                                    var html = TrumbowygInsertTablePlugin.buildTable(params.r, params.c).join('');
                                    t.restoreSelection();
                                    t.syncCode();
                                    TrumbowygInsertTablePlugin.editor.insertHtml(t, html);
                                },
                                text: ' ',
                                param: {
                                    r: i,
                                    c: j
                                }
                            };
                            dropdown.push(btn);
                        }
                    }
                    return dropdown;
                };
                return TrumbowygInsertTablePlugin;
            }());
            exports_1("TrumbowygInsertTablePlugin", TrumbowygInsertTablePlugin);
        }
    }
});
//# sourceMappingURL=insert-table.js.map