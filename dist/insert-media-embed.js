System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygInsertMediaEmbedPlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygInsertMediaEmbedPlugin = (function () {
                function TrumbowygInsertMediaEmbedPlugin() {
                }
                TrumbowygInsertMediaEmbedPlugin.init = function (editor, lang) {
                    TrumbowygInsertMediaEmbedPlugin.editor = editor;
                    jQuery.extend(true, editor, {
                        insertMediaEmbed: {},
                        opts: {
                            btnsDef: {
                                insertMediaEmbed: {
                                    func: function (params, t) {
                                        //console.log('insertMediaEmbed');
                                        var pfx = t.o.prefix;
                                        var html = [];
                                        html.push('<div class="modal-meadia-embed"><textarea></textarea></div>');
                                        var $modal = t.openModal('Embed Code', html.join(''))
                                            .on(pfx + 'confirm', function () {
                                            var code = jQuery('textarea', $modal).val();
                                            t.restoreSelection();
                                            t.syncCode();
                                            jQuery(this).off(pfx + 'confirm');
                                            if (code) {
                                                jQuery.trumbowyg.insertHtml(t, code);
                                            }
                                            setTimeout(function () {
                                                t.closeModal();
                                            }, 250);
                                        })
                                            .one(pfx + 'cancel', function () {
                                            jQuery(this).off(pfx + 'confirm');
                                            t.closeModal();
                                            t.restoreSelection();
                                        });
                                    },
                                    ico: 'insertMediaEmbed'
                                }
                            }
                        }
                    });
                };
                return TrumbowygInsertMediaEmbedPlugin;
            }());
            exports_1("TrumbowygInsertMediaEmbedPlugin", TrumbowygInsertMediaEmbedPlugin);
        }
    }
});
//# sourceMappingURL=insert-media-embed.js.map