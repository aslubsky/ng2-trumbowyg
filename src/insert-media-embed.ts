declare var jQuery:any;

export class TrumbowygInsertMediaEmbedPlugin {
    public static editor:any;

    public static init(editor:any, lang:string) {
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

    }
}
