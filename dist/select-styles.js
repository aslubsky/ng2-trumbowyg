"use strict";
var TrumbowygSelectStylesPlugin = (function () {
    function TrumbowygSelectStylesPlugin() {
    }
    TrumbowygSelectStylesPlugin.init = function (editor, lang) {
        jQuery.extend(true, editor, {
            plugins: {
                selectStyles: {
                    init: function (trumbowyg) {
                        trumbowyg.o.plugins.selectStyles = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.selectStyles || {});
                        // console.log('selectStyles trumbowyg', trumbowyg);
                        trumbowyg.addBtnDef('selectStyles', {
                            fn: function (params) {
                                // console.log('selectImageCb', params, trumbowyg, editorImages);
                                // TrumbowygSelectStylesPlugin.selectImageCb(params, trumbowyg, TrumbowygSelectImagesPlugin.editorImages);
                            }
                        });
                    },
                    tag: 'img'
                }
            }
        });
    };
    TrumbowygSelectStylesPlugin.editorImages = [];
    return TrumbowygSelectStylesPlugin;
}());
exports.TrumbowygSelectStylesPlugin = TrumbowygSelectStylesPlugin;
