import { Directive, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { TrumbowygTidyPlugin } from './tidy';
import { TrumbowygFontSizePlugin } from './font-size';
import { TrumbowygFontsPlugin } from './fonts';
import { TrumbowygSelectStylesPlugin } from './select-styles';
import { TrumbowygInsertLeadPlugin } from './insert-lead';
import { TrumbowygInsertMediaEmbedPlugin } from './insert-media-embed';
import { TrumbowygInsertTablePlugin } from './insert-table';
import { TrumbowygSelectImagesPlugin } from './select-images';
import { TrumbowygSelectResourcesPlugin } from './select-resources';
import { TrumbowygSelectTemplatesPlugin } from './select-templates';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const LEGACY_BOOTSTRAP_ID = 'legacy-bootstrap-styles';
export class TrumbowygEditor {
    constructor(el, render, http) {
        this.el = el;
        this.render = render;
        this.http = http;
        this.hasAutoSave = false;
        this.autoSaveKey = '';
        this.lastUpdate = 0;
        this.addBtns = [];
        this._required = false;
        this.base64ImageInserted = new EventEmitter();
        this.onInit = new EventEmitter();
        this._autoSaveTimer = null;
        this._autoSaved = null;
        this.propagateChange = (_) => {
        };
        this._required = this.el.nativeElement.hasAttribute('required');
        this._name = this.el.nativeElement.getAttribute('name');
        // console.log('el', this._name, this._required);
    }
    validate(c) {
        if (!this._required) {
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
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() {
        // console.log('registerOnTouched');
    }
    onChange(value) {
        // console.log('onChange', this._value, value);
        this._value = value;
        if (this.hasAutoSave) {
            this._autoSave();
        }
    }
    _autoSave() {
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => {
            this._saveToServer();
        }, 500);
    }
    _saveToServer() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache' //no cache
        });
        this.http.post(TrumbowygTidyPlugin.editor.autoSaveUrl + '?action=auto-save', JSON.stringify({
            key: this.autoSaveKey,
            content: this._value
        }), {
            headers: headers
        }).toPromise()
            .then((res) => {
            // console.log('_autoSave res', res.json());
        });
    }
    _checkAutoSave() {
        this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=check-auto-save&key=' + this.autoSaveKey).toPromise()
            .then((res) => {
            this._autoSaved = res;
            // console.log('_checkAutoSave res', this._autoSaved, this.lastUpdate);
            if (this._autoSaved && parseInt(this._autoSaved.date, 10) > this.lastUpdate) {
                this._buildAutoSaveToolbar();
                // console.log('_hasAutoSave');
            }
        });
    }
    _buildAutoSaveToolbar() {
        this.element.data('trumbowyg').$box.append('<div class="trumbowyg-auto-save">' +
            '<span class="title">' + TrumbowygEditor.langs[this.lang].hasAutoSavedMsg + '</span>' +
            '<span class="buttons">' +
            '<button type="button" class="button-sm-default">' + TrumbowygEditor.langs[this.lang].autoSaveCancel + '</button>' +
            '<button type="button" class="button-sm-success">' + TrumbowygEditor.langs[this.lang].autoSaveRestore + '</button>' +
            '</span>' +
            '</div>');
        setTimeout(() => {
            jQuery('.trumbowyg-auto-save .button-sm-default', this.element.data('trumbowyg').$box)
                .on('click', (e) => {
                // console.log('cancel');
                e.target.innerHTML = '...';
                this.clearAutoSaved();
            });
            jQuery('.trumbowyg-auto-save .button-sm-success', this.element.data('trumbowyg').$box)
                .on('click', (e) => {
                // console.log('restore');
                e.target.innerHTML = '...';
                this.restoreAutoSave();
                jQuery('.trumbowyg-auto-save').hide();
            });
        }, 200);
    }
    clearAutoSaved() {
        this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=clear-auto-save&key=' + this.autoSaveKey).toPromise()
            .then((res) => {
            // console.log('_checkAutoSave res', res.json());
            this._autoSaved = null;
            jQuery('.trumbowyg-auto-save').hide();
        });
    }
    restoreAutoSave() {
        if (this._autoSaved) {
            this._value = this._autoSaved.content;
            this.element.trumbowyg('html', this._value);
            this.propagateChange(this._value);
            this.lastUpdate = parseInt(this._autoSaved.date, 10);
        }
    }
    writeValue(value) {
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
    init(lang) {
        TrumbowygEditor.inited = true;
        // console.log('init', lang);
        // console.log('TrumbowygEditor.langs', TrumbowygEditor.langs);
        if (TrumbowygEditor.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor.langs;
        }
        jQuery.trumbowyg.svgPath = window.TrumbowygEditorSvgPath || '/bower_components/trumbowyg/dist/ui/icons.svg';
        jQuery.trumbowyg.tidyUrl = '/api/rest.php/trumbowyg?action=tidy';
        jQuery.trumbowyg.autoSaveUrl = '/api/rest.php/trumbowyg';
        jQuery.trumbowyg.insertHtml = function (t, html) {
            try {
                try {
                    // <= IE10
                    t.doc.selection.createRange().pasteHTML(html);
                }
                catch (err) {
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
            }
            catch (err) {
                // Not IE
                t.execCmd('insertHTML', html);
            }
            t.syncCode();
            t.$c.trigger('tbwchange');
        };
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
    ngOnChanges(changes) {
        if (this.base64Image) {
            //console.log('ngOnChanges base64Image', this.base64Image);
            var el = jQuery('<div>' + this.element.trumbowyg('html') + '</div>');
            el.find('#' + this.base64Image.uid).attr('src', this.base64Image.file);
            this.base64Image = null;
            this.element.trumbowyg('html', el.html());
        }
    }
    detectBase64Insert(html) {
        //console.log('detectBase64Insert', html);
        if (TrumbowygEditor.localImageRegexp.test(html)) {
            var images = [];
            var el = jQuery('<div>' + html + '</div>');
            var uid;
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
        if (this.mode == 'extend' || this.mode == 'full') {
            if (!document.getElementById(LEGACY_BOOTSTRAP_ID)) {
                let linkContainer = document.createElement("LINK");
                this.render.setAttribute(linkContainer, 'id', LEGACY_BOOTSTRAP_ID);
                this.render.setAttribute(linkContainer, 'rel', 'stylesheet');
                this.render.setAttribute(linkContainer, 'href', '/node_modules/ng2-trumbowyg/assets/modified-bootstrap.css');
                document.body.appendChild(linkContainer);
            }
        }
        if (this.addBtns && this.mode == 'extend') {
            console.log('TrumbowygEditor addBtns', this.addBtns);
            this.addBtns.forEach((value) => {
                if (value == 'selectStyles') {
                    let elemIndex = TrumbowygEditor.modes['full'].indexOf(value);
                    tmpBtns.splice(elemIndex, 0, value);
                    addElement++;
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
            var html = this.element.trumbowyg('html');
            //console.log('tbwpaste', html);
            if (!this.detectBase64Insert(html)) {
                this.propagateChange(html);
                this.onChange(html);
            }
            //console.log('tbwpaste', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwchange', () => {
            var html = this.element.trumbowyg('html');
            //console.log('tbwchange', html);
            if (!this.detectBase64Insert(html)) {
                this.propagateChange(html);
                this.onChange(html);
            }
            //console.log('tbwchange', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwinit', (e) => {
            let t = this.element.data('trumbowyg');
            // console.log('tbwinit', e, t, this.element);
            if (t) {
                t.$box.addClass('trumbowyg-' + this.mode);
                t.$ed.addClass('page-container');
                t.$ed.addClass('legacy-bootstrap');
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
TrumbowygEditor.modes = {};
TrumbowygEditor.langs = {};
TrumbowygEditor.inited = false;
TrumbowygEditor.localImageRegexp = /src\=\"data\:image\/(.*)\"/gi;
TrumbowygEditor.ɵfac = function TrumbowygEditor_Factory(t) { return new (t || TrumbowygEditor)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i1.HttpClient)); };
TrumbowygEditor.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: TrumbowygEditor, selectors: [["", "trumbowyg-editor", ""]], inputs: { hasAutoSave: ["has-auto-save", "hasAutoSave"], autoSaveKey: ["auto-save-key", "autoSaveKey"], lastUpdate: ["last-update", "lastUpdate"], addBtns: "addBtns", mode: "mode", lang: "lang", base64Image: "base64Image" }, outputs: { base64ImageInserted: "base64ImageInserted" }, features: [i0.ɵɵProvidersFeature([
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
        ]), i0.ɵɵNgOnChangesFeature] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TrumbowygEditor, [{
        type: Directive,
        args: [{
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
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.HttpClient }]; }, { hasAutoSave: [{
            type: Input,
            args: ['has-auto-save']
        }], autoSaveKey: [{
            type: Input,
            args: ['auto-save-key']
        }], lastUpdate: [{
            type: Input,
            args: ['last-update']
        }], addBtns: [{
            type: Input
        }], mode: [{
            type: Input
        }], lang: [{
            type: Input
        }], base64Image: [{
            type: Input
        }], base64ImageInserted: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2FzbHVic2t5L3dvcmsvY29sbGFib3JhdG9yL25nMi10cnVtYm93eWcvc3JjLyIsInNvdXJjZXMiOlsiZWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFVBQVUsRUFDVixNQUFNLEVBQ04sWUFBWSxFQU1mLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUM3RCxPQUFPLEVBQXVCLGlCQUFpQixFQUFFLGFBQWEsRUFBYyxNQUFNLGdCQUFnQixDQUFDO0FBRW5HLE9BQU8sNkJBQTZCLENBQUM7QUFFckMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNwRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDN0MsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7QUFFbEUsTUFBTSxtQkFBbUIsR0FBRyx5QkFBeUIsQ0FBQztBQW1CdEQsTUFBTSxPQUFPLGVBQWU7SUE0QnhCLFlBQW9CLEVBQWMsRUFDZCxNQUFpQixFQUNqQixJQUFnQjtRQUZoQixPQUFF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bnQiOlsiaW1wb3J0IHtcbiAgICBEaXJlY3RpdmUsXG4gICAgSW5wdXQsXG4gICAgZm9yd2FyZFJlZixcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgT25Jbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMsXG4gICAgU2ltcGxlQ2hhbmdlcywgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwSGVhZGVycywgSHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IsIE5HX1ZBTElEQVRPUlMsIEZvcm1Db250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdG9Qcm9taXNlJztcblxuaW1wb3J0IHtUcnVtYm93eWdUaWR5UGx1Z2lufSBmcm9tICcuL3RpZHknO1xuaW1wb3J0IHtUcnVtYm93eWdGb250U2l6ZVBsdWdpbn0gZnJvbSAnLi9mb250LXNpemUnO1xuaW1wb3J0IHtUcnVtYm93eWdGb250c1BsdWdpbn0gZnJvbSAnLi9mb250cyc7XG5pbXBvcnQge1RydW1ib3d5Z1NlbGVjdFN0eWxlc1BsdWdpbn0gZnJvbSAnLi9zZWxlY3Qtc3R5bGVzJztcbmltcG9ydCB7VHJ1bWJvd3lnSW5zZXJ0TGVhZFBsdWdpbn0gZnJvbSAnLi9pbnNlcnQtbGVhZCc7XG5pbXBvcnQge1RydW1ib3d5Z0luc2VydE1lZGlhRW1iZWRQbHVnaW59IGZyb20gJy4vaW5zZXJ0LW1lZGlhLWVtYmVkJztcbmltcG9ydCB7VHJ1bWJvd3lnSW5zZXJ0VGFibGVQbHVnaW59IGZyb20gJy4vaW5zZXJ0LXRhYmxlJztcbmltcG9ydCB7VHJ1bWJvd3lnU2VsZWN0SW1hZ2VzUGx1Z2lufSBmcm9tICcuL3NlbGVjdC1pbWFnZXMnO1xuaW1wb3J0IHtUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW59IGZyb20gJy4vc2VsZWN0LXJlc291cmNlcyc7XG5pbXBvcnQge1RydW1ib3d5Z1NlbGVjdFRlbXBsYXRlc1BsdWdpbn0gZnJvbSAnLi9zZWxlY3QtdGVtcGxhdGVzJztcblxuY29uc3QgTEVHQUNZX0JPT1RTVFJBUF9JRCA9ICdsZWdhY3ktYm9vdHN0cmFwLXN0eWxlcyc7XG5cbmRlY2xhcmUgdmFyIGpRdWVyeTogYW55O1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1t0cnVtYm93eWctZWRpdG9yXScsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVHJ1bWJvd3lnRWRpdG9yKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBUcnVtYm93eWdFZGl0b3IpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVHJ1bWJvd3lnRWRpdG9yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAgIHB1YmxpYyBzdGF0aWMgbW9kZXM6IGFueSA9IHt9O1xuICAgIHB1YmxpYyBzdGF0aWMgbGFuZ3M6IGFueSA9IHt9O1xuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBsb2NhbEltYWdlUmVnZXhwOiBSZWdFeHAgPSAvc3JjXFw9XFxcImRhdGFcXDppbWFnZVxcLyguKilcXFwiL2dpO1xuXG4gICAgQElucHV0KCdoYXMtYXV0by1zYXZlJykgaGFzQXV0b1NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoJ2F1dG8tc2F2ZS1rZXknKSBhdXRvU2F2ZUtleTogc3RyaW5nID0gJyc7XG4gICAgQElucHV0KCdsYXN0LXVwZGF0ZScpIGxhc3RVcGRhdGU6IG51bWJlciA9IDA7XG4gICAgQElucHV0KCkgYWRkQnRuczogYW55ID0gW107XG4gICAgQElucHV0KCkgbW9kZTogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhbmc6IHN0cmluZztcbiAgICBASW5wdXQoKSBiYXNlNjRJbWFnZTogYW55O1xuXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3ZhbHVlOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQE91dHB1dCgpIGJhc2U2NEltYWdlSW5zZXJ0ZWQ6IGFueSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHB1YmxpYyBvbkluaXQ6IGFueSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHByaXZhdGUgZWxlbWVudDogYW55O1xuXG4gICAgcHJpdmF0ZSBfYXV0b1NhdmVUaW1lcjogYW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9hdXRvU2F2ZWQ6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2VsJywgdGhpcy5fbmFtZSwgdGhpcy5fcmVxdWlyZWQpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKGM6IEZvcm1Db250cm9sKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVxdWlyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMudmFsdWUgJiYgYy52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdUcnVtYm93eWdFZGl0b3IgTkdfVkFMSURBVE9SUycsIHRoaXMuX25hbWUsIGMudmFsdWUsICdpbnZhbGlkJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvcGFnYXRlQ2hhbmdlID0gKF86IGFueSkgPT4ge1xuICAgIH07XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcbiAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZCgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZ2lzdGVyT25Ub3VjaGVkJyk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UodmFsdWU6IGFueSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25DaGFuZ2UnLCB0aGlzLl92YWx1ZSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmhhc0F1dG9TYXZlKSB7XG4gICAgICAgICAgICB0aGlzLl9hdXRvU2F2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYXV0b1NhdmUoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9hdXRvU2F2ZVRpbWVyKTtcbiAgICAgICAgdGhpcy5fYXV0b1NhdmVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2F2ZVRvU2VydmVyKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2F2ZVRvU2VydmVyKCkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAnSWYtTW9kaWZpZWQtU2luY2UnOiAnTW9uLCAyNiBKdWwgMTk5NyAwNTowMDowMCBHTVQnLC8vbm8gY2FjaGVcbiAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJywvL25vIGNhY2hlXG4gICAgICAgICAgICAnUHJhZ21hJzogJ25vLWNhY2hlJy8vbm8gY2FjaGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5odHRwLnBvc3QoVHJ1bWJvd3lnVGlkeVBsdWdpbi5lZGl0b3IuYXV0b1NhdmVVcmwgKyAnP2FjdGlvbj1hdXRvLXNhdmUnLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBrZXk6IHRoaXMuYXV0b1NhdmVLZXksXG4gICAgICAgICAgICBjb250ZW50OiB0aGlzLl92YWx1ZVxuICAgICAgICB9KSwge1xuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgICAgICB9KS50b1Byb21pc2UoKVxuICAgICAgICAgICAgLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ19hdXRvU2F2ZSByZXMnLCByZXMuanNvbigpKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NoZWNrQXV0b1NhdmUoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5nZXQoVHJ1bWJvd3lnVGlkeVBsdWdpbi5lZGl0b3IuYXV0b1NhdmVVcmwgK1xuICAgICAgICAgICAgJz9hY3Rpb249Y2hlY2stYXV0by1zYXZlJmtleT0nICsgdGhpcy5hdXRvU2F2ZUtleSkudG9Qcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9TYXZlZCA9IHJlcztcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnX2NoZWNrQXV0b1NhdmUgcmVzJywgdGhpcy5fYXV0b1NhdmVkLCB0aGlzLmxhc3RVcGRhdGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2F1dG9TYXZlZCAmJiBwYXJzZUludCh0aGlzLl9hdXRvU2F2ZWQuZGF0ZSwgMTApID4gdGhpcy5sYXN0VXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1aWxkQXV0b1NhdmVUb29sYmFyKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdfaGFzQXV0b1NhdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9idWlsZEF1dG9TYXZlVG9vbGJhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGEoJ3RydW1ib3d5ZycpLiRib3guYXBwZW5kKCc8ZGl2IGNsYXNzPVwidHJ1bWJvd3lnLWF1dG8tc2F2ZVwiPicgK1xuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidGl0bGVcIj4nICsgVHJ1bWJvd3lnRWRpdG9yLmxhbmdzW3RoaXMubGFuZ10uaGFzQXV0b1NhdmVkTXNnICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImJ1dHRvbnNcIj4nICtcbiAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ1dHRvbi1zbS1kZWZhdWx0XCI+JyArIFRydW1ib3d5Z0VkaXRvci5sYW5nc1t0aGlzLmxhbmddLmF1dG9TYXZlQ2FuY2VsICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnV0dG9uLXNtLXN1Y2Nlc3NcIj4nICsgVHJ1bWJvd3lnRWRpdG9yLmxhbmdzW3RoaXMubGFuZ10uYXV0b1NhdmVSZXN0b3JlICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnRydW1ib3d5Zy1hdXRvLXNhdmUgLmJ1dHRvbi1zbS1kZWZhdWx0JywgdGhpcy5lbGVtZW50LmRhdGEoJ3RydW1ib3d5ZycpLiRib3gpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbmNlbCcpO1xuICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5pbm5lckhUTUwgPSAnLi4uJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckF1dG9TYXZlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqUXVlcnkoJy50cnVtYm93eWctYXV0by1zYXZlIC5idXR0b24tc20tc3VjY2VzcycsIHRoaXMuZWxlbWVudC5kYXRhKCd0cnVtYm93eWcnKS4kYm94KVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXN0b3JlJyk7XG4gICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmlubmVySFRNTCA9ICcuLi4nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBdXRvU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy50cnVtYm93eWctYXV0by1zYXZlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAyMDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dG9TYXZlZCgpIHtcbiAgICAgICAgdGhpcy5odHRwLmdldChUcnVtYm93eWdUaWR5UGx1Z2luLmVkaXRvci5hdXRvU2F2ZVVybCArXG4gICAgICAgICAgICAnP2FjdGlvbj1jbGVhci1hdXRvLXNhdmUma2V5PScgKyB0aGlzLmF1dG9TYXZlS2V5KS50b1Byb21pc2UoKVxuICAgICAgICAgICAgLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ19jaGVja0F1dG9TYXZlIHJlcycsIHJlcy5qc29uKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9TYXZlZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcudHJ1bWJvd3lnLWF1dG8tc2F2ZScpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXN0b3JlQXV0b1NhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2F2ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5fYXV0b1NhdmVkLmNvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdodG1sJywgdGhpcy5fdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5fdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gcGFyc2VJbnQodGhpcy5fYXV0b1NhdmVkLmRhdGUsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnd3JpdGVWYWx1ZScsIHRoaXMuX25hbWUsIHZhbHVlKTtcblxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuX3ZhbHVlLmxlbmd0aCA9PSAwICYmICgvd2Via2l0L2kpLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdodG1sJywgJzxwPjwvcD4nKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdodG1sJywgdGhpcy5fdmFsdWUpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0KGxhbmc6IHN0cmluZykge1xuICAgICAgICBUcnVtYm93eWdFZGl0b3IuaW5pdGVkID0gdHJ1ZTtcbi8vIGNvbnNvbGUubG9nKCdpbml0JywgbGFuZyk7XG4vLyBjb25zb2xlLmxvZygnVHJ1bWJvd3lnRWRpdG9yLmxhbmdzJywgVHJ1bWJvd3lnRWRpdG9yLmxhbmdzKTtcbiAgICAgICAgaWYgKFRydW1ib3d5Z0VkaXRvci5sYW5ncykge1xuICAgICAgICAgICAgalF1ZXJ5LnRydW1ib3d5Zy5sYW5ncyA9IFRydW1ib3d5Z0VkaXRvci5sYW5ncztcbiAgICAgICAgfVxuXG4gICAgICAgIGpRdWVyeS50cnVtYm93eWcuc3ZnUGF0aCA9ICg8YW55PndpbmRvdykuVHJ1bWJvd3lnRWRpdG9yU3ZnUGF0aCB8fCAnL2Jvd2VyX2NvbXBvbmVudHMvdHJ1bWJvd3lnL2Rpc3QvdWkvaWNvbnMuc3ZnJztcbiAgICAgICAgalF1ZXJ5LnRydW1ib3d5Zy50aWR5VXJsID0gJy9hcGkvcmVzdC5waHAvdHJ1bWJvd3lnP2FjdGlvbj10aWR5JztcbiAgICAgICAgalF1ZXJ5LnRydW1ib3d5Zy5hdXRvU2F2ZVVybCA9ICcvYXBpL3Jlc3QucGhwL3RydW1ib3d5Zyc7XG5cbiAgICAgICAgalF1ZXJ5LnRydW1ib3d5Zy5pbnNlcnRIdG1sID0gZnVuY3Rpb24gKHQ6IGFueSwgaHRtbDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDw9IElFMTBcbiAgICAgICAgICAgICAgICAgICAgdC5kb2Muc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkucGFzdGVIVE1MKGh0bWwpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJRSAxMVxuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJhZzogYW55ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5vZGU6IGFueTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChub2RlID0gZWwuZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROb2RlID0gZnJhZy5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZ2UgPSB0LmRvYy5nZXRTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApO1xuICAgICAgICAgICAgICAgICAgICByYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgICAgICAgICAgICByYW5nZS5pbnNlcnROb2RlKGZyYWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIE5vdCBJRVxuICAgICAgICAgICAgICAgIHQuZXhlY0NtZCgnaW5zZXJ0SFRNTCcsIGh0bWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5zeW5jQ29kZSgpO1xuICAgICAgICAgICAgdC4kYy50cmlnZ2VyKCd0YndjaGFuZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBidG5zR3JwcyA9IHtcbiAgICAgICAgICAgIGRlc2lnbjogWydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtldGhyb3VnaCddLFxuICAgICAgICAgICAgc2VtYW50aWM6IFsnc3Ryb25nJywgJ2VtJywgJ2RlbCddLFxuICAgICAgICAgICAganVzdGlmeTogWydqdXN0aWZ5TGVmdCcsICdqdXN0aWZ5Q2VudGVyJywgJ2p1c3RpZnlSaWdodCcsICdqdXN0aWZ5RnVsbCddLFxuICAgICAgICAgICAgbGlzdHM6IFsndW5vcmRlcmVkTGlzdCcsICdvcmRlcmVkTGlzdCddXG4gICAgICAgIH07XG5cbiAgICAgICAgVHJ1bWJvd3lnVGlkeVBsdWdpbi5pbml0KGpRdWVyeS50cnVtYm93eWcsIGxhbmcsIHRoaXMuaHR0cCk7XG4gICAgICAgIFRydW1ib3d5Z0ZvbnRTaXplUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z0ZvbnRzUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z0luc2VydExlYWRQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0U3R5bGVzUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z0luc2VydFRhYmxlUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z0luc2VydE1lZGlhRW1iZWRQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0SW1hZ2VzUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5pbml0KGpRdWVyeS50cnVtYm93eWcsIGxhbmcpO1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcblxuICAgICAgICAvL2NvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnaW5pdCcsIGpRdWVyeS50cnVtYm93eWcpO1xuXG5cbiAgICAgICAgVHJ1bWJvd3lnRWRpdG9yLm1vZGVzID0ge1xuICAgICAgICAgICAgaW5saW5lOiBbXG4gICAgICAgICAgICAgICAgJ3JlbW92ZWZvcm1hdCcsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmRlc2lnbiwgJ3wnLFxuICAgICAgICAgICAgICAgICdmb250TmFtZScsXG4gICAgICAgICAgICAgICAgJ2ZvbnRTaXplJyxcbiAgICAgICAgICAgICAgICAnZm9yZUNvbG9yJyxcbiAgICAgICAgICAgICAgICAnYmFja0NvbG9yJyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2luc2VydE1lZGlhRW1iZWQnLFxuICAgICAgICAgICAgICAgICdzZWxlY3RJbWFnZSdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzaW1wbGU6IFtcbiAgICAgICAgICAgICAgICAncmVtb3ZlZm9ybWF0JyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuZGVzaWduLCAnfCcsXG4gICAgICAgICAgICAgICAgJ2ZvbnROYW1lJyxcbiAgICAgICAgICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5qdXN0aWZ5LFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5saXN0cyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2xpbmsnLFxuICAgICAgICAgICAgICAgICdpbnNlcnRNZWRpYUVtYmVkJyxcbiAgICAgICAgICAgICAgICAnc2VsZWN0SW1hZ2UnLFxuICAgICAgICAgICAgICAgICdob3Jpem9udGFsUnVsZScsXG4gICAgICAgICAgICAgICAgJ2Z1bGxzY3JlZW4nXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbm9JbWFnZTogW1xuICAgICAgICAgICAgICAgICd2aWV3SFRNTCcsXG4gICAgICAgICAgICAgICAgJ3JlbW92ZWZvcm1hdCcsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmRlc2lnbixcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2Zvcm1hdHRpbmcnLFxuICAgICAgICAgICAgICAgICdmb250TmFtZScsXG4gICAgICAgICAgICAgICAgJ2ZvbnRTaXplJyxcbiAgICAgICAgICAgICAgICAnZm9yZUNvbG9yJyxcbiAgICAgICAgICAgICAgICAnYmFja0NvbG9yJyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuanVzdGlmeSxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMubGlzdHMsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgICdsaW5rJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0TWVkaWFFbWJlZCcsXG4gICAgICAgICAgICAgICAgJ2hvcml6b250YWxSdWxlJyxcbiAgICAgICAgICAgICAgICAnZnVsbHNjcmVlbidcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBleHRlbmQ6IFtcbiAgICAgICAgICAgICAgICAndmlld0hUTUwnLFxuICAgICAgICAgICAgICAgICdyZW1vdmVmb3JtYXQnLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5kZXNpZ24sXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgICdmb3JtYXR0aW5nJyxcbiAgICAgICAgICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAgICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICAgICAgICAgJ2ZvcmVDb2xvcicsXG4gICAgICAgICAgICAgICAgJ2JhY2tDb2xvcicsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmp1c3RpZnksXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmxpc3RzLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICAnbGluaycsXG4gICAgICAgICAgICAgICAgJ2luc2VydE1lZGlhRW1iZWQnLFxuICAgICAgICAgICAgICAgICdzZWxlY3RJbWFnZScsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdFRlbXBsYXRlcycsXG4gICAgICAgICAgICAgICAgJ2luc2VydFRhYmxlJyxcbiAgICAgICAgICAgICAgICAnaG9yaXpvbnRhbFJ1bGUnLFxuICAgICAgICAgICAgICAgICdmdWxsc2NyZWVuJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGZ1bGw6IFtcbiAgICAgICAgICAgICAgICAndmlld0hUTUwnLFxuICAgICAgICAgICAgICAgICdyZW1vdmVmb3JtYXQnLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5kZXNpZ24sXG4gICAgICAgICAgICAgICAgJ3NlbGVjdFN0eWxlcycsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgICdmb3JtYXR0aW5nJyxcbiAgICAgICAgICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAgICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICAgICAgICAgJ2ZvcmVDb2xvcicsXG4gICAgICAgICAgICAgICAgJ2JhY2tDb2xvcicsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmp1c3RpZnksXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmxpc3RzLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICAnbGluaycsXG4gICAgICAgICAgICAgICAgJ2luc2VydE1lZGlhRW1iZWQnLFxuICAgICAgICAgICAgICAgICdzZWxlY3RJbWFnZScsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdFJlc291cmNlcycsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdFRlbXBsYXRlcycsXG4gICAgICAgICAgICAgICAgJ2luc2VydFRhYmxlJyxcbiAgICAgICAgICAgICAgICAnaG9yaXpvbnRhbFJ1bGUnLFxuICAgICAgICAgICAgICAgICdmdWxsc2NyZWVuJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFzZTY0SW1hZ2UpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25nT25DaGFuZ2VzIGJhc2U2NEltYWdlJywgdGhpcy5iYXNlNjRJbWFnZSk7XG4gICAgICAgICAgICB2YXIgZWwgPSBqUXVlcnkoJzxkaXY+JyArIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnKSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgIGVsLmZpbmQoJyMnICsgdGhpcy5iYXNlNjRJbWFnZS51aWQpLmF0dHIoJ3NyYycsIHRoaXMuYmFzZTY0SW1hZ2UuZmlsZSk7XG4gICAgICAgICAgICB0aGlzLmJhc2U2NEltYWdlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnLCBlbC5odG1sKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlY3RCYXNlNjRJbnNlcnQoaHRtbDogc3RyaW5nKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2RldGVjdEJhc2U2NEluc2VydCcsIGh0bWwpO1xuICAgICAgICBpZiAoVHJ1bWJvd3lnRWRpdG9yLmxvY2FsSW1hZ2VSZWdleHAudGVzdChodG1sKSkge1xuICAgICAgICAgICAgdmFyIGltYWdlczogYW55W10gPSBbXTtcblxuICAgICAgICAgICAgdmFyIGVsID0galF1ZXJ5KCc8ZGl2PicgKyBodG1sICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgdmFyIHVpZDogc3RyaW5nO1xuICAgICAgICAgICAgZWwuZmluZCgnaW1nW3NyY149XCJkYXRhOmltYWdlXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFqUXVlcnkodGhpcykuYXR0cignaWQnKSkge1xuICAgICAgICAgICAgICAgICAgICB1aWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgOSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hdHRyKCdpZCcsIHVpZCk7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiB0aGlzLnNyY1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnLCBlbC5odG1sKCkpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnaW1hZ2VzJywgaW1hZ2VzKTtcbiAgICAgICAgICAgIGltYWdlcy5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhc2U2NEltYWdlSW5zZXJ0ZWQuZW1pdChpbWFnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnVHJ1bWJvd3lnRWRpdG9yIG5nT25Jbml0Jyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1RydW1ib3d5Z0VkaXRvciBsYW5ncycsIFRydW1ib3d5Z0VkaXRvci5sYW5ncyk7XG4gICAgICAgIHRoaXMubGFuZyA9IHRoaXMubGFuZyB8fCAnZW4nO1xuXG4gICAgICAgIHRoaXMuaW5pdCh0aGlzLmxhbmcpO1xuICAgICAgICB0aGlzLm9uSW5pdC5lbWl0KCk7XG5cbiAgICAgICAgdGhpcy5tb2RlID0gdGhpcy5tb2RlIHx8ICdzaW1wbGUnO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBqUXVlcnkodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgICB2YXIgdG1wQnRucyA9IFRydW1ib3d5Z0VkaXRvci5tb2Rlc1t0aGlzLm1vZGVdO1xuICAgICAgICB0aGlzLmFkZEJ0bnMgPSB0aGlzLmFkZEJ0bnMgfHwgbnVsbDtcblxuICAgICAgICBsZXQgYWRkRWxlbWVudCA9IDA7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT0gJ2V4dGVuZCcgfHwgdGhpcy5tb2RlID09ICdmdWxsJykge1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChMRUdBQ1lfQk9PVFNUUkFQX0lEKSkge1xuICAgICAgICAgICAgICAgIGxldCBsaW5rQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkxJTktcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIuc2V0QXR0cmlidXRlKGxpbmtDb250YWluZXIsICdpZCcsIExFR0FDWV9CT09UU1RSQVBfSUQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyLnNldEF0dHJpYnV0ZShsaW5rQ29udGFpbmVyLCAncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlci5zZXRBdHRyaWJ1dGUobGlua0NvbnRhaW5lciwgJ2hyZWYnLCAnL25vZGVfbW9kdWxlcy9uZzItdHJ1bWJvd3lnL2Fzc2V0cy9tb2RpZmllZC1ib290c3RyYXAuY3NzJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hZGRCdG5zICYmIHRoaXMubW9kZSA9PSAnZXh0ZW5kJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1RydW1ib3d5Z0VkaXRvciBhZGRCdG5zJywgdGhpcy5hZGRCdG5zKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQnRucy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09ICdzZWxlY3RTdHlsZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtSW5kZXggPSBUcnVtYm93eWdFZGl0b3IubW9kZXNbJ2Z1bGwnXS5pbmRleE9mKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdG1wQnRucy5zcGxpY2UoZWxlbUluZGV4LCAwLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGFkZEVsZW1lbnQrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gJ3NlbGVjdFJlc291cmNlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1JbmRleCA9IFRydW1ib3d5Z0VkaXRvci5tb2Rlc1snZnVsbCddLmluZGV4T2YodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnRQcmV2aW91c0VsZW1lbnRzID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdG1wQnRucy5zcGxpY2UoZWxlbUluZGV4IC0gY291bnRQcmV2aW91c0VsZW1lbnRzICsgYWRkRWxlbWVudCwgMCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnZGVzdHJveScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKHtcbiAgICAgICAgICAgIGJ0bnM6IHRtcEJ0bnMsXG4gICAgICAgICAgICBsYW5nOiB0aGlzLmxhbmcsXG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBzZW1hbnRpYzogZmFsc2UsXG4gICAgICAgICAgICBhdXRvZ3JvdzogdGhpcy5tb2RlID09ICdpbmxpbmUnLFxuICAgICAgICAgICAgdGFibGV0OiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgICAgICAub24oJ3Rid3Bhc3RlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBodG1sOiBzdHJpbmcgPSB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdodG1sJyk7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndGJ3cGFzdGUnLCBodG1sKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGV0ZWN0QmFzZTY0SW5zZXJ0KGh0bWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0YndwYXN0ZScsIGh0bWwpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NlbGYubmdNb2RlbENoYW5nZScsIHNlbGYubmdNb2RlbENoYW5nZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCd0YndjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGh0bWw6IHN0cmluZyA9IHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0YndjaGFuZ2UnLCBodG1sKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGV0ZWN0QmFzZTY0SW5zZXJ0KGh0bWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0YndjaGFuZ2UnLCBodG1sKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWxmLm5nTW9kZWxDaGFuZ2UnLCBzZWxmLm5nTW9kZWxDaGFuZ2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbigndGJ3aW5pdCcsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdDogYW55ID0gdGhpcy5lbGVtZW50LmRhdGEoJ3RydW1ib3d5ZycpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0Yndpbml0JywgZSwgdCwgdGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgICAgICAgICB0LiRib3guYWRkQ2xhc3MoJ3RydW1ib3d5Zy0nICsgdGhpcy5tb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgdC4kZWQuYWRkQ2xhc3MoJ3BhZ2UtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHQuJGVkLmFkZENsYXNzKCdsZWdhY3ktYm9vdHN0cmFwJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0Yndpbml0JywgZSwgdCwgdC4kZWQsIHQuJGJveCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0LiRib3gud2lkdGgoKSA+PSAxMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LiRlZC5hZGRDbGFzcygnYm9yZGVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hhc0F1dG9TYXZlJywgdGhpcy5oYXNBdXRvU2F2ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBdXRvU2F2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrQXV0b1NhdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnZGVzdHJveScpO1xuICAgIH1cbn1cbiJdfQ==