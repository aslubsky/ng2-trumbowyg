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
                    jQuery.extend(true, jQuery.trumbowyg, {
                        plugins: {
                            insertMediaEmbed: {
                                init: function (trumbowyg) {
                                    trumbowyg.o.plugins.insertMediaEmbed = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.insertMediaEmbed || {});
                                    trumbowyg.addBtnDef('insertMediaEmbed', {
                                        dropdown: {
                                            fn: function (params, t) {
                                                //console.log('insertMediaEmbed');
                                                var pfx = t.o.prefix;
                                                var html = [];
                                                html.push('<div class="modal-meadia-embed"><textarea></textarea></div>');
                                                var $modal = t.openModal('Embed Code', html.join(''))
                                                    .on('tbwconfirm', function () {
                                                    var code = jQuery('textarea', $modal).val();
                                                    jQuery(this).off(pfx + 'confirm');
                                                    if (code) {
                                                        jQuery.trumbowyg.insertHtml(t, code);
                                                    }
                                                    setTimeout(function () {
                                                        t.closeModal();
                                                    }, 250);
                                                })
                                                    .on('tbwcancel', function () {
                                                    t.closeModal();
                                                });
                                            }
                                        }
                                    });
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