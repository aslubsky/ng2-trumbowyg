import {
    Directive,
    Input,
    forwardRef,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges
}         from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {TrumbowygTidyPlugin} from './tidy';
import {TrumbowygFontSizePlugin} from './font-size';
import {TrumbowygFontsPlugin} from './fonts';
import {TrumbowygInsertLeadPlugin} from './insert-lead';
import {TrumbowygInsertMediaEmbedPlugin} from './insert-media-embed';
import {TrumbowygInsertTablePlugin} from './insert-table';
import {TrumbowygSelectImagesPlugin} from './select-images';
import {TrumbowygSelectResourcesPlugin} from './select-resources';
import {TrumbowygSelectTemplatesPlugin} from './select-templates';
import {TrumbowygSelectStylesPlugin} from './select-styles';

declare var jQuery: any;

@Directive({
    selector: '[trumbowyg-editor]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrumbowygEditor),
            multi: true
        }
    ]
})
export class TrumbowygEditor implements ControlValueAccessor,OnInit,OnChanges,OnDestroy {
    public static modes: any = {};
    public static langs: any = {};
    public static inited: boolean = false;
    public static localImageRegexp: RegExp = /src\=\"data\:image\/(.*)\"/gi;

    @Input() mode: string;
    @Input() lang: string;
    @Input() base64Image: any;

    private _value: string;

    @Output() base64ImageInserted: any = new EventEmitter();

    public onInit: any = new EventEmitter();

    private element: any;
    private dirty: boolean = false;

    constructor(private el: ElementRef) {
    }

    propagateChange = (_: any) => {
    };

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
        // console.log('registerOnTouched');
    }

    writeValue(value: any) {
        if (value != null) {
            this._value = value;

            if (this.dirty) {
                //this.dirty = false;
            } else {
                if (this._value.length == 0 && (/webkit/i).test(navigator.userAgent)) {
                    this.element.trumbowyg('html', '<p></p>');
                } else {
                    this.element.trumbowyg('html', this._value);
                }
            }
        }
    }

    private static init(lang: string) {
        TrumbowygEditor.inited = true;

        if (TrumbowygEditor.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor.langs;
        }

        jQuery.trumbowyg.svgPath = '/bower_components/trumbowyg/dist/ui/icons.svg';
        jQuery.trumbowyg.tidyUrl = '/api/rest.php/trumbowyg?action=tidy';

        jQuery.trumbowyg.insertHtml = function (t: any, html: string) {
            try {
                try {
                    // <= IE10
                    t.doc.selection.createRange().pasteHTML(html);
                } catch (err) {
                    // IE 11
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag: any = document.createDocumentFragment(),
                        node: any,
                        lastNode: any;
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
            t.$c.trigger('tbwchange');
        }

        var btnsGrps = {
            design: ['bold', 'italic', 'underline', 'strikethrough'],
            semantic: ['strong', 'em', 'del'],
            justify: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            lists: ['unorderedList', 'orderedList']
        };

        TrumbowygTidyPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygFontSizePlugin.init(jQuery.trumbowyg, lang);
        TrumbowygFontsPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertLeadPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertTablePlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertMediaEmbedPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectImagesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectResourcesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectTemplatesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectStylesPlugin.init(jQuery.trumbowyg, lang);

        //console.trace();
        //console.log('init', jQuery.trumbowyg);


        TrumbowygEditor.modes = {
            inline: [
                'removeformat',
                '|',
                btnsGrps.design, '|',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                'insertMediaEmbed',
                'selectImage'
            ],
            simple: [
                'removeformat',
                '|',
                btnsGrps.design, '|',
                'fontName',
                'fontSize',
                '|',
                btnsGrps.justify,
                '|',
                btnsGrps.lists,
                '|',
                'link',
                'insertMediaEmbed',
                'selectImage',
                'horizontalRule',
                'fullscreen'
            ],
            extend: [
                'viewHTML',
                'removeformat',
                '|',
                btnsGrps.design,
                '|',
                'formatting',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                btnsGrps.justify,
                '|',
                btnsGrps.lists,
                '|',
                'link',
                'insertMediaEmbed',
                'selectImage',
                'selectTemplates',
                'insertTable',
                'horizontalRule',
                'fullscreen'
            ],
            full: [
                'viewHTML',
                'removeformat',
                '|',
                btnsGrps.design,
                '|',
                'formatting',
                'fontName',
                'fontSize',
                'foreColor',
                'backColor',
                '|',
                btnsGrps.justify,
                '|',
                btnsGrps.lists,
                '|',
                'link',
                'insertMediaEmbed',
                'selectImage',
                'selectResources',
                'selectTemplates',
                'insertTable',
                'horizontalRule',
                'fullscreen'
            ]
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.base64Image) {
            //console.log('ngOnChanges base64Image', this.base64Image);
            var el = jQuery('<div>' + this.element.trumbowyg('html') + '</div>');
            el.find('#' + this.base64Image.uid).attr('src', this.base64Image.file);
            this.base64Image = null;
            this.element.trumbowyg('html', el.html());
        }
    }

    private detectBase64Insert(html: string) {
        //console.log('detectBase64Insert', html);
        if (TrumbowygEditor.localImageRegexp.test(html)) {
            var images: any[] = [];

            var el = jQuery('<div>' + html + '</div>');
            var uid: string;
            el.find('img[src^="data:image"]').each(function () {
                if (!jQuery(this).attr('id')) {
                    uid = Math.random().toString(36).substring(2, 9);
                    jQuery(this).attr('id', uid);
                    images.push({
                        uid: uid,
                        src: this.src
                    });
                }
            });
            this.element.trumbowyg('html', el.html());
            //console.log('images', images);
            images.forEach(image => {
                this.base64ImageInserted.emit(image);
            });
            return true;
        }
        return false;
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

        this.element.trumbowyg('destroy');
        this.element.trumbowyg({
            btns: TrumbowygEditor.modes[this.mode],
            lang: this.lang,
            mobile: true,
            semantic: false,
            autogrow: this.mode == 'inline',
            tablet: true
        })
            .on('tbwpaste', () => {
                var html: string = this.element.trumbowyg('html');
                //console.log('tbwpaste', html);
                if (!this.detectBase64Insert(html)) {
                    this.dirty = true;
                    this.propagateChange(html);
                }
                //console.log('tbwpaste', html);
                //console.log('self.ngModelChange', self.ngModelChange);
            })
            .on('tbwchange', () => {
                var html: string = this.element.trumbowyg('html');
                //console.log('tbwchange', html);
                if (!this.detectBase64Insert(html)) {
                    this.dirty = true;
                    this.propagateChange(html);
                }
                //console.log('tbwchange', html);
                //console.log('self.ngModelChange', self.ngModelChange);
            })
            .on('tbwinit', (e: any) => {
                let t: any = this.element.data('trumbowyg');
                t.$box.addClass('trumbowyg-' + this.mode);
                t.$ed.addClass('page-container');
                // console.log('tbwinit', e, t, t.$ed, t.$box);
                if (t.$box.width() >= 1200) {
                    t.$ed.addClass('bordered');
                }
            });
    }

    ngOnDestroy() {
        this.element.trumbowyg('destroy');
    }
}
