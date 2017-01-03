"use strict";
var TrumbowygInsertMediaEmbedPlugin = (function () {
    function TrumbowygInsertMediaEmbedPlugin() {
    }
    TrumbowygInsertMediaEmbedPlugin.init = function (editor, lang) {
        TrumbowygInsertMediaEmbedPlugin.editor = editor;
        editor.plugins.insertMediaEmbed = {
            init: function (trumbowyg) {
                trumbowyg.o.plugins.insertMediaEmbed = trumbowyg.o.plugins.insertMediaEmbed || {};
                trumbowyg.addBtnDef('insertMediaEmbed', {
                    fn: function (params, t) {
                        //console.log('insertMediaEmbed');
                        var t = trumbowyg;
                        var html = [];
                        html.push('<div class="modal-container">');
                        html.push('<div class="modal-meadia-embed">');
                        html.push('<textarea></textarea>');
                        html.push('</div>');
                        html.push('</div>');
                        console.log('insertMediaEmbed');
                        var $modal = t.openModal('Embed Code', html.join(''))
                            .on('tbwconfirm', function () {
                            t.restoreRange();
                            t.syncCode();
                            var code = jQuery('textarea', $modal).val();
                            if (code) {
                                TrumbowygInsertMediaEmbedPlugin.editor.insertHtml(t, code);
                            }
                            setTimeout(function () {
                                t.closeModal();
                            }, 250);
                        })
                            .on('tbwcancel', function () {
                            t.restoreRange();
                            t.closeModal();
                        });
                    }
                });
            }
        };
    };
    return TrumbowygInsertMediaEmbedPlugin;
}());
exports.TrumbowygInsertMediaEmbedPlugin = TrumbowygInsertMediaEmbedPlugin;
