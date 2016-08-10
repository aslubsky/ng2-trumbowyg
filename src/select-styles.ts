import {Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnChanges}         from '@angular/core';

declare var jQuery:any;

export class TrumbowygSelectStylesPlugin {
    public static editorImages:any[] = [];

    public static editor:any;

    public static init(editor:any, lang:string) {

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
    }
}
