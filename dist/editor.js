"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/toPromise");
var tidy_1 = require("./tidy");
var font_size_1 = require("./font-size");
var fonts_1 = require("./fonts");
var select_styles_1 = require("./select-styles");
var insert_lead_1 = require("./insert-lead");
var insert_media_embed_1 = require("./insert-media-embed");
var insert_table_1 = require("./insert-table");
var select_images_1 = require("./select-images");
var select_resources_1 = require("./select-resources");
var select_templates_1 = require("./select-templates");
var LEGACY_BOOTSTRAP_ID = 'legacy-bootstrap-styles';
var TrumbowygEditor = TrumbowygEditor_1 = (function () {
    function TrumbowygEditor(el, render, http) {
        this.el = el;
        this.render = render;
        this.http = http;
        this.hasAutoSave = false;
        this.autoSaveKey = '';
        this.lastUpdate = 0;
        this.addBtns = [];
        this._required = false;
        this.base64ImageInserted = new core_1.EventEmitter();
        this.onInit = new core_1.EventEmitter();
        this._autoSaveTimer = null;
        this._autoSaved = null;
        this.propagateChange = function (_) {
        };
        this._required = this.el.nativeElement.hasAttribute('required');
        this._name = this.el.nativeElement.getAttribute('name');
        // console.log('el', this._name, this._required);
    }
    TrumbowygEditor.prototype.validate = function (c) {
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
    };
    TrumbowygEditor.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    TrumbowygEditor.prototype.registerOnTouched = function () {
        // console.log('registerOnTouched');
    };
    TrumbowygEditor.prototype.onChange = function (value) {
        // console.log('onChange', this._value, value);
        this._value = value;
        if (this.hasAutoSave) {
            this._autoSave();
        }
    };
    TrumbowygEditor.prototype._autoSave = function () {
        var _this = this;
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(function () {
            _this._saveToServer();
        }, 500);
    };
    TrumbowygEditor.prototype._saveToServer = function () {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache' //no cache
        });
        this.http.post(tidy_1.TrumbowygTidyPlugin.editor.autoSaveUrl + '?action=auto-save', JSON.stringify({
            key: this.autoSaveKey,
            content: this._value
        }), {
            headers: headers
        }).toPromise()
            .then(function (res) {
            // console.log('_autoSave res', res.json());
        });
    };
    TrumbowygEditor.prototype._checkAutoSave = function () {
        var _this = this;
        this.http.get(tidy_1.TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=check-auto-save&key=' + this.autoSaveKey).toPromise()
            .then(function (res) {
            _this._autoSaved = res.json();
            // console.log('_checkAutoSave res', this._autoSaved, this.lastUpdate);
            if (_this._autoSaved && parseInt(_this._autoSaved.date, 10) > _this.lastUpdate) {
                _this._buildAutoSaveToolbar();
            }
        });
    };
    TrumbowygEditor.prototype._buildAutoSaveToolbar = function () {
        var _this = this;
        this.element.data('trumbowyg').$box.append('<div class="trumbowyg-auto-save">' +
            '<span class="title">' + TrumbowygEditor_1.langs[this.lang].hasAutoSavedMsg + '</span>' +
            '<span class="buttons">' +
            '<button type="button" class="button-sm-default">' + TrumbowygEditor_1.langs[this.lang].autoSaveCancel + '</button>' +
            '<button type="button" class="button-sm-success">' + TrumbowygEditor_1.langs[this.lang].autoSaveRestore + '</button>' +
            '</span>' +
            '</div>');
        setTimeout(function () {
            jQuery('.trumbowyg-auto-save .button-sm-default', _this.element.data('trumbowyg').$box)
                .on('click', function (e) {
                // console.log('cancel');
                e.target.innerHTML = '...';
                _this.clearAutoSaved();
            });
            jQuery('.trumbowyg-auto-save .button-sm-success', _this.element.data('trumbowyg').$box)
                .on('click', function (e) {
                // console.log('restore');
                e.target.innerHTML = '...';
                _this.restoreAutoSave();
                jQuery('.trumbowyg-auto-save').hide();
            });
        }, 200);
    };
    TrumbowygEditor.prototype.clearAutoSaved = function () {
        var _this = this;
        this.http.get(tidy_1.TrumbowygTidyPlugin.editor.autoSaveUrl +
            '?action=clear-auto-save&key=' + this.autoSaveKey).toPromise()
            .then(function (res) {
            // console.log('_checkAutoSave res', res.json());
            _this._autoSaved = null;
            jQuery('.trumbowyg-auto-save').hide();
        });
    };
    TrumbowygEditor.prototype.restoreAutoSave = function () {
        if (this._autoSaved) {
            this._value = this._autoSaved.content;
            this.element.trumbowyg('html', this._value);
            this.propagateChange(this._value);
            this.lastUpdate = parseInt(this._autoSaved.date, 10);
        }
    };
    TrumbowygEditor.prototype.writeValue = function (value) {
        // console.log('writeValue', this._name, value);
        if (value != null) {
            this._value = value;
            // if (this._value.length == 0 && (/webkit/i).test(navigator.userAgent)) {
            //     this.element.trumbowyg('html', '<p></p>');
            // } else {
            this.element.trumbowyg('html', this._value);
        }
    };
    TrumbowygEditor.prototype.init = function (lang) {
        TrumbowygEditor_1.inited = true;
        // console.log('init', lang);
        // console.log('TrumbowygEditor.langs', TrumbowygEditor.langs);
        if (TrumbowygEditor_1.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor_1.langs;
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
        tidy_1.TrumbowygTidyPlugin.init(jQuery.trumbowyg, lang, this.http);
        font_size_1.TrumbowygFontSizePlugin.init(jQuery.trumbowyg, lang);
        fonts_1.TrumbowygFontsPlugin.init(jQuery.trumbowyg, lang);
        insert_lead_1.TrumbowygInsertLeadPlugin.init(jQuery.trumbowyg, lang);
        select_styles_1.TrumbowygSelectStylesPlugin.init(jQuery.trumbowyg, lang);
        insert_table_1.TrumbowygInsertTablePlugin.init(jQuery.trumbowyg, lang);
        insert_media_embed_1.TrumbowygInsertMediaEmbedPlugin.init(jQuery.trumbowyg, lang);
        select_images_1.TrumbowygSelectImagesPlugin.init(jQuery.trumbowyg, lang);
        select_resources_1.TrumbowygSelectResourcesPlugin.init(jQuery.trumbowyg, lang);
        select_templates_1.TrumbowygSelectTemplatesPlugin.init(jQuery.trumbowyg, lang);
        //console.trace();
        //console.log('init', jQuery.trumbowyg);
        TrumbowygEditor_1.modes = {
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
    };
    TrumbowygEditor.prototype.ngOnChanges = function (changes) {
        if (this.base64Image) {
            //console.log('ngOnChanges base64Image', this.base64Image);
            var el = jQuery('<div>' + this.element.trumbowyg('html') + '</div>');
            el.find('#' + this.base64Image.uid).attr('src', this.base64Image.file);
            this.base64Image = null;
            this.element.trumbowyg('html', el.html());
        }
    };
    TrumbowygEditor.prototype.detectBase64Insert = function (html) {
        var _this = this;
        //console.log('detectBase64Insert', html);
        if (TrumbowygEditor_1.localImageRegexp.test(html)) {
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
            images.forEach(function (image) {
                _this.base64ImageInserted.emit(image);
            });
            return true;
        }
        return false;
    };
    TrumbowygEditor.prototype.ngOnInit = function () {
        var _this = this;
        //console.log('TrumbowygEditor ngOnInit');
        //console.log('TrumbowygEditor langs', TrumbowygEditor.langs);
        this.lang = this.lang || 'en';
        this.init(this.lang);
        this.onInit.emit();
        this.mode = this.mode || 'simple';
        this.element = jQuery(this.el.nativeElement);
        var tmpBtns = TrumbowygEditor_1.modes[this.mode];
        this.addBtns = this.addBtns || null;
        var addElement = 0;
        if (this.mode == 'extend' || this.mode == 'full') {
            if (!document.getElementById(LEGACY_BOOTSTRAP_ID)) {
                var linkContainer = document.createElement("LINK");
                this.render.setAttribute(linkContainer, 'id', LEGACY_BOOTSTRAP_ID);
                this.render.setAttribute(linkContainer, 'rel', 'stylesheet');
                this.render.setAttribute(linkContainer, 'href', '/node_modules/ng2-trumbowyg/assets/modified-bootstrap.css');
                document.body.appendChild(linkContainer);
            }
        }
        if (this.addBtns && this.mode == 'extend') {
            console.log('TrumbowygEditor addBtns', this.addBtns);
            this.addBtns.forEach(function (value) {
                if (value == 'selectStyles') {
                    var elemIndex = TrumbowygEditor_1.modes['full'].indexOf(value);
                    tmpBtns.splice(elemIndex, 0, value);
                    addElement++;
                }
                if (value == 'selectResources') {
                    var elemIndex = TrumbowygEditor_1.modes['full'].indexOf(value);
                    var countPreviousElements = 1;
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
            .on('tbwpaste', function () {
            var html = _this.element.trumbowyg('html');
            //console.log('tbwpaste', html);
            if (!_this.detectBase64Insert(html)) {
                _this.propagateChange(html);
                _this.onChange(html);
            }
            //console.log('tbwpaste', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwchange', function () {
            var html = _this.element.trumbowyg('html');
            //console.log('tbwchange', html);
            if (!_this.detectBase64Insert(html)) {
                _this.propagateChange(html);
                _this.onChange(html);
            }
            //console.log('tbwchange', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwinit', function (e) {
            var t = _this.element.data('trumbowyg');
            // console.log('tbwinit', e, t, this.element);
            if (t) {
                t.$box.addClass('trumbowyg-' + _this.mode);
                t.$ed.addClass('page-container');
                t.$ed.addClass('legacy-bootstrap');
                // console.log('tbwinit', e, t, t.$ed, t.$box);
                if (t.$box.width() >= 1200) {
                    t.$ed.addClass('bordered');
                }
            }
        });
        setTimeout(function () {
            // console.log('hasAutoSave', this.hasAutoSave);
            if (_this.hasAutoSave) {
                _this._checkAutoSave();
            }
        }, 500);
    };
    TrumbowygEditor.prototype.ngOnDestroy = function () {
        this.element.trumbowyg('destroy');
    };
    return TrumbowygEditor;
}());
TrumbowygEditor.modes = {};
TrumbowygEditor.langs = {};
TrumbowygEditor.inited = false;
TrumbowygEditor.localImageRegexp = /src\=\"data\:image\/(.*)\"/gi;
__decorate([
    core_1.Input('has-auto-save'),
    __metadata("design:type", Boolean)
], TrumbowygEditor.prototype, "hasAutoSave", void 0);
__decorate([
    core_1.Input('auto-save-key'),
    __metadata("design:type", String)
], TrumbowygEditor.prototype, "autoSaveKey", void 0);
__decorate([
    core_1.Input('last-update'),
    __metadata("design:type", Number)
], TrumbowygEditor.prototype, "lastUpdate", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TrumbowygEditor.prototype, "addBtns", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TrumbowygEditor.prototype, "mode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TrumbowygEditor.prototype, "lang", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TrumbowygEditor.prototype, "base64Image", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TrumbowygEditor.prototype, "base64ImageInserted", void 0);
TrumbowygEditor = TrumbowygEditor_1 = __decorate([
    core_1.Directive({
        selector: '[trumbowyg-editor]',
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return TrumbowygEditor_1; }),
                multi: true
            },
            {
                provide: forms_1.NG_VALIDATORS,
                useExisting: core_1.forwardRef(function () { return TrumbowygEditor_1; }),
                multi: true
            }
        ]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.Renderer2,
        http_1.Http])
], TrumbowygEditor);
exports.TrumbowygEditor = TrumbowygEditor;
var TrumbowygEditor_1;
