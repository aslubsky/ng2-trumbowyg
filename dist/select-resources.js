"use strict";
var core_1 = require('@angular/core');
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
            //console.log('resource', resource);
            html.push('<li class="item">');
            html.push('<label>');
            html.push('<input type="radio" name="r' + pfx + '" data-id="' + resource.id + '" title="' + resource.title + '" data-type="' + resource.display_type + '" value="' + resource.id + '"/>');
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
        html.push('<div class="input-group resources-search">');
        html.push('<input type="text" class="form-control resources-search-field" placeholder="' + TrumbowygSelectResourcesPlugin.translate('selectResourcesSearch') +
            '" aria-describedby="resources-search">');
        html.push('<span class="input-group-btn" id="resources-search"><button class="btn-find btn btn-default" type="button"><i class="fa fa-search"></i></button></span>');
        html.push('</div>');
        html.push('<ul class="nav nav-tabs" role="tablist">');
        html.push('<li role="all" class="active">');
        html.push('   <a href="#" data-type="all"  role="tab" data-toggle="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesAll') + '</a>');
        html.push('</li>');
        html.push('<li role="gallery">');
        html.push('   <a href="#" data-type="gallery" role="tab" data-toggle="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesGallery') + '</a>');
        html.push('</li>');
        html.push('<li role="html">');
        html.push('   <a href="#" data-type="html" role="tab" data-toggle="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesHtmlSite') + '</a>');
        html.push('</li>');
        html.push('<li role="video">');
        html.push('   <a href="#" data-type="video" role="tab" data-toggle="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesVideo') + '</a>');
        html.push('</li>');
        html.push('<li role="audio">');
        html.push('   <a href="#" data-type="audio" role="tab" data-toggle="tab">' + TrumbowygSelectResourcesPlugin.translate('selectResourcesAudio') + '</a>');
        html.push('</li>');
        html.push('</ul>');
        html.push('<div class="tab-content">');
        html.push('   <div role="tabpanel" class="tab-pane active">');
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
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            'data-item-id="' + val + '" data-type="gallery" data-ext="' + type + '" data-gallery-src="' + val + '"' +
                            'src="/themes/default/assets/img/inline-gallery.png" />');
                        break;
                    case 'video':
                        // TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                        //     'data-item-id="' + val + '" data-type="video" data-ext="' + type + '" data-video-src="' + val + '"' +
                        //     'src="/themes/default/assets/img/inline-video.png" />');
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<iframe width="100%" height="480px" frameborder="0"' +
                            'src="/vendors/video-player/index.html?id=' + val + '" scrolling="no" marginheight="0" ' +
                            'class="no-border embed-responsive-item"></iframe>');
                        break;
                    case 'audio':
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            'data-item-id="' + val + '" data-type="audio" data-ext="' + type + '" data-src="' + val + '"' +
                            'src="/themes/default/assets/img/inline-audio.png" />');
                        break;
                    case 'html':
                        TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                            'data-item-id="' + val + '" data-type="html" data-ext="' + type + '" data-src="' + val + '"' +
                            'src="/themes/default/assets/img/inline-resource.png" />');
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
        jQuery('.nav.nav-tabs a', $modal).off('click').on('click', function (e) {
            e.preventDefault();
            // console.log('O_O', jQuery(this).attr('data-type'));
            jQuery('.tab-content .tab-pane', $modal).removeClass('active');
            jQuery(this).tab('show')
                .addClass('active');
            TrumbowygSelectResourcesPlugin.onSearch.emit({
                type: jQuery(this).attr('data-type') || 'all',
                title: jQuery('.resources-search-field', $modal).val()
            });
        });
        jQuery('.btn-find', $modal).off('click').on('click', function () {
            TrumbowygSelectResourcesPlugin.onSearch.emit({
                type: jQuery(this).attr('data-type') || 'all',
                title: jQuery('.resources-search-field', $modal).val()
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
    TrumbowygSelectResourcesPlugin.editorResources = [];
    TrumbowygSelectResourcesPlugin.onSearch = new core_1.EventEmitter();
    return TrumbowygSelectResourcesPlugin;
}());
exports.TrumbowygSelectResourcesPlugin = TrumbowygSelectResourcesPlugin;
