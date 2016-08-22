declare var jQuery:any;

export class TrumbowygInsertMediaEmbedPlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
        TrumbowygInsertMediaEmbedPlugin.editor = editor;

        jQuery.extend(true, jQuery.trumbowyg, {
            plugins: {
                insertMediaEmbed: {
                    init: (trumbowyg) => {
                        trumbowyg.o.plugins.insertMediaEmbed = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.insertMediaEmbed || {});
                        trumbowyg.addBtnDef('insertMediaEmbed', {
                            fn: (params, t) => {
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
                                    .on('tbwconfirm', () => {
                                        t.restoreRange();
                                        t.syncCode();

                                        var code = jQuery('textarea', $modal).val();
                                        if (code) {
                                            t.execCmd('insertHTML', code);
                                        }

                                        setTimeout(() => {
                                            t.closeModal();
                                        }, 250);
                                    })
                                    .on('tbwcancel', () => {
                                        t.restoreRange();
                                        t.closeModal();
                                    });
                            }
                        });
                    }
                }
            }
        });
    }
}
