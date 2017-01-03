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
var core_1 = require('@angular/core');
var tidy_1 = require('./tidy');
var font_size_1 = require('./font-size');
var fonts_1 = require('./fonts');
var insert_lead_1 = require('./insert-lead');
var insert_media_embed_1 = require('./insert-media-embed');
var insert_table_1 = require('./insert-table');
var select_images_1 = require('./select-images');
var select_resources_1 = require('./select-resources');
var select_templates_1 = require('./select-templates');
var select_styles_1 = require('./select-styles');
var TrumbowygEditor = (function () {
    function TrumbowygEditor(el) {
        this.el = el;
        this.ngModelChange = new core_1.EventEmitter();
        this.base64ImageInserted = new core_1.EventEmitter();
        this.onInit = new core_1.EventEmitter();
        this.dirty = false;
    }
    TrumbowygEditor.init = function (lang) {
        TrumbowygEditor.inited = true;
        if (TrumbowygEditor.langs) {
            jQuery.trumbowyg.langs = TrumbowygEditor.langs;
        }
        jQuery.trumbowyg.svgPath = '/bower_components/trumbowyg/dist/ui/icons.svg';
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
        };
        var btnsGrps = {
            design: ['bold', 'italic', 'underline', 'strikethrough'],
            semantic: ['strong', 'em', 'del'],
            justify: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            lists: ['unorderedList', 'orderedList']
        };
        tidy_1.TrumbowygTidyPlugin.init(jQuery.trumbowyg, lang);
        font_size_1.TrumbowygFontSizePlugin.init(jQuery.trumbowyg, lang);
        fonts_1.TrumbowygFontsPlugin.init(jQuery.trumbowyg, lang);
        insert_lead_1.TrumbowygInsertLeadPlugin.init(jQuery.trumbowyg, lang);
        insert_table_1.TrumbowygInsertTablePlugin.init(jQuery.trumbowyg, lang);
        insert_media_embed_1.TrumbowygInsertMediaEmbedPlugin.init(jQuery.trumbowyg, lang);
        select_images_1.TrumbowygSelectImagesPlugin.init(jQuery.trumbowyg, lang);
        select_resources_1.TrumbowygSelectResourcesPlugin.init(jQuery.trumbowyg, lang);
        select_templates_1.TrumbowygSelectTemplatesPlugin.init(jQuery.trumbowyg, lang);
        select_styles_1.TrumbowygSelectStylesPlugin.init(jQuery.trumbowyg, lang);
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
    };
    TrumbowygEditor.prototype.ngOnChanges = function (changes) {
        if (this.base64Image) {
            //console.log('ngOnChanges base64Image', this.base64Image);
            var el = jQuery('<div>' + this.element.trumbowyg('html') + '</div>');
            el.find('#' + this.base64Image.uid).attr('src', this.base64Image.file);
            this.base64Image = null;
            this.element.trumbowyg('html', el.html());
        }
        //console.log('ngOnChanges ngModel', this.dirty);
        if (this.ngModel && this.element) {
            if (this.dirty) {
            }
            else {
                if (this.ngModel.length == 0 && (/webkit/i).test(navigator.userAgent)) {
                    this.element.trumbowyg('html', '<p></p>');
                }
                else {
                    this.element.trumbowyg('html', this.ngModel);
                }
            }
        }
    };
    TrumbowygEditor.prototype.detectBase64Insert = function (html) {
        var _this = this;
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
            .on('tbwpaste', function () {
            var html = _this.element.trumbowyg('html');
            //console.log('tbwpaste', html);
            if (!_this.detectBase64Insert(html)) {
                _this.dirty = true;
                _this.ngModelChange.emit(html);
            }
            //console.log('tbwpaste', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwchange', function () {
            var html = _this.element.trumbowyg('html');
            //console.log('tbwchange', html);
            if (!_this.detectBase64Insert(html)) {
                _this.dirty = true;
                _this.ngModelChange.emit(html);
            }
            //console.log('tbwchange', html);
            //console.log('self.ngModelChange', self.ngModelChange);
        })
            .on('tbwinit', function (e) {
            var t = _this.element.data('trumbowyg');
            t.$box.addClass('trumbowyg-' + _this.mode);
            t.$ed.addClass('page-container');
            // console.log('tbwinit', e, t, t.$ed, t.$box);
            if (t.$box.width() >= 1200) {
                t.$ed.addClass('bordered');
            }
        });
    };
    TrumbowygEditor.prototype.ngOnDestroy = function () {
        this.element.trumbowyg('destroy');
    };
    TrumbowygEditor.modes = {};
    TrumbowygEditor.langs = {};
    TrumbowygEditor.tidyUrl = '';
    TrumbowygEditor.inited = false;
    TrumbowygEditor.localImageRegexp = /src\=\"data\:image\/(.*)\"/gi;
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TrumbowygEditor.prototype, "mode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TrumbowygEditor.prototype, "lang", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TrumbowygEditor.prototype, "base64Image", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TrumbowygEditor.prototype, "ngModel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TrumbowygEditor.prototype, "ngModelChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TrumbowygEditor.prototype, "base64ImageInserted", void 0);
    TrumbowygEditor = __decorate([
        core_1.Directive({
            selector: '[trumbowyg-editor]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], TrumbowygEditor);
    return TrumbowygEditor;
}());
exports.TrumbowygEditor = TrumbowygEditor;
