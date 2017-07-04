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
import {Http, Headers} from '@angular/http';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl} from '@angular/forms';

import 'rxjs/add/operator/toPromise';

import {TrumbowygTidyPlugin} from './tidy';
import {TrumbowygFontSizePlugin} from './font-size';
import {TrumbowygFontsPlugin} from './fonts';
import {TrumbowygSelectStylesPlugin} from './select-styles';
import {TrumbowygInsertLeadPlugin} from './insert-lead';
import {TrumbowygInsertMediaEmbedPlugin} from './insert-media-embed';
import {TrumbowygInsertTablePlugin} from './insert-table';
import {TrumbowygSelectImagesPlugin} from './select-images';
import {TrumbowygSelectResourcesPlugin} from './select-resources';
import {TrumbowygSelectTemplatesPlugin} from './select-templates';


declare var jQuery: any;

@Directive({
    selector: '[trumbowyg-editor]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrumbowygEditor),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
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

    @Input('has-auto-save') hasAutoSave: boolean = false;
    @Input('auto-save-key') autoSaveKey: string = '';
    @Input('last-update') lastUpdate: number = 0;
    @Input() addBtns: any = [];
    @Input() mode: string;
    @Input() lang: string;
    @Input() base64Image: any;

    private _name: string;
    private _value: string;

    private _required: boolean = false;

    @Output() base64ImageInserted: any = new EventEmitter();

    public onInit: any = new EventEmitter();

    private element: any;

    private _autoSaveTimer: number = null;
    private _autoSaved: any = null;

    constructor(private el: ElementRef, private http: Http) {
        this._required = this.el.nativeElement.hasAttribute('required');
        this._name = this.el.nativeElement.getAttribute('name');
        // console.log('el', this._name, this._required);
    }

    validate(c: FormControl) {
        if(!this._required) {
            return null;
        }

        if (c.value && c.value.length > 0) {
            return null;
        }

        // console.log('TrumbowygEditor NG_VALIDATORS', this._name, c.value, 'invalid');

        return {
            required: true
        };
    }

    propagateChange = (_: any) => {
    };

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
        // console.log('registerOnTouched');
    }

    onChange(value: any) {
        // console.log('onChange', this._value, value);
        this._value = value;

        if (this.hasAutoSave) {
            this._autoSave();
        }
    }

    private _autoSave() {
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => {
            this._saveToServer();
        }, 500);
    }

    private _saveToServer() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',//no cache
            'Cache-Control': 'no-cache',//no cache
            'Pragma': 'no-cache'//no cache
        });

        this.http.post(TrumbowygTidyPlugin.editor.autoSaveUrl + '?action=auto-save', JSON.stringify({
            key: this.autoSaveKey,
            content: this._value
        }), {
            headers: headers
        }).toPromise()
            .then((res: any) => {
                // console.log('_autoSave res', res.json());
            });
    }

    private _checkAutoSave() {
        this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=check-auto-save&key=' + this.autoSaveKey).toPromise()
            .then((res: any) => {
                this._autoSaved = res.json();
                // console.log('_checkAutoSave res', this._autoSaved, this.lastUpdate);

                if (this._autoSaved && parseInt(this._autoSaved.date, 10) > this.lastUpdate) {
                    this._buildAutoSaveToolbar();
                    // console.log('_hasAutoSave');
                }
            });
    }

    private _buildAutoSaveToolbar() {
        this.element.data('trumbowyg').$box.append('<div class="trumbowyg-auto-save">' +
            '<span class="title">' + TrumbowygEditor.langs[this.lang].hasAutoSavedMsg + '</span>' +
            '<span class="buttons">' +
            '<button type="button" class="btn btn-sm btn-default">' + TrumbowygEditor.langs[this.lang].autoSaveCancel + '</button>' +
            '<button type="button" class="btn btn-sm btn-success">' + TrumbowygEditor.langs[this.lang].autoSaveRestore + '</button>' +
            '</span>' +
            '</div>');

        setTimeout(()=> {
            jQuery('.trumbowyg-auto-save .btn-default', this.element.data('trumbowyg').$box)
                .on('click', (e: any) => {
                    // console.log('cancel');
                    e.target.innerHTML = '...';
                    this.clearAutoSaved();
                });

            jQuery('.trumbowyg-auto-save .btn-success', this.element.data('trumbowyg').$box)
                .on('click', (e: any) => {
                    // console.log('restore');
                    e.target.innerHTML = '...';
                    this.restoreAutoSave();
                    jQuery('.trumbowyg-auto-save').hide();
                });
        }, 200);
    }

    public clearAutoSaved() {
        this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=clear-auto-save&key=' + this.autoSaveKey).toPromise()
            .then((res: any) => {
                // console.log('_checkAutoSave res', res.json());
                this._autoSaved = null;
                jQuery('.trumbowyg-auto-save').hide();
            });
    }

    public restoreAutoSave() {
        if (this._autoSaved) {
            this._value = this._autoSaved.content;
            this.element.trumbowyg('html', this._value);
            this.propagateChange(this._value);
            this.lastUpdate = parseInt(this._autoSaved.date, 10);
        }
    }

    writeValue(value: any) {
        // console.log('writeValue', this._name, value);

        if (value != null) {
            this._value = value;

            // if (this._value.length == 0 && (/webkit/i).test(navigator.userAgent)) {
            //     this.element.trumbowyg('html', '<p></p>');
            // } else {
                this.element.trumbowyg('html', this._value);
            // }
        }
    }

    private init(lang: string) {
        TrumbowygEditor.inited = true;
// console.log('init', lang);
// console.log('TrumbowygEditor.langs', TrumbowygEditor.langs);
        if (TrumbowygEditor.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor.langs;
        }

        jQuery.trumbowyg.svgPath = '/bower_components/trumbowyg/dist/ui/icons.svg';
        jQuery.trumbowyg.tidyUrl = '/api/rest.php/trumbowyg?action=tidy';
        jQuery.trumbowyg.autoSaveUrl = '/api/rest.php/trumbowyg';

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

        TrumbowygTidyPlugin.init(jQuery.trumbowyg, lang, this.http);
        TrumbowygFontSizePlugin.init(jQuery.trumbowyg, lang);
        TrumbowygFontsPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertLeadPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygSelectStylesPlugin.init(jQuery.trumbowyg, lang);
        TrumbowygInsertTablePlugin.init(jQuery.trumbowyg, lang);
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
            noImage: [
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
                'selectStyles',
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

        this.init(this.lang);
        this.onInit.emit();

        this.mode = this.mode || 'simple';
        this.element = jQuery(this.el.nativeElement);

        var tmpBtns = TrumbowygEditor.modes[this.mode];
        this.addBtns = this.addBtns || null;

        let addElement = 0;
        if (this.addBtns && this.mode == 'extend') {
            console.log('TrumbowygEditor addBtns', this.addBtns);
            this.addBtns.forEach((value: any) => {
                if (value == 'selectStyles') {
                    let elemIndex = TrumbowygEditor.modes['full'].indexOf(value);
                    tmpBtns.splice(elemIndex, 0, value);
                    addElement ++;
                }

                if (value == 'selectResources') {
                    let elemIndex = TrumbowygEditor.modes['full'].indexOf(value);
                    let countPreviousElements = 1;
                    tmpBtns.splice(elemIndex - countPreviousElements + addElement, 0, value);
                }
            });
        }

        this.element.trumbowyg('destroy');
        this.element.trumbowyg({
            btns: tmpBtns,
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
                    this.propagateChange(html);
                    this.onChange(html);
                }
                //console.log('tbwpaste', html);
                //console.log('self.ngModelChange', self.ngModelChange);
            })
            .on('tbwchange', () => {
                var html: string = this.element.trumbowyg('html');
                //console.log('tbwchange', html);
                if (!this.detectBase64Insert(html)) {
                    this.propagateChange(html);
                    this.onChange(html);
                }
                //console.log('tbwchange', html);
                //console.log('self.ngModelChange', self.ngModelChange);
            })
            .on('tbwinit', (e: any) => {
                let t: any = this.element.data('trumbowyg');
                // console.log('tbwinit', e, t, this.element);
                if(t) {
                    t.$box.addClass('trumbowyg-' + this.mode);
                    t.$ed.addClass('page-container');
                    // console.log('tbwinit', e, t, t.$ed, t.$box);
                    if (t.$box.width() >= 1200) {
                        t.$ed.addClass('bordered');
                    }
                }
            });

        setTimeout(() => {
            // console.log('hasAutoSave', this.hasAutoSave);
            if (this.hasAutoSave) {
                this._checkAutoSave();
            }
        }, 500);
    }

    ngOnDestroy() {
        this.element.trumbowyg('destroy');
    }
}
