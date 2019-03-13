import {Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnChanges}         from '@angular/core';

declare var jQuery: any;

export class TrumbowygSelectImagesPlugin {
    public static editorImages: any[] = [];

    public static editor: any;
    public static lang: string;
    public static imagesExtensions: string[] = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'svg'];

    public static init(editor: any, lang: string) {
        TrumbowygSelectImagesPlugin.editor = editor;
        TrumbowygSelectImagesPlugin.lang = lang;

        // console.log('TrumbowygSelectImagesPlugin init', editor);

        editor.plugins.selectImage = {
            init: function (trumbowyg: any) {
                trumbowyg.o.plugins.selectImage = trumbowyg.o.plugins.selectImage || {};
                // console.log('selectImage trumbowyg', trumbowyg);
                trumbowyg.addBtnDef('selectImage', {
                    fn: function (params: any) {
                        // console.log('selectImageCb', params, trumbowyg, editorImages);
                        TrumbowygSelectImagesPlugin.selectImageCb(params, trumbowyg, TrumbowygSelectImagesPlugin.editorImages);
                    }
                });
            },
            tag: 'img'
        }
    }

    private static selectImageCb(params: any, t: any, editorImages: any[]) {
        var pfx: string = t.o.prefix;
        var i: number = 0,
            l: number = editorImages.length;
        if (l == 0) {
            return;
        }

        var html: string[] = [];
        var file: any = null;
        html.push('<div class="modal-container">');
        html.push('<ul class="' + pfx + 'select-images gallery">');
        for (; i < l; i++) {
            html.push('<li class="item" data-i="' + i + '"><label>' +
                '<img width="50px" src="' + editorImages[i].url + '"/>' + //editorImages[i].name +
                '</label></li>'
            );
        }
        html.push('</ul>');
        html.push('</div>');

        var selectedImageIndex: number = null;
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

        jQuery('li.item', $modal).on('click', function () {
            jQuery('li', $modal).removeClass('active');
            jQuery(this).addClass('active');
            selectedImageIndex = jQuery(this).data('i');
        });
    };

    public static updateImages(files: any[]) {
        TrumbowygSelectImagesPlugin.editorImages = [];
        files.forEach((img: any) => {
            img.extension = img.extension || img.url.split('.').pop();
            if (TrumbowygSelectImagesPlugin.imagesExtensions.indexOf(img.extension) != -1) {
                // if (img.url.substring(0, 8) != '/uploads') {
                    // img.url = '/uploads' + img.url;
                // }
                if (!img.width) {
                    var imgObj = new Image();
                    imgObj.setAttribute('data-i', TrumbowygSelectImagesPlugin.editorImages.length + '');
                    imgObj.onload = function (e) {
                        if (e.type !== 'error' && (<any>this).width) {
                            var indx = parseInt(this.getAttribute('data-i'));
                            TrumbowygSelectImagesPlugin.editorImages[indx].width = (<any>this).width;
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
