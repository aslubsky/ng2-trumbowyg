(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ng2-trumbowyg', ['exports', '@angular/core', '@angular/common/http', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng2-trumbowyg'] = {}, global.ng.core, global.ng.common.http, global.ng.forms));
}(this, (function (exports, i0, i1, forms) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);

    var TrumbowygTidyPlugin = /** @class */ (function () {
        function TrumbowygTidyPlugin() {
        }
        TrumbowygTidyPlugin.init = function (editor, lang, http) {
            TrumbowygTidyPlugin.editor = editor;
            editor.plugins.tidy = {
                init: function (t) {
                    // console.log('TrumbowygCodemirrorPlugin');
                    t.toggle = function () {
                        var prefix = t.o.prefix;
                        t.semanticCode(false, true);
                        setTimeout(function () {
                            t.doc.activeElement.blur();
                            t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                            t.$btnPane.toggleClass(prefix + 'disable');
                            t.$btnPane.find('.' + prefix + 'viewHTML-button').toggleClass(prefix + 'active');
                            if (t.$box.hasClass(prefix + 'editor-visible')) {
                                t.$ta.attr('tabindex', -1);
                            }
                            else {
                                if (TrumbowygTidyPlugin.editor.tidyUrl) {
                                    // console.log(t.$ed.html());
                                    http.post(TrumbowygTidyPlugin.editor.tidyUrl, t.$ed.html(), {
                                        responseType: 'text'
                                    })
                                        .toPromise()
                                        .then(function (res) {
                                        // console.log('tidy res', res.text());
                                        t.$ta.val(res);
                                    });
                                }
                                t.$ta.removeAttr('tabindex');
                            }
                        }, 0);
                    };
                }
            };
        };
        return TrumbowygTidyPlugin;
    }());

    var TrumbowygFontSizePlugin = /** @class */ (function () {
        function TrumbowygFontSizePlugin() {
        }
        TrumbowygFontSizePlugin.init = function (editor, lang) {
            TrumbowygFontSizePlugin.editor = editor;
            TrumbowygFontSizePlugin.fontSizes = [];
            var i = 1;
            for (; i <= 7; i++) {
                //jQuery.trumbowyg.opts.fontSize.push($filter('translate')("Размер") + ' ' + i);
                TrumbowygFontSizePlugin.fontSizes.push(editor.langs[lang]['fontSize' + i]);
            }
            // Add all fonts in two dropdowns
            editor.plugins.fontSize = {
                init: function (trumbowyg) {
                    // console.log('fontSize init');
                    // trumbowyg.o.plugins.fontSize = trumbowyg.o.plugins.fontSize || {};
                    trumbowyg.addBtnDef('fontSize', {
                        dropdown: TrumbowygFontSizePlugin.buildDropdown('fontSize', trumbowyg)
                    });
                }
            };
        };
        TrumbowygFontSizePlugin.buildDropdown = function (func, trumbowyg) {
            var dropdown = [];
            TrumbowygFontSizePlugin.fontSizes.forEach(function (size, i) {
                var btn = func + '_' + i;
                trumbowyg.addBtnDef(btn, {
                    fn: function (param, t) {
                        //console.info(param, t);
                        document.execCommand('fontSize', false, param);
                        t.syncCode();
                    },
                    text: size,
                    param: i + 1
                });
                dropdown.push(btn);
            });
            return dropdown;
        };
        return TrumbowygFontSizePlugin;
    }());
    TrumbowygFontSizePlugin.fontSizes = [];

    var TrumbowygFontsPlugin = /** @class */ (function () {
        function TrumbowygFontsPlugin() {
        }
        TrumbowygFontsPlugin.init = function (editor, lang) {
            TrumbowygFontsPlugin.editor = editor;
            // Set default fonts
            TrumbowygFontsPlugin.fonts = [
                "Arial",
                "Courier",
                "Courier New",
                "Georgia",
                "Helvetica",
                "Impact",
                "Monospace",
                "Sans-serif",
                "Serif",
                "Tahoma",
                "Times New Roman",
                "Trebuchet MS",
                "Verdana"
            ];
            // Add all fonts in two dropdowns
            editor.plugins.fontName = {
                init: function (trumbowyg) {
                    // console.log('fontName trumbowyg', trumbowyg);
                    trumbowyg.o.plugins.fontName = trumbowyg.o.plugins.fontName || {};
                    trumbowyg.addBtnDef('fontName', {
                        dropdown: TrumbowygFontsPlugin.buildDropdown('fontName', trumbowyg)
                    });
                }
            };
        };
        TrumbowygFontsPlugin.buildDropdown = function (func, trumbowyg) {
            var dropdown = [];
            TrumbowygFontsPlugin.fonts.forEach(function (font, i) {
                // console.info('TrumbowygFontsPlugin', font, i);
                var fontAlias = font.toLowerCase().replace(' ', '').replace('-', '');
                var btn = func + '_' + fontAlias;
                trumbowyg.addBtnDef(btn, {
                    fn: function (param, t) {
                        // console.info(param, t);
                        document.execCommand('fontName', false, param);
                        t.syncCode();
                    },
                    text: font,
                    param: font
                });
                dropdown.push(btn);
            });
            return dropdown;
        };
        return TrumbowygFontsPlugin;
    }());

    var TrumbowygSelectStylesPlugin = /** @class */ (function () {
        function TrumbowygSelectStylesPlugin() {
        }
        TrumbowygSelectStylesPlugin.init = function (editor, lang) {
            TrumbowygSelectStylesPlugin.editor = editor;
            TrumbowygSelectStylesPlugin.lang = lang;
            editor.plugins.selectStyles = {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.selectStyles = trumbowyg.o.plugins.selectStyles || {};
                    trumbowyg.addBtnDef('selectStyles', {
                        fn: function (params) {
                            TrumbowygSelectStylesPlugin.selectStylesCb(params, trumbowyg);
                        }
                    });
                },
                tag: 'img'
            };
        };
        TrumbowygSelectStylesPlugin.selectStylesCb = function (params, t) {
            var pfx = t.o.prefix;
            var html = [];
            html.push('<div class="modal-container styles-select">');
            html.push('   <ul class="styles-list template-gallery list-unstyled">');
            TrumbowygSelectStylesPlugin.allStyles.forEach(function (style) {
                html.push('   <li title="' + style.description + '" class="item style"><label>' +
                    '<img src="' + style.icon + '" class="select-template-icon"><input type="radio" value="' + style.id + '" name="template">' +
                    '<span class="title"> ' + style.title + '</span>' +
                    '</label></li>');
            });
            html.push('   </ul>');
            html.push('</div>');
            var selectedImageIndex = null;
            var $modal = t.openModal(TrumbowygSelectStylesPlugin.editor.langs[TrumbowygSelectStylesPlugin.lang].selectTemplatesStyle, html.join(''))
                .on('tbwconfirm', function () {
                var selected = jQuery('input:checked', $modal);
                if (selected.length > 0) {
                    var styleId = parseInt(selected.val(), 10);
                    // console.log('styleId', styleId);
                    var editor = $modal.parent().find('.trumbowyg-editor');
                    editor.find('.customStyle').remove();
                    editor.append('<style class="customStyle">@import url(https://ets.davintoo.com/uploads/css/' + styleId + '.css);</style>');
                    t.syncTextarea();
                    t.$c.trigger('tbwchange');
                }
                setTimeout(function () {
                    t.closeModal();
                }, 250);
            })
                .on('tbwcancel', function () {
                t.restoreRange();
                t.closeModal();
            });
            $modal.addClass('big');
            jQuery('.styles-list li label', $modal).off('click').on('click', function (e) {
                jQuery('.styles-list li', $modal).removeClass('active');
                jQuery(this).parent().addClass('active');
            });
        };
        ;
        TrumbowygSelectStylesPlugin.setStyles = function (allStyles) {
            TrumbowygSelectStylesPlugin.allStyles = allStyles;
        };
        return TrumbowygSelectStylesPlugin;
    }());
    TrumbowygSelectStylesPlugin.allStyles = [];

    var TrumbowygInsertLeadPlugin = /** @class */ (function () {
        function TrumbowygInsertLeadPlugin() {
        }
        TrumbowygInsertLeadPlugin.init = function (editor, lang) {
            TrumbowygInsertLeadPlugin.editor = editor;
            editor.plugins.lead = {
                init: function (trumbowyg) {
                    // console.log('lead addBtnDef');
                    trumbowyg.addBtnDef('lead', {
                        fn: function () {
                            var documentSelection = trumbowyg.doc.getSelection();
                            if (documentSelection.rangeCount) {
                                var range = documentSelection.getRangeAt(0).cloneRange();
                                range.surroundContents(jQuery('<p class="lead"/>').get(0));
                                documentSelection.removeAllRanges();
                                documentSelection.addRange(range);
                            }
                            trumbowyg.syncCode();
                            trumbowyg.updateButtonPaneStatus();
                            trumbowyg.$c.trigger('tbwchange');
                        }
                    });
                    trumbowyg.btnsDef.formatting.dropdown = ['p', 'blockquote', 'lead', 'h1', 'h2', 'h3', 'h4'];
                }
            };
        };
        return TrumbowygInsertLeadPlugin;
    }());

    var TrumbowygInsertMediaEmbedPlugin = /** @class */ (function () {
        function TrumbowygInsertMediaEmbedPlugin() {
        }
        TrumbowygInsertMediaEmbedPlugin.init = function (editor, lang) {
            TrumbowygInsertMediaEmbedPlugin.editor = editor;
            editor.plugins.insertMediaEmbed = {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.insertMediaEmbed = trumbowyg.o.plugins.insertMediaEmbed || {};
                    trumbowyg.addBtnDef('insertMediaEmbed', {
                        fn: function (params, t) {
                            //console.log('insertMediaEmbed');
                            var t = trumbowyg;
                            var html = [];
                            html.push('<div class="modal-container">');
                            html.push('<div class="modal-meadia-embed">');
                            html.push('<textarea></textarea>');
                            html.push('</div>');
                            html.push('</div>');
                            console.log('insertMediaEmbed');
                            var $modal = t.openModal('Embed Code', html.join(''))
                                .on('tbwconfirm', function () {
                                t.restoreRange();
                                t.syncCode();
                                var code = jQuery('textarea', $modal).val();
                                if (code) {
                                    TrumbowygInsertMediaEmbedPlugin.editor.insertHtml(t, code);
                                }
                                setTimeout(function () {
                                    t.closeModal();
                                }, 250);
                            })
                                .on('tbwcancel', function () {
                                t.restoreRange();
                                t.closeModal();
                            });
                        }
                    });
                }
            };
        };
        return TrumbowygInsertMediaEmbedPlugin;
    }());

    var TrumbowygInsertTablePlugin = /** @class */ (function () {
        function TrumbowygInsertTablePlugin() {
        }
        TrumbowygInsertTablePlugin.init = function (editor, lang) {
            TrumbowygInsertTablePlugin.editor = editor;
            editor.plugins.insertTable = {
                init: function (trumbowyg) {
                    // console.log('trumbowyg', trumbowyg);
                    trumbowyg.o.plugins.insertTable = trumbowyg.o.plugins.insertTable || {};
                    trumbowyg.addBtnDef('insertTable', {
                        dropdown: TrumbowygInsertTablePlugin.buildDropdown('insertTable', trumbowyg),
                        tag: 'table'
                    });
                    setTimeout(function () {
                        var i = 1;
                        var j = 1;
                        for (; i <= 10; i++) {
                            for (j = 1; j <= 10; j++) {
                                TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j] = trumbowyg.$box.find('.trumbowyg-insertTable_r' + i + '_c' + j + '_insertTable-dropdown-button');
                            }
                        }
                        trumbowyg.$box.find('.trumbowyg-insertTable-button')
                            .off('click')
                            .on('click', function () {
                            jQuery('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button').removeClass('active');
                        });
                        trumbowyg.$box.find('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button')
                            .off('mouseenter mouseleave')
                            // .on('hover', (e: any) => {
                            .hover(function (e) {
                            //console.log(e.target.classList);
                            //$(e.target).attr('class').split('_')
                            var tmp = jQuery(e.target).attr('class').split('_');
                            var r = parseInt(tmp[1].replace('r', ''), 10);
                            var c = parseInt(tmp[2].replace('c', ''), 10);
                            // console.log('i', tmp, r, c);
                            TrumbowygInsertTablePlugin.fillCells(r, c);
                            //console.log($(e.target).attr('class').split('_'));
                        }, function (e) {
                            // console.log(e);
                            var tmp = jQuery(e.target).attr('class').split('_');
                            var r = parseInt(tmp[1].replace('r', ''), 10);
                            var c = parseInt(tmp[2].replace('c', ''), 10);
                            // console.log('o', tmp, r, c);
                            TrumbowygInsertTablePlugin.fillCells(r, c);
                        });
                    }, 1000);
                },
                //tagHandler: colorTagHandler
            };
        };
        TrumbowygInsertTablePlugin.buildTable = function (r, c) {
            var html = [];
            html.push('<table border="1" width="100%">');
            var i = 1;
            var j = 1;
            for (; i <= r; i++) {
                html.push('<tr>');
                for (j = 1; j <= c; j++) {
                    html.push('<td>&nbsp;</td>');
                }
                html.push('</tr>');
            }
            html.push('</table>');
            return html;
        };
        TrumbowygInsertTablePlugin.fillCells = function (r, c) {
            jQuery('.trumbowyg-dropdown-insertTable.trumbowyg-dropdown button').removeClass('active');
            var i = 1;
            var j = 1;
            for (; i <= r; i++) {
                for (j = 1; j <= c; j++) {
                    // console.log(TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j]);
                    TrumbowygInsertTablePlugin.elementsCache['r' + i + '_c' + j].addClass('active');
                }
            }
        };
        TrumbowygInsertTablePlugin.buildDropdown = function (func, trumbowyg) {
            var dropdown = [];
            var i = 1;
            var j = 1;
            for (; i <= 10; i++) {
                for (j = 1; j <= 10; j++) {
                    var btn = 'insertTable_r' + i + '_c' + j + '_' + func;
                    // trumbowyg.addBtnDef()
                    // console.log('trumbowyg', trumbowyg);
                    trumbowyg.addBtnDef(btn, {
                        forceCss: true,
                        fn: function (params) {
                            var html = TrumbowygInsertTablePlugin.buildTable(params.r, params.c).join('');
                            // console.info('HTML', params, t, buildTable(params.r, params.c).join(''), html);
                            trumbowyg.restoreRange();
                            trumbowyg.syncCode();
                            TrumbowygInsertTablePlugin.editor.insertHtml(trumbowyg, html);
                        },
                        text: ' ',
                        param: {
                            r: i,
                            c: j
                        }
                    });
                    dropdown.push(btn);
                }
            }
            return dropdown;
        };
        return TrumbowygInsertTablePlugin;
    }());
    TrumbowygInsertTablePlugin.elementsCache = {};

    var TrumbowygSelectImagesPlugin = /** @class */ (function () {
        function TrumbowygSelectImagesPlugin() {
        }
        TrumbowygSelectImagesPlugin.init = function (editor, lang) {
            TrumbowygSelectImagesPlugin.editor = editor;
            TrumbowygSelectImagesPlugin.lang = lang;
            // console.log('TrumbowygSelectImagesPlugin init', editor);
            editor.plugins.selectImage = {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.selectImage = trumbowyg.o.plugins.selectImage || {};
                    // console.log('selectImage trumbowyg', trumbowyg);
                    trumbowyg.addBtnDef('selectImage', {
                        fn: function (params) {
                            // console.log('selectImageCb', params, trumbowyg, editorImages);
                            TrumbowygSelectImagesPlugin.selectImageCb(params, trumbowyg, TrumbowygSelectImagesPlugin.editorImages);
                        }
                    });
                },
                tag: 'img'
            };
        };
        TrumbowygSelectImagesPlugin.selectImageCb = function (params, t, editorImages) {
            var pfx = t.o.prefix;
            var i = 0, l = editorImages.length;
            if (l == 0) {
                return;
            }
            var html = [];
            var file = null;
            html.push('<div class="modal-container">');
            html.push('<ul class="' + pfx + 'select-images gallery">');
            for (; i < l; i++) {
                html.push('<li class="item" data-i="' + i + '"><label>' +
                    '<img width="50px" src="' + editorImages[i].url + '"/>' + //editorImages[i].name +
                    '</label></li>');
            }
            html.push('</ul>');
            html.push('</div>');
            var selectedImageIndex = null;
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
        ;
        TrumbowygSelectImagesPlugin.updateImages = function (files) {
            TrumbowygSelectImagesPlugin.editorImages = [];
            files.forEach(function (img) {
                img.extension = img.extension || img.url.split('.').pop();
                if (TrumbowygSelectImagesPlugin.imagesExtensions.indexOf(img.extension) != -1) {
                    // if (img.url.substring(0, 8) != '/uploads') {
                    // img.url = '/uploads' + img.url;
                    // }
                    if (!img.width) {
                        var imgObj = new Image();
                        imgObj.setAttribute('data-i', TrumbowygSelectImagesPlugin.editorImages.length + '');
                        imgObj.onload = function (e) {
                            if (e.type !== 'error' && this.width) {
                                var indx = parseInt(this.getAttribute('data-i'));
                                TrumbowygSelectImagesPlugin.editorImages[indx].width = this.width;
                            }
                        };
                        imgObj.src = img.url;
                        img.width = 1024;
                    }
                    TrumbowygSelectImagesPlugin.editorImages.push(img);
                }
            });
        };
        return TrumbowygSelectImagesPlugin;
    }());
    TrumbowygSelectImagesPlugin.editorImages = [];
    TrumbowygSelectImagesPlugin.imagesExtensions = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'svg'];

    var TrumbowygSelectResourcesPlugin = /** @class */ (function () {
        function TrumbowygSelectResourcesPlugin() {
        }
        TrumbowygSelectResourcesPlugin.init = function (editor, lang) {
            TrumbowygSelectResourcesPlugin.editor = editor;
            TrumbowygSelectResourcesPlugin.lang = lang;
            // TrumbowygSelectResourcesPlugin.onSearch = new EventEmitter();
            editor.plugins.selectResources = {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.selectResources = trumbowyg.o.plugins.selectResources || {};
                    trumbowyg.addBtnDef('selectResources', {
                        fn: function (params) {
                            // console.log('selectImageCb', params, trumbowyg, editorImages);
                            TrumbowygSelectResourcesPlugin.selectResourcesCb(params, trumbowyg);
                        }
                    });
                },
                tag: 'img'
            };
        };
        TrumbowygSelectResourcesPlugin.translate = function (str) {
            return TrumbowygSelectResourcesPlugin.editor.langs[TrumbowygSelectResourcesPlugin.lang][str];
        };
        TrumbowygSelectResourcesPlugin.renderList = function (pfx, html, items) {
            items.forEach(function (resource) {
                // console.log('resource', resource);
                html.push('<li class="item">');
                html.push('<label>');
                html.push('<input type="radio" name="r' + pfx + '" data-id="' + resource.id + '" ' +
                    'title="' + resource.title + '" data-type="' + resource.display_type + '" value="' + resource.id + '"/>');
                html.push('<strong>' + resource.title + '</strong>');
                if (resource.description && resource.description.length > 0) {
                    html.push('<br/><i>' + resource.description + '</i>');
                }
                html.push('</label>');
                html.push('</li>');
            });
        };
        TrumbowygSelectResourcesPlugin.selectResourcesCb = function (params, t) {
            var pfx = TrumbowygSelectResourcesPlugin.pfx = t.o.prefix;
            //console.log('editorResources', editorResources);
            var html = [];
            html.push('<div class="resources-select modal-container">');
            html.push('<div class="resources-search cbr-input-control">');
            html.push('<label for="text" class="cbr-label">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesSearch') + '</label>');
            html.push('<input class="cbr-input cbr-input-default cbr-input-email" type="text">');
            html.push('<span class="cbr-icon-input cbr-icon-input-primary">');
            html.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"');
            html.push('width="20" height="20" viewBox="0 0 451 451" style="enable-background:new 0 0 451 451;" xml:space="preserve">');
            html.push('<g>');
            html.push('<path d="M447.05,428l-109.6-109.6c29.4-33.8,47.2-77.9,47.2-126.1C384.65,86.2,298.35,0,192.35,0C86.25,0,0.05,86.3,0.05,192.3');
            html.push('s86.3,192.3,192.3,192.3c48.2,0,92.3-17.8,126.1-47.2L428.05,447c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4');
            html.push('C452.25,441.8,452.25,433.2,447.05,428z M26.95,192.3c0-91.2,74.2-165.3,165.3-165.3c91.2,0,165.3,74.2,165.3,165.3');
            html.push('s-74.1,165.4-165.3,165.4C101.15,357.7,26.95,283.5,26.95,192.3z"/>');
            html.push('</g>');
            html.push('</svg>');
            html.push('</span>');
            html.push('</div>');
            html.push('<ul class="cbr2-tabs" role="tablist">');
            html.push('<li role="all" class="cbr2-tabs-itemactive">');
            html.push('   <a data-type="all"  role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesAll') + '</a>');
            html.push('</li>');
            html.push('<li role="gallery" class="cbr2-tabs-item">');
            html.push('   <a data-type="gallery" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesGallery') + '</a>');
            html.push('</li>');
            html.push('<li role="html" class="cbr2-tabs-item">');
            html.push('   <a data-type="html" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesHtmlSite') + '</a>');
            html.push('</li>');
            html.push('<li role="video" class="cbr2-tabs-item">');
            html.push('   <a data-type="video" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesVideo') + '</a>');
            html.push('</li>');
            html.push('<li role="audio" class="cbr2-tabs-item">');
            html.push('   <a data-type="audio" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesAudio') + '</a>');
            html.push('</li>');
            html.push('</ul>');
            html.push('<div class="cbr-tab-content">');
            html.push('   <div role="tabpanel" class="cbr-tab-pane active">');
            html.push('   <ul class="resources-list list-unstyled">');
            TrumbowygSelectResourcesPlugin.renderList(pfx, html, TrumbowygSelectResourcesPlugin.editorResources);
            html.push('   </ul>');
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            //console.log('html', html);
            var $modal = TrumbowygSelectResourcesPlugin.$modal = t.openModal(TrumbowygSelectResourcesPlugin.translate('selectResourcesHeader'), html.join(''))
                .on('tbwconfirm', function () {
                var selected = jQuery('input:checked', $modal);
                console.log('selected', selected);
                var val = selected.val();
                //var i = parseInt(selected.data('i'), 10);
                var type = selected.data('type');
                t.restoreRange();
                t.syncCode();
                if (val) {
                    if (type === 'mp4') {
                        type = 'video';
                    }
                    if (type === 'mp3' || type === 'acc') {
                        type = 'audio';
                    }
                    switch (type) {
                        case 'gallery':
                            // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            //     'data-item-id="' + val + '" data-type="gallery" data-ext="' + type + '" data-gallery-src="' + val + '"' +
                            //     'src="/themes/default/assets/img/inline-gallery.png" />');
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" allowfullscreen width="100%" height="640px" frameborder="0" ' +
                                'src="/node_modules/collaborator-gallery/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                                'class="no-border embed-responsive-item"></iframe>');
                            break;
                        case 'video':
                            // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            //     'data-item-id="' + val + '" data-type="video" data-ext="' + type + '" data-video-src="' + val + '"' +
                            //     'src="/themes/default/assets/img/inline-video.png" />');
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" allowfullscreen width="100%" height="480px" frameborder="0" ' +
                                'src="/node_modules/collaborator-video-player/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                                'class="no-border embed-responsive-item"></iframe>');
                            break;
                        case 'audio':
                            // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            //     'data-item-id="' + val + '" data-type="audio" data-ext="' + type + '" data-src="' + val + '"' +
                            //     'src="/themes/default/assets/img/inline-audio.png" />');
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" allowfullscreen width="100%" height="65px" frameborder="0" ' +
                                'src="/node_modules/collaborator-audio-player/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                                'class="no-border embed-responsive-item"></iframe>');
                            break;
                        case 'html':
                            // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            //     'data-item-id="' + val + '" data-type="html" data-ext="' + type + '" data-src="' + val + '"' +
                            //     'src="/themes/default/assets/img/inline-resource.png" />');
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" allowfullscreen width="100%" height="640px" frameborder="0" ' +
                                'src="/node_modules/collaborator-html-player/dist/index.html?id=' + val + '" scrolling="no" marginheight="0" data-item-id="' + val + '" ' +
                                'class="no-border embed-responsive-item"></iframe>');
                            break;
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
            jQuery('.cbr2-tabs a', $modal).off('click').on('click', function (e) {
                e.preventDefault();
                jQuery('.cbr2-tabs-item', $modal).removeClass('cbr-tabs-active');
                jQuery(this).parent().addClass('cbr-tabs-active');
                TrumbowygSelectResourcesPlugin.onSearch.emit({
                    type: jQuery(this).attr('data-type') || 'all',
                    title: jQuery('.cbr-input', $modal).val()
                });
            });
            jQuery('.cbr-icon-input', $modal).off('click').on('click', function () {
                TrumbowygSelectResourcesPlugin.onSearch.emit({
                    type: jQuery(this).attr('data-type') || 'all',
                    title: jQuery('.cbr-input', $modal).val()
                });
            });
        };
        TrumbowygSelectResourcesPlugin.updateResources = function (editorResources) {
            TrumbowygSelectResourcesPlugin.editorResources = editorResources;
            //
            jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).empty();
            var lhtml = [];
            TrumbowygSelectResourcesPlugin.renderList(TrumbowygSelectResourcesPlugin.pfx, lhtml, editorResources);
            jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).append(lhtml.join(''));
        };
        return TrumbowygSelectResourcesPlugin;
    }());
    TrumbowygSelectResourcesPlugin.editorResources = [];
    TrumbowygSelectResourcesPlugin.onSearch = new i0.EventEmitter();

    // import {EventEmitter}         from '@angular/core';
    var DEFAULT_ICON = 'themes/default/assets/img/t-icon.png';
    var TrumbowygSelectTemplatesPlugin = /** @class */ (function () {
        function TrumbowygSelectTemplatesPlugin() {
        }
        TrumbowygSelectTemplatesPlugin.init = function (editor, lang) {
            TrumbowygSelectTemplatesPlugin.editor = editor;
            TrumbowygSelectTemplatesPlugin.lang = lang;
            //console.log('init', editor, editor.langs, lang, editor.langs[lang].selectTemplatesNoData);
            //TrumbowygSelectResourcesPlugin.onSearch = new EventEmitter();
            editor.plugins.selectTemplates = {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.selectTemplates = trumbowyg.o.plugins.selectTemplates || {};
                    trumbowyg.addBtnDef('selectTemplates', {
                        fn: function (params) {
                            // console.log('selectImageCb', params, trumbowyg, editorImages);
                            TrumbowygSelectTemplatesPlugin.selectTemplatesCb(params, trumbowyg);
                        }
                    });
                },
                tag: 'img'
            };
            TrumbowygSelectTemplatesPlugin.templates.push({
                id: 'tab-no-data',
                label: editor.langs[lang].selectTemplatesNoData,
                elements: []
            });
            TrumbowygSelectTemplatesPlugin.allTemplates['template-no-data'] =
                '<div>' + editor.langs[lang].selectTemplatesNoData + '</div>';
        };
        TrumbowygSelectTemplatesPlugin.selectTemplatesCb = function (params, t) {
            var pfx = t.o.prefix;
            //console.log('editorResources', editorResources);
            var html = [];
            html.push('<div class="modal-container templates-select">');
            html.push('<ul class="cbr2-tabs" role="tablist">');
            TrumbowygSelectTemplatesPlugin.templates.forEach(function (templateSet, i) {
                html.push('<li role="' + templateSet.id + '" class="cbr2-tabs-item ' + (i == 0 ? 'cbr-tabs-active' : '') + '">');
                html.push('   <a data-tab="' + templateSet.id + '"  role="tab" data-toggle="tab">' + templateSet.label + '</a>');
                html.push('</li>');
            });
            html.push('</ul>');
            html.push('<div class="cbr-tab-content">');
            TrumbowygSelectTemplatesPlugin.templates.forEach(function (templateSet, i) {
                html.push('   <div role="tabpanel" id="' + templateSet.id + '" class="cbr-tab-pane ' + (i == 0 ? 'active' : '') + '">');
                html.push('   <ul class="templates-list template-gallery list-unstyled">');
                templateSet.elements.forEach(function (template, j) {
                    template.icon = template.icon || DEFAULT_ICON;
                    html.push('   <li title="' + template.description + '" class="item"><label>' +
                        '<img src="' + template.icon + '" class="select-template-icon"><input type="radio" value="' + template.id + '" name="template">' +
                        '<span class="title"> ' + template.title + '</span>' +
                        '<span class="description"> ' + template.description + '</span>' +
                        '</label></li>');
                });
                html.push('   </ul>');
                html.push('   </div>');
            });
            html.push('</div>');
            html.push('</div>');
            //console.log('html', html);
            var $modal = t.openModal(TrumbowygSelectTemplatesPlugin.editor.langs[TrumbowygSelectTemplatesPlugin.lang].selectTemplatesHeader, html.join(''))
                .on('tbwconfirm', function () {
                var selected = jQuery('input:checked', $modal);
                var val = selected.val();
                // console.log(val, allTemplates[val]);
                // jQuery(this).off(pfx + 'confirm');
                t.restoreRange();
                t.syncCode();
                if (val) {
                    TrumbowygSelectTemplatesPlugin.editor.insertHtml(t, TrumbowygSelectTemplatesPlugin.allTemplates[val]);
                }
                setTimeout(function () {
                    t.closeModal();
                }, 250);
            })
                .on('tbwcancel', function () {
                t.restoreRange();
                t.closeModal();
            });
            $modal.addClass('big');
            jQuery('.cbr2-tabs a', $modal).off('click').on('click', function (e) {
                e.preventDefault();
                jQuery('.cbr2-tabs-item', $modal).removeClass('cbr-tabs-active');
                jQuery(this).parent().addClass('cbr-tabs-active');
                //    console.log('O_O', $(this).attr('data-tab'));
                jQuery('.cbr-tab-content .cbr-tab-pane', $modal).removeClass('active');
                jQuery('#' + jQuery(this).attr('data-tab')).addClass('active');
            });
            jQuery('.template-gallery li label', $modal).off('click').on('click', function (e) {
                //console.log('O_O', e, $(this));
                jQuery('.template-gallery li', $modal).removeClass('active');
                jQuery(this).parent().addClass('active');
            });
        };
        TrumbowygSelectTemplatesPlugin.setTemplates = function (templates, allTemplates) {
            TrumbowygSelectTemplatesPlugin.templates = templates;
            TrumbowygSelectTemplatesPlugin.allTemplates = allTemplates;
        };
        return TrumbowygSelectTemplatesPlugin;
    }());
    TrumbowygSelectTemplatesPlugin.templates = [];
    TrumbowygSelectTemplatesPlugin.allTemplates = {};

    var LEGACY_BOOTSTRAP_ID = 'legacy-bootstrap-styles';
    var TrumbowygEditor = /** @class */ (function () {
        function TrumbowygEditor(el, render, http) {
            this.el = el;
            this.render = render;
            this.http = http;
            this.hasAutoSave = false;
            this.autoSaveKey = '';
            this.lastUpdate = 0;
            this.addBtns = [];
            this._required = false;
            this.base64ImageInserted = new i0.EventEmitter();
            this.onInit = new i0.EventEmitter();
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
            var headers = new i1.HttpHeaders({
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
                .then(function (res) {
                // console.log('_autoSave res', res.json());
            });
        };
        TrumbowygEditor.prototype._checkAutoSave = function () {
            var _this = this;
            this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
                '?action=check-auto-save&key=' + this.autoSaveKey).toPromise()
                .then(function (res) {
                _this._autoSaved = res;
                // console.log('_checkAutoSave res', this._autoSaved, this.lastUpdate);
                if (_this._autoSaved && parseInt(_this._autoSaved.date, 10) > _this.lastUpdate) {
                    _this._buildAutoSaveToolbar();
                    // console.log('_hasAutoSave');
                }
            });
        };
        TrumbowygEditor.prototype._buildAutoSaveToolbar = function () {
            var _this = this;
            this.element.data('trumbowyg').$box.append('<div class="trumbowyg-auto-save">' +
                '<span class="title">' + TrumbowygEditor.langs[this.lang].hasAutoSavedMsg + '</span>' +
                '<span class="buttons">' +
                '<button type="button" class="button-sm-default">' + TrumbowygEditor.langs[this.lang].autoSaveCancel + '</button>' +
                '<button type="button" class="button-sm-success">' + TrumbowygEditor.langs[this.lang].autoSaveRestore + '</button>' +
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
            this.http.get(TrumbowygTidyPlugin.editor.autoSaveUrl +
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
                // }
            }
        };
        TrumbowygEditor.prototype.init = function (lang) {
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
            this.init(this.lang);
            this.onInit.emit();
            this.mode = this.mode || 'simple';
            this.element = jQuery(this.el.nativeElement);
            var tmpBtns = TrumbowygEditor.modes[this.mode];
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
                        var elemIndex = TrumbowygEditor.modes['full'].indexOf(value);
                        tmpBtns.splice(elemIndex, 0, value);
                        addElement++;
                    }
                    if (value == 'selectResources') {
                        var elemIndex = TrumbowygEditor.modes['full'].indexOf(value);
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
    TrumbowygEditor.ɵfac = function TrumbowygEditor_Factory(t) { return new (t || TrumbowygEditor)(i0__namespace.ɵɵdirectiveInject(i0__namespace.ElementRef), i0__namespace.ɵɵdirectiveInject(i0__namespace.Renderer2), i0__namespace.ɵɵdirectiveInject(i1__namespace.HttpClient)); };
    TrumbowygEditor.ɵdir = /*@__PURE__*/ i0__namespace.ɵɵdefineDirective({ type: TrumbowygEditor, selectors: [["", "trumbowyg-editor", ""]], inputs: { hasAutoSave: ["has-auto-save", "hasAutoSave"], autoSaveKey: ["auto-save-key", "autoSaveKey"], lastUpdate: ["last-update", "lastUpdate"], addBtns: "addBtns", mode: "mode", lang: "lang", base64Image: "base64Image" }, outputs: { base64ImageInserted: "base64ImageInserted" }, features: [i0__namespace.ɵɵProvidersFeature([
                {
                    provide: forms.NG_VALUE_ACCESSOR,
                    useExisting: i0.forwardRef(function () { return TrumbowygEditor; }),
                    multi: true
                },
                {
                    provide: forms.NG_VALIDATORS,
                    useExisting: i0.forwardRef(function () { return TrumbowygEditor; }),
                    multi: true
                }
            ]), i0__namespace.ɵɵNgOnChangesFeature] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(TrumbowygEditor, [{
                type: i0.Directive,
                args: [{
                        selector: '[trumbowyg-editor]',
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return TrumbowygEditor; }),
                                multi: true
                            },
                            {
                                provide: forms.NG_VALIDATORS,
                                useExisting: i0.forwardRef(function () { return TrumbowygEditor; }),
                                multi: true
                            }
                        ]
                    }]
            }], function () { return [{ type: i0__namespace.ElementRef }, { type: i0__namespace.Renderer2 }, { type: i1__namespace.HttpClient }]; }, { hasAutoSave: [{
                    type: i0.Input,
                    args: ['has-auto-save']
                }], autoSaveKey: [{
                    type: i0.Input,
                    args: ['auto-save-key']
                }], lastUpdate: [{
                    type: i0.Input,
                    args: ['last-update']
                }], addBtns: [{
                    type: i0.Input
                }], mode: [{
                    type: i0.Input
                }], lang: [{
                    type: i0.Input
                }], base64Image: [{
                    type: i0.Input
                }], base64ImageInserted: [{
                    type: i0.Output
                }] });
    })();

    var TrumbowygEditorModule = /** @class */ (function () {
        function TrumbowygEditorModule() {
        }
        return TrumbowygEditorModule;
    }());
    TrumbowygEditorModule.ɵfac = function TrumbowygEditorModule_Factory(t) { return new (t || TrumbowygEditorModule)(); };
    TrumbowygEditorModule.ɵmod = /*@__PURE__*/ i0__namespace.ɵɵdefineNgModule({ type: TrumbowygEditorModule });
    TrumbowygEditorModule.ɵinj = /*@__PURE__*/ i0__namespace.ɵɵdefineInjector({ imports: [[
                i1.HttpClientModule
            ]] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(TrumbowygEditorModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            i1.HttpClientModule
                        ],
                        declarations: [
                            TrumbowygEditor
                        ],
                        exports: [
                            TrumbowygEditor
                        ]
                    }]
            }], null, null);
    })();
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0__namespace.ɵɵsetNgModuleScope(TrumbowygEditorModule, { declarations: [TrumbowygEditor], imports: [i1.HttpClientModule], exports: [TrumbowygEditor] }); })();

    /**
     * Generated bundle index. Do not edit.
     */

    exports.TrumbowygEditor = TrumbowygEditor;
    exports.TrumbowygEditorModule = TrumbowygEditorModule;
    exports.TrumbowygFontSizePlugin = TrumbowygFontSizePlugin;
    exports.TrumbowygFontsPlugin = TrumbowygFontsPlugin;
    exports.TrumbowygInsertLeadPlugin = TrumbowygInsertLeadPlugin;
    exports.TrumbowygInsertMediaEmbedPlugin = TrumbowygInsertMediaEmbedPlugin;
    exports.TrumbowygInsertTablePlugin = TrumbowygInsertTablePlugin;
    exports.TrumbowygSelectImagesPlugin = TrumbowygSelectImagesPlugin;
    exports.TrumbowygSelectResourcesPlugin = TrumbowygSelectResourcesPlugin;
    exports.TrumbowygSelectStylesPlugin = TrumbowygSelectStylesPlugin;
    exports.TrumbowygSelectTemplatesPlugin = TrumbowygSelectTemplatesPlugin;
    exports.TrumbowygTidyPlugin = TrumbowygTidyPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-trumbowyg.umd.js.map
