import {EventEmitter}         from 'angular2/core';

declare var jQuery:any;

export class TrumbowygSelectResourcesPlugin {
    public static editorResources:any[] = [];

    public static onSearch:any;

    public static editor:any;
    public static $modal:any;
    public static lang:string;
    public static pfx:string;

    public static init(editor:any, lang:string) {
        TrumbowygSelectResourcesPlugin.editor = editor;
        TrumbowygSelectResourcesPlugin.lang = lang;
        TrumbowygSelectResourcesPlugin.onSearch = new EventEmitter();

        jQuery.extend(true, editor, {
            selectResources: {},
            opts: {
                btnsDef: {
                    selectResources: {
                        func: function (params, t) {
                            //console.log(editorResources);
                            TrumbowygSelectResourcesPlugin.selectResourcesCb(params, t);
                        },
                        ico: 'selectResources'
                    }
                }
            }
        });
    }

    private static translate(str) {
        return TrumbowygSelectResourcesPlugin.editor.langs[TrumbowygSelectResourcesPlugin.lang][str]
    }

    private static renderList(pfx, html, items) {
        items.forEach((resource:any) => {
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
    }


    private static selectResourcesCb(params, t) {
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
            .on(pfx + 'confirm', function () {
                var selected = jQuery('input:checked', $modal);
                var val = selected.val();
                //var i = parseInt(selected.data('i'), 10);
                var type = selected.data('type');

                t.restoreSelection();
                t.syncCode();
                jQuery(this).off(pfx + 'confirm');

                if (val) {
                    if (type === 'mp4') {
                        type = 'video';
                    }

                    switch (type) {
                        case 'gallery':
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                                'data-item-id="' + val + '" data-type="gallery" data-ext="' + type + '" data-gallery-src="' + val + '"' +
                                'src="/themes/default/assets/img/inline-gallery.png" />');
                            break;

                        case 'video':
                            TrumbowygSelectResourcesPlugin.editor.insertHtml(t, '<img resource-in-resource-render ' +
                                'data-item-id="' + val + '" data-type="video" data-ext="' + type + '" data-video-src="' + val + '"' +
                                'src="/themes/default/assets/img/inline-video.png" />');
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
            .one(pfx + 'cancel', function () {
                jQuery(this).off(pfx + 'confirm');
                t.closeModal();
                t.restoreSelection();
            });

        jQuery('.nav.nav-tabs a', $modal).off('click').on('click', function (e) {
            e.preventDefault();
            //console.log('O_O', $(this).attr('data-type'));
            //$('.tab-content .tab-pane', $modal).removeClass('active');
            jQuery(this).tab('show');
            //    .addClass('active');

            TrumbowygSelectResourcesPlugin.onSearch.emit({
                type: jQuery(this).attr('data-type'),
                title: jQuery('.resources-search-field', $modal).val()
            });

            //filter.type = $(this).attr('data-type');
            //PageModel.searchResourceForEditor({
            //    type: filter.type,
            //    title: filter.title
            //}, function (res) {
            //    editorResources = res.data.data;
            //
            //    $('.resources-list', $modal).empty();
            //    var lhtml = [];
            //    renderList(pfx, lhtml, editorResources);
            //    $('.resources-list', $modal).append(lhtml.join(''));
            //});
        });

        jQuery('.btn-find', $modal).off('click').on('click', function () {

            TrumbowygSelectResourcesPlugin.onSearch.emit({
                type: jQuery(this).attr('data-type'),
                title: jQuery('.resources-search-field', $modal).val()
            });

            //filter.title = $('.resources-search-field', $modal).val();
            //PageModel.searchResourceForEditor({
            //    type: filter.type,
            //    title: filter.title
            //}, function (res) {
            //    editorResources = res.data.data;
            //
            //    $('.resources-list', $modal).empty();
            //    var lhtml = [];
            //    renderList(pfx, lhtml, editorResources);
            //    $('.resources-list', $modal).append(lhtml.join(''));
            //});
        });
    }

    public static updateResources(editorResources:any[]) {
        TrumbowygSelectResourcesPlugin.editorResources = editorResources;
        //
        jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).empty();
        var lhtml = [];
        TrumbowygSelectResourcesPlugin.renderList(TrumbowygSelectResourcesPlugin.pfx, lhtml, editorResources);
        jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).append(lhtml.join(''));
    }
}
