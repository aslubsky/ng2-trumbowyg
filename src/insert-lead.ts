declare var jQuery: any;

export class TrumbowygInsertLeadPlugin {
    public static editor: any;

    public static init(editor: any, lang: string) {
        TrumbowygInsertLeadPlugin.editor = editor;

        jQuery.extend(true, jQuery.trumbowyg, {
            plugins: {
                lead: {
                    init: (trumbowyg:any) => {
                        // console.log('lead addBtnDef');

                        trumbowyg.addBtnDef('lead', {
                            fn: () => {
                                var documentSelection = trumbowyg.doc.getSelection();

                                if (documentSelection.rangeCount) {
                                    var range = documentSelection.getRangeAt(0).cloneRange();
                                    range.surroundContents(jQuery('<p class="lead"/>').get(0));
                                    documentSelection.removeAllRanges();
                                    documentSelection.addRange(range);
                                }

                                trumbowyg.syncCode();

                                trumbowyg.updateButtonPaneStatus();
                                trumbowyg.$c.trigger('tbwchange');
                            }
                        });

                        trumbowyg.btnsDef.formatting.dropdown = ['p', 'blockquote', 'lead', 'h1', 'h2', 'h3', 'h4'];
                    }
                }
            }
        });
    }
}
