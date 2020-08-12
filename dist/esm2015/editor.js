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
            this._autoSaved = res.json();
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
TrumbowygEditor.ɵdir = i0.ɵɵdefineDirective({ type: TrumbowygEditor, selectors: [["", "trumbowyg-editor", ""]], inputs: { hasAutoSave: ["has-auto-save", "hasAutoSave"], autoSaveKey: ["auto-save-key", "autoSaveKey"], lastUpdate: ["last-update", "lastUpdate"], addBtns: "addBtns", mode: "mode", lang: "lang", base64Image: "base64Image" }, outputs: { base64ImageInserted: "base64ImageInserted" }, features: [i0.ɵɵProvidersFeature([
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
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TrumbowygEditor, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFlBQVksRUFNZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDN0QsT0FBTyxFQUF1QixpQkFBaUIsRUFBRSxhQUFhLEVBQWMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRyxPQUFPLDZCQUE2QixDQUFDO0FBRXJDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQyxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsOEJBQThCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsOEJBQThCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7O0FBRWxFLE1BQU0sbUJBQW1CLEdBQUcseUJBQXlCLENBQUM7QUFtQnRELE1BQU0sT0FBTyxlQUFlO0lBNEJ4QixZQUFvQixFQUFjLEVBQ2QsTUFBaUIsRUFDakIsSUFBZ0I7UUFGaEIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLFdBQU0sR0FBTixNQUFNLENBQVc7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QUFDOztBQW5kYSxxQkFBSyxHQUFRLEVBQUUsQ0FBQztBQUNoQixxQkFBSyxHQUFRLEVBQUUsQ0FBQztBQUNoQixzQkFBTSxHQUFZLEtBQUssQ0FBQztBQUN4QixnQ0FBZ0IsR0FBVyw4QkFBOEIsQ0FBQzs4RUFKL0QsZUFBZTtvREFBZixlQUFlLHdXQWJiO1lBQ1A7Z0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzlDLEtBQUssRUFBRSxJQUFJO2FBQ2Q7WUFDRDtnQkFDSSxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzlDLEtBQUssRUFBRSxJQUFJO2FBQ2Q7U0FDSjtrREFFUSxlQUFlO2NBZjNCLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixTQUFTLEVBQUU7b0JBQ1A7d0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7d0JBQzlDLEtBQUssRUFBRSxJQUFJO3FCQUNkO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQzt3QkFDOUMsS0FBSyxFQUFFLElBQUk7cUJBQ2Q7aUJBQ0o7YUFDSjs7a0JBT0ksS0FBSzttQkFBQyxlQUFlOztrQkFDckIsS0FBSzttQkFBQyxlQUFlOztrQkFDckIsS0FBSzttQkFBQyxhQUFhOztrQkFDbkIsS0FBSzs7a0JBQ0wsS0FBSzs7a0JBQ0wsS0FBSzs7a0JBQ0wsS0FBSzs7a0JBT0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgRGlyZWN0aXZlLFxuICAgIElucHV0LFxuICAgIGZvcndhcmRSZWYsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBFbGVtZW50UmVmLFxuICAgIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25DaGFuZ2VzLFxuICAgIFNpbXBsZUNoYW5nZXMsIFJlbmRlcmVyMlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cEhlYWRlcnMsIEh0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SLCBOR19WQUxJREFUT1JTLCBGb3JtQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5cbmltcG9ydCB7VHJ1bWJvd3lnVGlkeVBsdWdpbn0gZnJvbSAnLi90aWR5JztcbmltcG9ydCB7VHJ1bWJvd3lnRm9udFNpemVQbHVnaW59IGZyb20gJy4vZm9udC1zaXplJztcbmltcG9ydCB7VHJ1bWJvd3lnRm9udHNQbHVnaW59IGZyb20gJy4vZm9udHMnO1xuaW1wb3J0IHtUcnVtYm93eWdTZWxlY3RTdHlsZXNQbHVnaW59IGZyb20gJy4vc2VsZWN0LXN0eWxlcyc7XG5pbXBvcnQge1RydW1ib3d5Z0luc2VydExlYWRQbHVnaW59IGZyb20gJy4vaW5zZXJ0LWxlYWQnO1xuaW1wb3J0IHtUcnVtYm93eWdJbnNlcnRNZWRpYUVtYmVkUGx1Z2lufSBmcm9tICcuL2luc2VydC1tZWRpYS1lbWJlZCc7XG5pbXBvcnQge1RydW1ib3d5Z0luc2VydFRhYmxlUGx1Z2lufSBmcm9tICcuL2luc2VydC10YWJsZSc7XG5pbXBvcnQge1RydW1ib3d5Z1NlbGVjdEltYWdlc1BsdWdpbn0gZnJvbSAnLi9zZWxlY3QtaW1hZ2VzJztcbmltcG9ydCB7VHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2lufSBmcm9tICcuL3NlbGVjdC1yZXNvdXJjZXMnO1xuaW1wb3J0IHtUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW59IGZyb20gJy4vc2VsZWN0LXRlbXBsYXRlcyc7XG5cbmNvbnN0IExFR0FDWV9CT09UU1RSQVBfSUQgPSAnbGVnYWN5LWJvb3RzdHJhcC1zdHlsZXMnO1xuXG5kZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbdHJ1bWJvd3lnLWVkaXRvcl0nLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRydW1ib3d5Z0VkaXRvciksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVHJ1bWJvd3lnRWRpdG9yKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFRydW1ib3d5Z0VkaXRvciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgICBwdWJsaWMgc3RhdGljIG1vZGVzOiBhbnkgPSB7fTtcbiAgICBwdWJsaWMgc3RhdGljIGxhbmdzOiBhbnkgPSB7fTtcbiAgICBwdWJsaWMgc3RhdGljIGluaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0aWMgbG9jYWxJbWFnZVJlZ2V4cDogUmVnRXhwID0gL3NyY1xcPVxcXCJkYXRhXFw6aW1hZ2VcXC8oLiopXFxcIi9naTtcblxuICAgIEBJbnB1dCgnaGFzLWF1dG8tc2F2ZScpIGhhc0F1dG9TYXZlOiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KCdhdXRvLXNhdmUta2V5JykgYXV0b1NhdmVLZXk6IHN0cmluZyA9ICcnO1xuICAgIEBJbnB1dCgnbGFzdC11cGRhdGUnKSBsYXN0VXBkYXRlOiBudW1iZXIgPSAwO1xuICAgIEBJbnB1dCgpIGFkZEJ0bnM6IGFueSA9IFtdO1xuICAgIEBJbnB1dCgpIG1vZGU6IHN0cmluZztcbiAgICBASW5wdXQoKSBsYW5nOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFzZTY0SW1hZ2U6IGFueTtcblxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIF92YWx1ZTogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBPdXRwdXQoKSBiYXNlNjRJbWFnZUluc2VydGVkOiBhbnkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwdWJsaWMgb25Jbml0OiBhbnkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnQ6IGFueTtcblxuICAgIHByaXZhdGUgX2F1dG9TYXZlVGltZXI6IGFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfYXV0b1NhdmVkOiBhbnkgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlbmRlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xuICAgICAgICB0aGlzLl9yZXF1aXJlZCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgICAgIHRoaXMuX25hbWUgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbCcsIHRoaXMuX25hbWUsIHRoaXMuX3JlcXVpcmVkKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShjOiBGb3JtQ29udHJvbCkge1xuICAgICAgICBpZiAoIXRoaXMuX3JlcXVpcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjLnZhbHVlICYmIGMudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnVHJ1bWJvd3lnRWRpdG9yIE5HX1ZBTElEQVRPUlMnLCB0aGlzLl9uYW1lLCBjLnZhbHVlLCAnaW52YWxpZCcpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3BhZ2F0ZUNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICB9O1xuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWdpc3Rlck9uVG91Y2hlZCcpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uQ2hhbmdlJywgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5oYXNBdXRvU2F2ZSkge1xuICAgICAgICAgICAgdGhpcy5fYXV0b1NhdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2F1dG9TYXZlKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fYXV0b1NhdmVUaW1lcik7XG4gICAgICAgIHRoaXMuX2F1dG9TYXZlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NhdmVUb1NlcnZlcigpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3NhdmVUb1NlcnZlcigpIHtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgJ0lmLU1vZGlmaWVkLVNpbmNlJzogJ01vbiwgMjYgSnVsIDE5OTcgMDU6MDA6MDAgR01UJywvL25vIGNhY2hlXG4gICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsLy9ubyBjYWNoZVxuICAgICAgICAgICAgJ1ByYWdtYSc6ICduby1jYWNoZScvL25vIGNhY2hlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaHR0cC5wb3N0KFRydW1ib3d5Z1RpZHlQbHVnaW4uZWRpdG9yLmF1dG9TYXZlVXJsICsgJz9hY3Rpb249YXV0by1zYXZlJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAga2V5OiB0aGlzLmF1dG9TYXZlS2V5LFxuICAgICAgICAgICAgY29udGVudDogdGhpcy5fdmFsdWVcbiAgICAgICAgfSksIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICAgICAgfSkudG9Qcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdfYXV0b1NhdmUgcmVzJywgcmVzLmpzb24oKSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jaGVja0F1dG9TYXZlKCkge1xuICAgICAgICB0aGlzLmh0dHAuZ2V0KFRydW1ib3d5Z1RpZHlQbHVnaW4uZWRpdG9yLmF1dG9TYXZlVXJsICtcbiAgICAgICAgICAgICc/YWN0aW9uPWNoZWNrLWF1dG8tc2F2ZSZrZXk9JyArIHRoaXMuYXV0b1NhdmVLZXkpLnRvUHJvbWlzZSgpXG4gICAgICAgICAgICAudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2F2ZWQgPSByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdfY2hlY2tBdXRvU2F2ZSByZXMnLCB0aGlzLl9hdXRvU2F2ZWQsIHRoaXMubGFzdFVwZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYXV0b1NhdmVkICYmIHBhcnNlSW50KHRoaXMuX2F1dG9TYXZlZC5kYXRlLCAxMCkgPiB0aGlzLmxhc3RVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnVpbGRBdXRvU2F2ZVRvb2xiYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ19oYXNBdXRvU2F2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2J1aWxkQXV0b1NhdmVUb29sYmFyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YSgndHJ1bWJvd3lnJykuJGJveC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJ0cnVtYm93eWctYXV0by1zYXZlXCI+JyArXG4gICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPicgKyBUcnVtYm93eWdFZGl0b3IubGFuZ3NbdGhpcy5sYW5nXS5oYXNBdXRvU2F2ZWRNc2cgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiYnV0dG9uc1wiPicgK1xuICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnV0dG9uLXNtLWRlZmF1bHRcIj4nICsgVHJ1bWJvd3lnRWRpdG9yLmxhbmdzW3RoaXMubGFuZ10uYXV0b1NhdmVDYW5jZWwgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b24tc20tc3VjY2Vzc1wiPicgKyBUcnVtYm93eWdFZGl0b3IubGFuZ3NbdGhpcy5sYW5nXS5hdXRvU2F2ZVJlc3RvcmUgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgJzwvZGl2PicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgalF1ZXJ5KCcudHJ1bWJvd3lnLWF1dG8tc2F2ZSAuYnV0dG9uLXNtLWRlZmF1bHQnLCB0aGlzLmVsZW1lbnQuZGF0YSgndHJ1bWJvd3lnJykuJGJveClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgKGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FuY2VsJyk7XG4gICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmlubmVySFRNTCA9ICcuLi4nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyQXV0b1NhdmVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpRdWVyeSgnLnRydW1ib3d5Zy1hdXRvLXNhdmUgLmJ1dHRvbi1zbS1zdWNjZXNzJywgdGhpcy5lbGVtZW50LmRhdGEoJ3RydW1ib3d5ZycpLiRib3gpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc3RvcmUnKTtcbiAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuaW5uZXJIVE1MID0gJy4uLic7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUF1dG9TYXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLnRydW1ib3d5Zy1hdXRvLXNhdmUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDIwMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQXV0b1NhdmVkKCkge1xuICAgICAgICB0aGlzLmh0dHAuZ2V0KFRydW1ib3d5Z1RpZHlQbHVnaW4uZWRpdG9yLmF1dG9TYXZlVXJsICtcbiAgICAgICAgICAgICc/YWN0aW9uPWNsZWFyLWF1dG8tc2F2ZSZrZXk9JyArIHRoaXMuYXV0b1NhdmVLZXkpLnRvUHJvbWlzZSgpXG4gICAgICAgICAgICAudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnX2NoZWNrQXV0b1NhdmUgcmVzJywgcmVzLmpzb24oKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b1NhdmVkID0gbnVsbDtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy50cnVtYm93eWctYXV0by1zYXZlJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc3RvcmVBdXRvU2F2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TYXZlZCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLl9hdXRvU2F2ZWQuY29udGVudDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnLCB0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSh0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBwYXJzZUludCh0aGlzLl9hdXRvU2F2ZWQuZGF0ZSwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd3cml0ZVZhbHVlJywgdGhpcy5fbmFtZSwgdmFsdWUpO1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5fdmFsdWUubGVuZ3RoID09IDAgJiYgKC93ZWJraXQvaSkudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnLCAnPHA+PC9wPicpO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnLCB0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXQobGFuZzogc3RyaW5nKSB7XG4gICAgICAgIFRydW1ib3d5Z0VkaXRvci5pbml0ZWQgPSB0cnVlO1xuLy8gY29uc29sZS5sb2coJ2luaXQnLCBsYW5nKTtcbi8vIGNvbnNvbGUubG9nKCdUcnVtYm93eWdFZGl0b3IubGFuZ3MnLCBUcnVtYm93eWdFZGl0b3IubGFuZ3MpO1xuICAgICAgICBpZiAoVHJ1bWJvd3lnRWRpdG9yLmxhbmdzKSB7XG4gICAgICAgICAgICBqUXVlcnkudHJ1bWJvd3lnLmxhbmdzID0gVHJ1bWJvd3lnRWRpdG9yLmxhbmdzO1xuICAgICAgICB9XG5cbiAgICAgICAgalF1ZXJ5LnRydW1ib3d5Zy5zdmdQYXRoID0gKDxhbnk+d2luZG93KS5UcnVtYm93eWdFZGl0b3JTdmdQYXRoIHx8ICcvYm93ZXJfY29tcG9uZW50cy90cnVtYm93eWcvZGlzdC91aS9pY29ucy5zdmcnO1xuICAgICAgICBqUXVlcnkudHJ1bWJvd3lnLnRpZHlVcmwgPSAnL2FwaS9yZXN0LnBocC90cnVtYm93eWc/YWN0aW9uPXRpZHknO1xuICAgICAgICBqUXVlcnkudHJ1bWJvd3lnLmF1dG9TYXZlVXJsID0gJy9hcGkvcmVzdC5waHAvdHJ1bWJvd3lnJztcblxuICAgICAgICBqUXVlcnkudHJ1bWJvd3lnLmluc2VydEh0bWwgPSBmdW5jdGlvbiAodDogYW55LCBodG1sOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gPD0gSUUxMFxuICAgICAgICAgICAgICAgICAgICB0LmRvYy5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS5wYXN0ZUhUTUwoaHRtbCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElFIDExXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmcmFnOiBhbnkgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Tm9kZTogYW55O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKG5vZGUgPSBlbC5maXJzdENoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5vZGUgPSBmcmFnLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHQuZG9jLmdldFNlbGVjdGlvbigpLmdldFJhbmdlQXQoMCk7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUoZnJhZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90IElFXG4gICAgICAgICAgICAgICAgdC5leGVjQ21kKCdpbnNlcnRIVE1MJywgaHRtbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnN5bmNDb2RlKCk7XG4gICAgICAgICAgICB0LiRjLnRyaWdnZXIoJ3Rid2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJ0bnNHcnBzID0ge1xuICAgICAgICAgICAgZGVzaWduOiBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2V0aHJvdWdoJ10sXG4gICAgICAgICAgICBzZW1hbnRpYzogWydzdHJvbmcnLCAnZW0nLCAnZGVsJ10sXG4gICAgICAgICAgICBqdXN0aWZ5OiBbJ2p1c3RpZnlMZWZ0JywgJ2p1c3RpZnlDZW50ZXInLCAnanVzdGlmeVJpZ2h0JywgJ2p1c3RpZnlGdWxsJ10sXG4gICAgICAgICAgICBsaXN0czogWyd1bm9yZGVyZWRMaXN0JywgJ29yZGVyZWRMaXN0J11cbiAgICAgICAgfTtcblxuICAgICAgICBUcnVtYm93eWdUaWR5UGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZywgdGhpcy5odHRwKTtcbiAgICAgICAgVHJ1bWJvd3lnRm9udFNpemVQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnRm9udHNQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnSW5zZXJ0TGVhZFBsdWdpbi5pbml0KGpRdWVyeS50cnVtYm93eWcsIGxhbmcpO1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RTdHlsZXNQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnSW5zZXJ0VGFibGVQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnSW5zZXJ0TWVkaWFFbWJlZFBsdWdpbi5pbml0KGpRdWVyeS50cnVtYm93eWcsIGxhbmcpO1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RJbWFnZXNQbHVnaW4uaW5pdChqUXVlcnkudHJ1bWJvd3lnLCBsYW5nKTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmluaXQoalF1ZXJ5LnRydW1ib3d5ZywgbGFuZyk7XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFRlbXBsYXRlc1BsdWdpbi5pbml0KGpRdWVyeS50cnVtYm93eWcsIGxhbmcpO1xuXG4gICAgICAgIC8vY29uc29sZS50cmFjZSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdpbml0JywgalF1ZXJ5LnRydW1ib3d5Zyk7XG5cblxuICAgICAgICBUcnVtYm93eWdFZGl0b3IubW9kZXMgPSB7XG4gICAgICAgICAgICBpbmxpbmU6IFtcbiAgICAgICAgICAgICAgICAncmVtb3ZlZm9ybWF0JyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuZGVzaWduLCAnfCcsXG4gICAgICAgICAgICAgICAgJ2ZvbnROYW1lJyxcbiAgICAgICAgICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAgICAgICAgICdmb3JlQ29sb3InLFxuICAgICAgICAgICAgICAgICdiYWNrQ29sb3InLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0TWVkaWFFbWJlZCcsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdEltYWdlJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHNpbXBsZTogW1xuICAgICAgICAgICAgICAgICdyZW1vdmVmb3JtYXQnLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5kZXNpZ24sICd8JyxcbiAgICAgICAgICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAgICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmp1c3RpZnksXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmxpc3RzLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICAnbGluaycsXG4gICAgICAgICAgICAgICAgJ2luc2VydE1lZGlhRW1iZWQnLFxuICAgICAgICAgICAgICAgICdzZWxlY3RJbWFnZScsXG4gICAgICAgICAgICAgICAgJ2hvcml6b250YWxSdWxlJyxcbiAgICAgICAgICAgICAgICAnZnVsbHNjcmVlbidcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBub0ltYWdlOiBbXG4gICAgICAgICAgICAgICAgJ3ZpZXdIVE1MJyxcbiAgICAgICAgICAgICAgICAncmVtb3ZlZm9ybWF0JyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuZGVzaWduLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICAnZm9ybWF0dGluZycsXG4gICAgICAgICAgICAgICAgJ2ZvbnROYW1lJyxcbiAgICAgICAgICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAgICAgICAgICdmb3JlQ29sb3InLFxuICAgICAgICAgICAgICAgICdiYWNrQ29sb3InLFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5qdXN0aWZ5LFxuICAgICAgICAgICAgICAgICd8JyxcbiAgICAgICAgICAgICAgICBidG5zR3Jwcy5saXN0cyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2xpbmsnLFxuICAgICAgICAgICAgICAgICdpbnNlcnRNZWRpYUVtYmVkJyxcbiAgICAgICAgICAgICAgICAnaG9yaXpvbnRhbFJ1bGUnLFxuICAgICAgICAgICAgICAgICdmdWxsc2NyZWVuJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGV4dGVuZDogW1xuICAgICAgICAgICAgICAgICd2aWV3SFRNTCcsXG4gICAgICAgICAgICAgICAgJ3JlbW92ZWZvcm1hdCcsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmRlc2lnbixcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2Zvcm1hdHRpbmcnLFxuICAgICAgICAgICAgICAgICdmb250TmFtZScsXG4gICAgICAgICAgICAgICAgJ2ZvbnRTaXplJyxcbiAgICAgICAgICAgICAgICAnZm9yZUNvbG9yJyxcbiAgICAgICAgICAgICAgICAnYmFja0NvbG9yJyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuanVzdGlmeSxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMubGlzdHMsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgICdsaW5rJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0TWVkaWFFbWJlZCcsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdEltYWdlJyxcbiAgICAgICAgICAgICAgICAnc2VsZWN0VGVtcGxhdGVzJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0VGFibGUnLFxuICAgICAgICAgICAgICAgICdob3Jpem9udGFsUnVsZScsXG4gICAgICAgICAgICAgICAgJ2Z1bGxzY3JlZW4nXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZnVsbDogW1xuICAgICAgICAgICAgICAgICd2aWV3SFRNTCcsXG4gICAgICAgICAgICAgICAgJ3JlbW92ZWZvcm1hdCcsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgIGJ0bnNHcnBzLmRlc2lnbixcbiAgICAgICAgICAgICAgICAnc2VsZWN0U3R5bGVzJyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgJ2Zvcm1hdHRpbmcnLFxuICAgICAgICAgICAgICAgICdmb250TmFtZScsXG4gICAgICAgICAgICAgICAgJ2ZvbnRTaXplJyxcbiAgICAgICAgICAgICAgICAnZm9yZUNvbG9yJyxcbiAgICAgICAgICAgICAgICAnYmFja0NvbG9yJyxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMuanVzdGlmeSxcbiAgICAgICAgICAgICAgICAnfCcsXG4gICAgICAgICAgICAgICAgYnRuc0dycHMubGlzdHMsXG4gICAgICAgICAgICAgICAgJ3wnLFxuICAgICAgICAgICAgICAgICdsaW5rJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0TWVkaWFFbWJlZCcsXG4gICAgICAgICAgICAgICAgJ3NlbGVjdEltYWdlJyxcbiAgICAgICAgICAgICAgICAnc2VsZWN0UmVzb3VyY2VzJyxcbiAgICAgICAgICAgICAgICAnc2VsZWN0VGVtcGxhdGVzJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0VGFibGUnLFxuICAgICAgICAgICAgICAgICdob3Jpem9udGFsUnVsZScsXG4gICAgICAgICAgICAgICAgJ2Z1bGxzY3JlZW4nXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5iYXNlNjRJbWFnZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbmdPbkNoYW5nZXMgYmFzZTY0SW1hZ2UnLCB0aGlzLmJhc2U2NEltYWdlKTtcbiAgICAgICAgICAgIHZhciBlbCA9IGpRdWVyeSgnPGRpdj4nICsgdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnaHRtbCcpICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgZWwuZmluZCgnIycgKyB0aGlzLmJhc2U2NEltYWdlLnVpZCkuYXR0cignc3JjJywgdGhpcy5iYXNlNjRJbWFnZS5maWxlKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZTY0SW1hZ2UgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnaHRtbCcsIGVsLmh0bWwoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRldGVjdEJhc2U2NEluc2VydChodG1sOiBzdHJpbmcpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGV0ZWN0QmFzZTY0SW5zZXJ0JywgaHRtbCk7XG4gICAgICAgIGlmIChUcnVtYm93eWdFZGl0b3IubG9jYWxJbWFnZVJlZ2V4cC50ZXN0KGh0bWwpKSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2VzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgZWwgPSBqUXVlcnkoJzxkaXY+JyArIGh0bWwgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICB2YXIgdWlkOiBzdHJpbmc7XG4gICAgICAgICAgICBlbC5maW5kKCdpbWdbc3JjXj1cImRhdGE6aW1hZ2VcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWpRdWVyeSh0aGlzKS5hdHRyKCdpZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCA5KTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmF0dHIoJ2lkJywgdWlkKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IHRoaXMuc3JjXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnaHRtbCcsIGVsLmh0bWwoKSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdpbWFnZXMnLCBpbWFnZXMpO1xuICAgICAgICAgICAgaW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFzZTY0SW1hZ2VJbnNlcnRlZC5lbWl0KGltYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdUcnVtYm93eWdFZGl0b3IgbmdPbkluaXQnKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnVHJ1bWJvd3lnRWRpdG9yIGxhbmdzJywgVHJ1bWJvd3lnRWRpdG9yLmxhbmdzKTtcbiAgICAgICAgdGhpcy5sYW5nID0gdGhpcy5sYW5nIHx8ICdlbic7XG5cbiAgICAgICAgdGhpcy5pbml0KHRoaXMubGFuZyk7XG4gICAgICAgIHRoaXMub25Jbml0LmVtaXQoKTtcblxuICAgICAgICB0aGlzLm1vZGUgPSB0aGlzLm1vZGUgfHwgJ3NpbXBsZSc7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGpRdWVyeSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgIHZhciB0bXBCdG5zID0gVHJ1bWJvd3lnRWRpdG9yLm1vZGVzW3RoaXMubW9kZV07XG4gICAgICAgIHRoaXMuYWRkQnRucyA9IHRoaXMuYWRkQnRucyB8fCBudWxsO1xuXG4gICAgICAgIGxldCBhZGRFbGVtZW50ID0gMDtcbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PSAnZXh0ZW5kJyB8fCB0aGlzLm1vZGUgPT0gJ2Z1bGwnKSB7XG4gICAgICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKExFR0FDWV9CT09UU1RSQVBfSUQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmtDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiTElOS1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlci5zZXRBdHRyaWJ1dGUobGlua0NvbnRhaW5lciwgJ2lkJywgTEVHQUNZX0JPT1RTVFJBUF9JRCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIuc2V0QXR0cmlidXRlKGxpbmtDb250YWluZXIsICdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyLnNldEF0dHJpYnV0ZShsaW5rQ29udGFpbmVyLCAnaHJlZicsICcvbm9kZV9tb2R1bGVzL25nMi10cnVtYm93eWcvYXNzZXRzL21vZGlmaWVkLWJvb3RzdHJhcC5jc3MnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmtDb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFkZEJ0bnMgJiYgdGhpcy5tb2RlID09ICdleHRlbmQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVHJ1bWJvd3lnRWRpdG9yIGFkZEJ0bnMnLCB0aGlzLmFkZEJ0bnMpO1xuICAgICAgICAgICAgdGhpcy5hZGRCdG5zLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gJ3NlbGVjdFN0eWxlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1JbmRleCA9IFRydW1ib3d5Z0VkaXRvci5tb2Rlc1snZnVsbCddLmluZGV4T2YodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0bXBCdG5zLnNwbGljZShlbGVtSW5kZXgsIDAsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYWRkRWxlbWVudCsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSAnc2VsZWN0UmVzb3VyY2VzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbUluZGV4ID0gVHJ1bWJvd3lnRWRpdG9yLm1vZGVzWydmdWxsJ10uaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudFByZXZpb3VzRWxlbWVudHMgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0bXBCdG5zLnNwbGljZShlbGVtSW5kZXggLSBjb3VudFByZXZpb3VzRWxlbWVudHMgKyBhZGRFbGVtZW50LCAwLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdkZXN0cm95Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC50cnVtYm93eWcoe1xuICAgICAgICAgICAgYnRuczogdG1wQnRucyxcbiAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZyxcbiAgICAgICAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNlbWFudGljOiBmYWxzZSxcbiAgICAgICAgICAgIGF1dG9ncm93OiB0aGlzLm1vZGUgPT0gJ2lubGluZScsXG4gICAgICAgICAgICB0YWJsZXQ6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbigndGJ3cGFzdGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGh0bWw6IHN0cmluZyA9IHRoaXMuZWxlbWVudC50cnVtYm93eWcoJ2h0bWwnKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0YndwYXN0ZScsIGh0bWwpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXRlY3RCYXNlNjRJbnNlcnQoaHRtbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Rid3Bhc3RlJywgaHRtbCk7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2VsZi5uZ01vZGVsQ2hhbmdlJywgc2VsZi5uZ01vZGVsQ2hhbmdlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oJ3Rid2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaHRtbDogc3RyaW5nID0gdGhpcy5lbGVtZW50LnRydW1ib3d5ZygnaHRtbCcpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Rid2NoYW5nZScsIGh0bWwpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXRlY3RCYXNlNjRJbnNlcnQoaHRtbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Rid2NoYW5nZScsIGh0bWwpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NlbGYubmdNb2RlbENoYW5nZScsIHNlbGYubmdNb2RlbENoYW5nZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCd0Yndpbml0JywgKGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0OiBhbnkgPSB0aGlzLmVsZW1lbnQuZGF0YSgndHJ1bWJvd3lnJyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Rid2luaXQnLCBlLCB0LCB0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHQuJGJveC5hZGRDbGFzcygndHJ1bWJvd3lnLScgKyB0aGlzLm1vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0LiRlZC5hZGRDbGFzcygncGFnZS1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgICAgICAgdC4kZWQuYWRkQ2xhc3MoJ2xlZ2FjeS1ib290c3RyYXAnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Rid2luaXQnLCBlLCB0LCB0LiRlZCwgdC4kYm94KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuJGJveC53aWR0aCgpID49IDEyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuJGVkLmFkZENsYXNzKCdib3JkZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGFzQXV0b1NhdmUnLCB0aGlzLmhhc0F1dG9TYXZlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0F1dG9TYXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tBdXRvU2F2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQudHJ1bWJvd3lnKCdkZXN0cm95Jyk7XG4gICAgfVxufVxuIl19