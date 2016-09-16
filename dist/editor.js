System.register(['@angular/core', './codemirror', './font-size', './fonts', './insert-lead', './insert-media-embed', './insert-table', './select-images', './select-resources', './select-templates', './select-styles'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, codemirror_1, font_size_1, fonts_1, insert_lead_1, insert_media_embed_1, insert_table_1, select_images_1, select_resources_1, select_templates_1, select_styles_1;
    var TrumbowygEditor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (codemirror_1_1) {
                codemirror_1 = codemirror_1_1;
            },
            function (font_size_1_1) {
                font_size_1 = font_size_1_1;
            },
            function (fonts_1_1) {
                fonts_1 = fonts_1_1;
            },
            function (insert_lead_1_1) {
                insert_lead_1 = insert_lead_1_1;
            },
            function (insert_media_embed_1_1) {
                insert_media_embed_1 = insert_media_embed_1_1;
            },
            function (insert_table_1_1) {
                insert_table_1 = insert_table_1_1;
            },
            function (select_images_1_1) {
                select_images_1 = select_images_1_1;
            },
            function (select_resources_1_1) {
                select_resources_1 = select_resources_1_1;
            },
            function (select_templates_1_1) {
                select_templates_1 = select_templates_1_1;
            },
            function (select_styles_1_1) {
                select_styles_1 = select_styles_1_1;
            }],
        execute: function() {
            TrumbowygEditor = (function () {
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
                    codemirror_1.TrumbowygCodemirrorPlugin.init(jQuery.trumbowyg, lang);
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
                TrumbowygEditor.prototype.ngOnChanges = function () {
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
                            this.element.trumbowyg('html', this.ngModel);
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
                        tablet: true
                    })
                        .on('tbwpaste', function () {
                        var html = self.element.trumbowyg('html');
                        //console.log('tbwpaste', html);
                        if (!self.detectBase64Insert(html)) {
                            self.dirty = true;
                            self.ngModelChange.emit(html);
                        }
                        //console.log('tbwpaste', html);
                        //console.log('self.ngModelChange', self.ngModelChange);
                    })
                        .on('tbwchange', function () {
                        var html = self.element.trumbowyg('html');
                        //console.log('tbwchange', html);
                        if (!self.detectBase64Insert(html)) {
                            self.dirty = true;
                            self.ngModelChange.emit(html);
                        }
                        //console.log('tbwchange', html);
                        //console.log('self.ngModelChange', self.ngModelChange);
                    });
                    if ((/webkit/i).test(navigator.userAgent)) {
                        jQuery('.trumbowyg-editor', this.element.parent()).on('keyup', function (e) {
                            if (e.keyCode == 13) {
                                if (window.getSelection) {
                                    var selection = window.getSelection(), range = selection.getRangeAt(0);
                                    jQuery(range.endContainer).attr('class', '');
                                }
                            }
                        });
                    }
                };
                TrumbowygEditor.prototype.ngOnDestroy = function () {
                    this.element.trumbowyg('destroy');
                };
                TrumbowygEditor.modes = {};
                TrumbowygEditor.langs = {};
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
            exports_1("TrumbowygEditor", TrumbowygEditor);
        }
    }
});
//# sourceMappingURL=editor.js.map