"use strict";
var core_1 = require("@angular/core");
var TrumbowygSelectResourcesPlugin = (function () {
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
        html.push('<ul class="cbr-inline-tabs" role="tablist">');
        html.push('<li role="all" class="cbr-tabs-item cbr-tabs-active">');
        html.push('   <a data-type="all"  role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesAll') + '</a>');
        html.push('</li>');
        html.push('<li role="gallery" class="cbr-tabs-item">');
        html.push('   <a data-type="gallery" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesGallery') + '</a>');
        html.push('</li>');
        html.push('<li role="html" class="cbr-tabs-item">');
        html.push('   <a data-type="html" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesHtmlSite') + '</a>');
        html.push('</li>');
        html.push('<li role="video" class="cbr-tabs-item">');
        html.push('   <a data-type="video" role="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesVideo') + '</a>');
        html.push('</li>');
        html.push('<li role="audio" class="cbr-tabs-item">');
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
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" width="100%" height="640px" frameborder="0" ' +
                            'src="/node_modules/collaborator-gallery/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                            'class="no-border embed-responsive-item"></iframe>');
                        break;
                    case 'video':
                        // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                        //     'data-item-id="' + val + '" data-type="video" data-ext="' + type + '" data-video-src="' + val + '"' +
                        //     'src="/themes/default/assets/img/inline-video.png" />');
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" width="100%" height="480px" frameborder="0" ' +
                            'src="/node_modules/collaborator-video-player/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                            'class="no-border embed-responsive-item"></iframe>');
                        break;
                    case 'audio':
                        // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                        //     'data-item-id="' + val + '" data-type="audio" data-ext="' + type + '" data-src="' + val + '"' +
                        //     'src="/themes/default/assets/img/inline-audio.png" />');
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" width="100%" height="37px" frameborder="0" ' +
                            'src="/node_modules/collaborator-audio-player/dist/index.html?id=' + val + '" data-item-id="' + val + '" scrolling="no" marginheight="0" ' +
                            'class="no-border embed-responsive-item"></iframe>');
                        break;
                    case 'html':
                        // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                        //     'data-item-id="' + val + '" data-type="html" data-ext="' + type + '" data-src="' + val + '"' +
                        //     'src="/themes/default/assets/img/inline-resource.png" />');
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe resource-in-resource-iframe="" width="100%" height="640px" frameborder="0" ' +
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
        jQuery('.cbr-inline-tabs a', $modal).off('click').on('click', function (e) {
            e.preventDefault();
            jQuery('.cbr-tabs-item', $modal).removeClass('cbr-tabs-active');
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
TrumbowygSelectResourcesPlugin.onSearch = new core_1.EventEmitter();
exports.TrumbowygSelectResourcesPlugin = TrumbowygSelectResourcesPlugin;
