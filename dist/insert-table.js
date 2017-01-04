"use strict";
var TrumbowygInsertTablePlugin = (function () {
    function TrumbowygInsertTablePlugin() {
    }
    TrumbowygInsertTablePlugin.init = function (editor, lang) {
        TrumbowygInsertTablePlugin.editor = editor;
        editor.plugins.insertTable = {
            init: function (trumbowyg) {
                // console.log('trumbowyg', trumbowyg);
                trumbowyg.o.plugins.insertTable = trumbowyg.o.plugins.insertTable || {};
                trumbowyg.addBtnDef('insertTable', {
                    dropdown: TrumbowygInsertTablePlugin.buildDropdown('insertTable', trumbowyg),
                    tag: 'table'
                });
                setTimeout(function () {
                    var i = 1;
                    var j = 1;
                    for (; i <= 10; i++) {
                        for (j = 1; j <= 10; j++) {
                            TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j] = trumbowyg.$box.find('.trumbowyg-insertTable_r' + i + '_c' + j + '_insertTable-dropdown-button');
                        }
                    }
                    trumbowyg.$box.find('.trumbowyg-insertTable-button')
                        .off('click')
                        .on('click', function () {
                        jQuery('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button').removeClass('active');
                    });
                    trumbowyg.$box.find('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button')
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
        };
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
        jQuery('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button').removeClass('active');
        var i = 1;
        var j = 1;
        for (; i <= r; i++) {
            for (j = 1; j <= c; j++) {
                // console.log(TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j]);
                TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j].addClass('active');
            }
        }
    };
    TrumbowygInsertTablePlugin.buildDropdown = function (func, trumbowyg) {
        var dropdown = [];
        var i = 1;
        var j = 1;
        for (; i <= 10; i++) {
            for (j = 1; j <= 10; j++) {
                var btn = 'insertTable_r' + i + '_c' + j + '_' + func;
                // trumbowyg.addBtnDef()
                // console.log('trumbowyg', trumbowyg);
                trumbowyg.addBtnDef(btn, {
                    forceCss: true,
                    fn: function (params) {
                        var html = TrumbowygInsertTablePlugin.buildTable(params.r, params.c).join('');
                        // console.info('HTML', params, t, buildTable(params.r, params.c).join(''), html);
                        trumbowyg.restoreRange();
                        trumbowyg.syncCode();
                        TrumbowygInsertTablePlugin.editor.insertHtml(trumbowyg, html);
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
    };
    TrumbowygInsertTablePlugin.elementsCache = {};
    return TrumbowygInsertTablePlugin;
}());
exports.TrumbowygInsertTablePlugin = TrumbowygInsertTablePlugin;
