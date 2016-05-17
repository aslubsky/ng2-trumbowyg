import {Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnChanges}         from '@angular/core';

declare var jQuery:any;

export class TrumbowygSelectImagesPlugin {
    public static editorImages:any[] = [];

    public static editor:any;
    public static lang:string;
    public static imagesExtensions:string[] = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'svg'];

    public static init(editor:any, lang:string) {
        TrumbowygSelectImagesPlugin.editor = editor;
        TrumbowygSelectImagesPlugin.lang = lang;

        jQuery.extend(true, editor, {
            selectImage: {},
            opts: {
                btnsDef: {
                    selectImage: {
                        func: function (params, t) {
                            TrumbowygSelectImagesPlugin.selectImageCb(params, t, TrumbowygSelectImagesPlugin.editorImages);
                        },
                        ico: 'selectImage'
                    }
                }
            }
        });
    }

    private static selectImageCb(params, t, editorImages) {
        var pfx = t.o.prefix;
        var i = 0,
            l = editorImages.length;
        if (l == 0) {
            return;
        }

        var html = [];
        var file = null;
        html.push('<div class="modal-container">');
        html.push('<ul class="' + pfx + 'select-images gallery">');
        for (; i < l; i++) {
            html.push('<li class="item"><label data-i="' + i + '">' +
                '<img style="width: 50px" src="' + editorImages[i].url + '"/>' + //editorImages[i].name +
                '</label></li>'
            );
        }
        html.push('</ul>');
        html.push('</div>');

        var selectedImageIndex = null;
        var $modal = t.openModal(TrumbowygSelectImagesPlugin.editor.langs[TrumbowygSelectImagesPlugin.lang].attachedImages, html.join(''))
            .on(pfx + 'confirm', function () {
                jQuery(this).off(pfx + 'confirm');

                if (selectedImageIndex != null) {
                    t.restoreSelection();
                    t.syncCode();

                    var width = editorImages[selectedImageIndex].width || 1024;
                    var attr = '';
                    if (width > 1024) {
                        attr += 'width="1024px"';
                    }
                    TrumbowygSelectImagesPlugin.editor.insertHtml(t, '<img ' + attr + ' src="' + editorImages[selectedImageIndex].url + '"/>');
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
        jQuery('label', $modal).on('click', function () {
            jQuery('li', $modal).removeClass('active');
            jQuery(this).parent().addClass('active');
            selectedImageIndex = jQuery(this).data('i');
        });
    };

    public static updateImages(files:any[]) {
        TrumbowygSelectImagesPlugin.editorImages = [];
        files.forEach((img:any) => {
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
                    }
                    imgObj.src = img.url;
                    img.width = 1024;
                }
                TrumbowygSelectImagesPlugin.editorImages.push(img);
            }
        });
    }
}
