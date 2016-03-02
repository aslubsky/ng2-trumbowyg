import {Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, OnChanges}         from 'angular2/core';

import {TrumbowygFontSizesPlugin} from './font-sizes';
import {TrumbowygFontsPlugin} from './fonts';
import {TrumbowygColorsPlugin} from './colors';
import {TrumbowygInsertMediaEmbedPlugin} from './insert-media-embed';
import {TrumbowygInsertTablePlugin} from './insert-table';
import {TrumbowygSelectImagesPlugin} from './select-images';
import {TrumbowygSelectResourcesPlugin} from './select-resources';
import {TrumbowygSelectTemplatesPlugin} from './select-templates';

declare var jQuery:any;

@Directive({
    selector: '[trumbowyg-editor]'
})
export class TrumbowygEditor implements OnInit,OnDestroy {
    public static modes:any = {};
    public static langs:any = null;
    public static inited:boolean = false;
    public static localImageRegexp:RegExp = /src\=\"data\:image\/(.*)\"/gi;

    @Input() mode:string;
    @Input() lang:string;

    @Input() ngModel:string;
    @Output() ngModelChange:any = new EventEmitter();

    public onInit:any = new EventEmitter();

    private element:any;
    private dirty:boolean = false;

    constructor(private el:ElementRef) {
    }

    private static init(lang:string) {
        TrumbowygEditor.inited = true;

        if (TrumbowygEditor.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor.langs;
        }

        jQuery.trumbowyg.insertHtml = function (t, html) {
            try {
                try {
                    // <= IE10
                    t.doc.selection.createRange().pasteHTML(html);
                } catch (err) {
                    // IE 11
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    var range = t.doc.getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(frag);
                }
            } catch (err) {
                // Not IE
                t.execCmd('insertHTML', html);
            }
            t.syncCode();
        }

        TrumbowygFontSizesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygFontsPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygColorsPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertMediaEmbedPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectImagesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectResourcesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectTemplatesPlugin.init(jQuery.trumbowyg, lang);

        //console.trace();
        //console.log('init', jQuery.trumbowyg);


        TrumbowygEditor.modes = {
            inline: [
                'removeformat',
                '|',
                jQuery.trumbowyg.btnsGrps.design, '|',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                'insertImage',
                'insertMediaEmbed',
                'selectImage'
            ],
            simple: [
                'removeformat',
                '|',
                jQuery.trumbowyg.btnsGrps.design, '|',
                'fontName',
                'fontSize',
                '|',
                jQuery.trumbowyg.btnsGrps.justify,
                '|',
                jQuery.trumbowyg.btnsGrps.lists,
                '|',
                'link',
                'insertImage',
                'insertMediaEmbed',
                'selectImage',
                'horizontalRule'
            ],
            extend: [
                'viewHTML',
                'removeformat',
                '|',
                jQuery.trumbowyg.btnsGrps.design,
                '|',
                'formatting',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                jQuery.trumbowyg.btnsGrps.justify,
                '|',
                jQuery.trumbowyg.btnsGrps.lists,
                '|',
                'link',
                'insertImage',
                'insertMediaEmbed',
                'selectImage',
                'selectTemplates',
                'insertTable',
                'horizontalRule'
            ],
            full: [
                'viewHTML',
                'removeformat',
                '|',
                jQuery.trumbowyg.btnsGrps.design,
                '|',
                'formatting',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                jQuery.trumbowyg.btnsGrps.justify,
                '|',
                jQuery.trumbowyg.btnsGrps.lists,
                '|',
                'link',
                'insertImage',
                'insertMediaEmbed',
                'selectImage',
                'selectResources',
                'selectTemplates',
                'insertTable',
                'horizontalRule'
            ]
        };
    }

    ngOnChanges() {
        //console.log('ngOnChanges ngModel', this.dirty);
        if (this.ngModel && this.element) {
            if (this.dirty) {
                //this.dirty = false;
            } else {
                this.element.trumbowyg('html', this.ngModel);
            }
        }
    }

    ngOnInit() {
        //console.log('TrumbowygEditor ngOnInit');
        //console.log('TrumbowygEditor langs', TrumbowygEditor.langs);
        this.lang = this.lang || 'en';

        if (!TrumbowygEditor.inited) {
            TrumbowygEditor.init(this.lang);
            this.onInit.emit();
        }

        this.mode = this.mode || 'simple';
        this.element = jQuery(this.el.nativeElement);

        var self = this;
        this.element.trumbowyg('destroy');
        this.element.trumbowyg({
                btns: TrumbowygEditor.modes[this.mode],
                lang: this.lang,
                mobile: true,
                semantic: false,
                autogrow: this.mode == 'inline',
                fullscreenable: this.mode != 'inline',
                tablet: true
            })
            .on('tbwchange', function () {
                var html:string = self.element.trumbowyg('html');
                //console.log('tbwchange', html);
                //console.log('self.ngModelChange', self.ngModelChange);
                self.dirty = true;
                self.ngModelChange.emit(html);
            })
            .on('tbwpaste', function () {
                var html:string = self.element.trumbowyg('html');
                //console.log('tbwpaste', html);
                //console.log('self.ngModelChange', self.ngModelChange);
                self.dirty = true;
                self.ngModelChange.emit(html);
            });

        if ((/webkit/i).test(navigator.userAgent)) {//remove div class after new line
            jQuery('.trumbowyg-editor', this.element.parent()).on('keyup', function (e) {
                if (e.keyCode == 13) {
                    if (window.getSelection) {
                        var selection = window.getSelection(),
                            range = selection.getRangeAt(0);

                        jQuery(range.endContainer).attr('class', '');
                    }
                }
            });
        }
    }

    ngOnDestroy() {
        this.element.trumbowyg('destroy');
    }
}
