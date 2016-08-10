declare var jQuery:any;

export class TrumbowygInsertMediaEmbedPlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
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
    }
}
