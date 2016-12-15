"use strict";
var TrumbowygSelectImagesPlugin = (function () {
    function TrumbowygSelectImagesPlugin() {
    }
    TrumbowygSelectImagesPlugin.init = function (editor, lang) {
        TrumbowygSelectImagesPlugin.editor = editor;
        TrumbowygSelectImagesPlugin.lang = lang;
        // console.log('TrumbowygSelectImagesPlugin init', editor);
        jQuery.extend(true, editor, {
            plugins: {
                selectImage: {
                    init: function (trumbowyg) {
                        trumbowyg.o.plugins.selectImage = jQuery.extend(true, {}, {}, trumbowyg.o.plugins.selectImage || {});
                        // console.log('selectImage trumbowyg', trumbowyg);
                        trumbowyg.addBtnDef('selectImage', {
                            fn: function (params) {
                                // console.log('selectImageCb', params, trumbowyg, editorImages);
                                TrumbowygSelectImagesPlugin.selectImageCb(params, trumbowyg, TrumbowygSelectImagesPlugin.editorImages);
                            }
                        });
                    },
                    tag: 'img'
                }
            }
        });
    };
    TrumbowygSelectImagesPlugin.selectImageCb = function (params, t, editorImages) {
        var pfx = t.o.prefix;
        var i = 0, l = editorImages.length;
        if (l == 0) {
            return;
        }
        var html = [];
        var file = null;
        html.push('<div class="modal-container">');
        html.push('<ul class="' + pfx + 'select-images gallery">');
        for (; i < l; i++) {
            html.push('<li class="item"><label data-i="' + i + '">' +
                '<img style="width: 50px" src="' + editorImages[i].url + '"/>' +
                '</label></li>');
        }
        html.push('</ul>');
        html.push('</div>');
        var selectedImageIndex = null;
        var $modal = t.openModal(TrumbowygSelectImagesPlugin.editor.langs[TrumbowygSelectImagesPlugin.lang].attachedImages, html.join(''))
            .on('tbwconfirm', function () {
            t.restoreRange();
            t.syncCode();
            if (selectedImageIndex != null) {
                var width = editorImages[selectedImageIndex].width || 1024;
                t.execCmd('insertImage', editorImages[selectedImageIndex].url);
                if (width > 1024) {
                    jQuery('img[src="' + editorImages[selectedImageIndex].url + '"]:not([alt])', t.$box).attr('width', '1024px');
                }
            }
            setTimeout(function () {
                t.closeModal();
            }, 250);
        })
            .on('tbwcancel', function () {
            t.restoreRange();
            t.closeModal();
        });
        jQuery('label', $modal).on('click', function () {
            jQuery('li', $modal).removeClass('active');
            jQuery(this).parent().addClass('active');
            selectedImageIndex = jQuery(this).data('i');
        });
    };
    ;
    TrumbowygSelectImagesPlugin.updateImages = function (files) {
        TrumbowygSelectImagesPlugin.editorImages = [];
        files.forEach(function (img) {
            img.extension = img.extension || img.url.split('.').pop();
            if (TrumbowygSelectImagesPlugin.imagesExtensions.indexOf(img.extension) != -1) {
                if (img.url.substring(0, 8) != '/uploads') {
                    img.url = '/uploads' + img.url;
                }
                if (!img.width) {
                    var imgObj = new Image();
                    imgObj.setAttribute('data-i', TrumbowygSelectImagesPlugin.editorImages.length + '');
                    imgObj.onload = function (e) {
                        if (e.type !== 'error' && this.width) {
                            var indx = parseInt(this.getAttribute('data-i'));
                            TrumbowygSelectImagesPlugin.editorImages[indx].width = this.width;
                        }
                    };
                    imgObj.src = img.url;
                    img.width = 1024;
                }
                TrumbowygSelectImagesPlugin.editorImages.push(img);
            }
        });
    };
    TrumbowygSelectImagesPlugin.editorImages = [];
    TrumbowygSelectImagesPlugin.imagesExtensions = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'svg'];
    return TrumbowygSelectImagesPlugin;
}());
exports.TrumbowygSelectImagesPlugin = TrumbowygSelectImagesPlugin;
