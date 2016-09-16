System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TrumbowygInsertLeadPlugin;
    return {
        setters:[],
        execute: function() {
            TrumbowygInsertLeadPlugin = (function () {
                function TrumbowygInsertLeadPlugin() {
                }
                TrumbowygInsertLeadPlugin.init = function (editor, lang) {
                    TrumbowygInsertLeadPlugin.editor = editor;
                    jQuery.extend(true, jQuery.trumbowyg, {
                        plugins: {
                            lead: {
                                init: function (trumbowyg) {
                                    // console.log('lead addBtnDef');
                                    trumbowyg.addBtnDef('lead', {
                                        fn: function () {
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
                };
                return TrumbowygInsertLeadPlugin;
            }());
            exports_1("TrumbowygInsertLeadPlugin", TrumbowygInsertLeadPlugin);
        }
    }
});
//# sourceMappingURL=insert-lead.js.map