import { EventEmitter } from '@angular/core';
export class TrumbowygSelectResourcesPlugin {
    static init(editor, lang) {
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
    }
    static translate(str) {
        return TrumbowygSelectResourcesPlugin.editor.langs[TrumbowygSelectResourcesPlugin.lang][str];
    }
    static renderList(pfx, html, items) {
        items.forEach((resource) => {
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
    }
    static selectResourcesCb(params, t) {
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
    }
    static updateResources(editorResources) {
        TrumbowygSelectResourcesPlugin.editorResources = editorResources;
        //
        jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).empty();
        var lhtml = [];
        TrumbowygSelectResourcesPlugin.renderList(TrumbowygSelectResourcesPlugin.pfx, lhtml, editorResources);
        jQuery('.resources-list', TrumbowygSelectResourcesPlugin.$modal).append(lhtml.join(''));
    }
}
TrumbowygSelectResourcesPlugin.editorResources = [];
TrumbowygSelectResourcesPlugin.onSearch = new EventEmitter();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXJlc291cmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZWxlY3QtcmVzb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBYyxlQUFlLENBQUM7QUFJbkQsTUFBTSxPQUFPLDhCQUE4QjtJQVVoQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQVcsRUFBRSxJQUFZO1FBQ3hDLDhCQUE4QixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDL0MsOEJBQThCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUMzQyxnRUFBZ0U7UUFFaEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUc7WUFDN0IsSUFBSSxFQUFFLFVBQVUsU0FBYztnQkFDMUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7Z0JBQ2hGLFNBQVMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUU7b0JBQ25DLEVBQUUsRUFBRSxVQUFVLE1BQVc7d0JBQ3JCLGlFQUFpRTt3QkFDakUsOEJBQThCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUN4RSxDQUFDO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxHQUFHLEVBQUUsS0FBSztTQUNiLENBQUE7SUFDTCxDQUFDO0lBRU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFXO1FBQ2hDLE9BQU8sOEJBQThCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNoRyxDQUFDO0lBRU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFXLEVBQUUsSUFBYyxFQUFFLEtBQVk7UUFDL0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFB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QUU7UUFDRixNQUFNLENBQUMsaUJBQWlCLEVBQUUsOEJBQThCLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekUsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLDhCQUE4QixDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7O0FBak1hLDhDQUFlLEdBQVUsRUFBRSxDQUFDO0FBRTVCLHVDQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlcn0gICAgICAgICBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4ge1xuICAgIHB1YmxpYyBzdGF0aWMgZWRpdG9yUmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuXG4gICAgcHVibGljIHN0YXRpYyBvblNlYXJjaDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwdWJsaWMgc3RhdGljIGVkaXRvcjogYW55O1xuICAgIHB1YmxpYyBzdGF0aWMgJG1vZGFsOiBhbnk7XG4gICAgcHVibGljIHN0YXRpYyBsYW5nOiBzdHJpbmc7XG4gICAgcHVibGljIHN0YXRpYyBwZng6IHN0cmluZztcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdChlZGl0b3I6IGFueSwgbGFuZzogc3RyaW5nKSB7XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5sYW5nID0gbGFuZztcbiAgICAgICAgLy8gVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLm9uU2VhcmNoID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgICAgIGVkaXRvci5wbHVnaW5zLnNlbGVjdFJlc291cmNlcyA9IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICh0cnVtYm93eWc6IGFueSkge1xuICAgICAgICAgICAgICAgIHRydW1ib3d5Zy5vLnBsdWdpbnMuc2VsZWN0UmVzb3VyY2VzID0gdHJ1bWJvd3lnLm8ucGx1Z2lucy5zZWxlY3RSZXNvdXJjZXMgfHwge307XG4gICAgICAgICAgICAgICAgdHJ1bWJvd3lnLmFkZEJ0bkRlZignc2VsZWN0UmVzb3VyY2VzJywge1xuICAgICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0SW1hZ2VDYicsIHBhcmFtcywgdHJ1bWJvd3lnLCBlZGl0b3JJbWFnZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLnNlbGVjdFJlc291cmNlc0NiKHBhcmFtcywgdHJ1bWJvd3lnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhZzogJ2ltZydcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHRyYW5zbGF0ZShzdHI6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5sYW5nc1tUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4ubGFuZ11bc3RyXVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHJlbmRlckxpc3QocGZ4OiBzdHJpbmcsIGh0bWw6IHN0cmluZ1tdLCBpdGVtczogYW55W10pIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgocmVzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc291cmNlJywgcmVzb3VyY2UpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8bGkgY2xhc3M9XCJpdGVtXCI+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxsYWJlbD4nKTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJyJyArIHBmeCArICdcIiBkYXRhLWlkPVwiJyArIHJlc291cmNlLmlkICsgJ1wiICcgK1xuICAgICAgICAgICAgICAgICd0aXRsZT1cIicgKyByZXNvdXJjZS50aXRsZSArICdcIiBkYXRhLXR5cGU9XCInICsgcmVzb3VyY2UuZGlzcGxheV90eXBlICsgJ1wiIHZhbHVlPVwiJyArIHJlc291cmNlLmlkICsgJ1wiLz4nKTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHN0cm9uZz4nICsgcmVzb3VyY2UudGl0bGUgKyAnPC9zdHJvbmc+Jyk7XG4gICAgICAgICAgICBpZiAocmVzb3VyY2UuZGVzY3JpcHRpb24gJiYgcmVzb3VyY2UuZGVzY3JpcHRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGJyLz48aT4nICsgcmVzb3VyY2UuZGVzY3JpcHRpb24gKyAnPC9pPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2xhYmVsPicpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2xpPicpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgc3RhdGljIHNlbGVjdFJlc291cmNlc0NiKHBhcmFtczogYW55LCB0OiBhbnkpIHtcbiAgICAgICAgdmFyIHBmeCA9IFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5wZnggPSB0Lm8ucHJlZml4O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdlZGl0b3JSZXNvdXJjZXMnLCBlZGl0b3JSZXNvdXJjZXMpO1xuXG4gICAgICAgIHZhciBodG1sOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cInJlc291cmNlcy1zZWxlY3QgbW9kYWwtY29udGFpbmVyXCI+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cInJlc291cmNlcy1zZWFyY2ggY2JyLWlucHV0LWNvbnRyb2xcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8bGFiZWwgZm9yPVwidGV4dFwiIGNsYXNzPVwiY2JyLWxhYmVsXCI+JyArIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi50cmFuc2xhdGUoJ3NlbGVjdFJlc291cmNlc1NlYXJjaCcpICsnPC9sYWJlbD4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8aW5wdXQgY2xhc3M9XCJjYnItaW5wdXQgY2JyLWlucHV0LWRlZmF1bHQgY2JyLWlucHV0LWVtYWlsXCIgdHlwZT1cInRleHRcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8c3BhbiBjbGFzcz1cImNici1pY29uLWlucHV0IGNici1pY29uLWlucHV0LXByaW1hcnlcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIicpO1xuICAgICAgICBodG1sLnB1c2goJ3dpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgNDUxIDQ1MVwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTEgNDUxO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPGc+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPHBhdGggZD1cIk00NDcuMDUsNDI4bC0xMDkuNi0xMDkuNmMyOS40LTMzLjgsNDcuMi03Ny45LDQ3LjItMTI2LjFDMzg0LjY1LDg2LjIsMjk4LjM1LDAsMTkyLjM1LDBDODYuMjUsMCwwLjA1LDg2LjMsMC4wNSwxOTIuMycpO1xuICAgICAgICBodG1sLnB1c2goJ3M4Ni4zLDE5Mi4zLDE5Mi4zLDE5Mi4zYzQ4LjIsMCw5Mi4zLTE3LjgsMTI2LjEtNDcuMkw0MjguMDUsNDQ3YzIuNiwyLjYsNi4xLDQsOS41LDRzNi45LTEuMyw5LjUtNCcpO1xuICAgICAgICBodG1sLnB1c2goJ0M0NTIuMjUsNDQxLjgsNDUyLjI1LDQzMy4yLDQ0Ny4wNSw0Mjh6IE0yNi45NSwxOTIuM2MwLTkxLjIsNzQuMi0xNjUuMywxNjUuMy0xNjUuM2M5MS4yLDAsMTY1LjMsNzQuMiwxNjUuMywxNjUuMycpO1xuICAgICAgICBodG1sLnB1c2goJ3MtNzQuMSwxNjUuNC0xNjUuMywxNjUuNEMxMDEuMTUsMzU3LjcsMjYuOTUsMjgzLjUsMjYuOTUsMTkyLjN6XCIvPicpO1xuICAgICAgICBodG1sLnB1c2goJzwvZz4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L3N2Zz4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L3NwYW4+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPHVsIGNsYXNzPVwiY2JyMi10YWJzXCIgcm9sZT1cInRhYmxpc3RcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8bGkgcm9sZT1cImFsbFwiIGNsYXNzPVwiY2JyMi10YWJzLWl0ZW1hY3RpdmVcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCcgICA8YSBkYXRhLXR5cGU9XCJhbGxcIiAgcm9sZT1cInRhYlwiPicgKyBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4udHJhbnNsYXRlKCdzZWxlY3RSZXNvdXJjZXNBbGwnKSArICc8L2E+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPC9saT4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8bGkgcm9sZT1cImdhbGxlcnlcIiBjbGFzcz1cImNicjItdGFicy1pdGVtXCI+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnICAgPGEgZGF0YS10eXBlPVwiZ2FsbGVyeVwiIHJvbGU9XCJ0YWJcIj4nICsgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLnRyYW5zbGF0ZSgnc2VsZWN0UmVzb3VyY2VzR2FsbGVyeScpICsgJzwvYT4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L2xpPicpO1xuICAgICAgICBodG1sLnB1c2goJzxsaSByb2xlPVwiaHRtbFwiIGNsYXNzPVwiY2JyMi10YWJzLWl0ZW1cIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCcgICA8YSBkYXRhLXR5cGU9XCJodG1sXCIgcm9sZT1cInRhYlwiPicgKyBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4udHJhbnNsYXRlKCdzZWxlY3RSZXNvdXJjZXNIdG1sU2l0ZScpICsgJzwvYT4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L2xpPicpO1xuICAgICAgICBodG1sLnB1c2goJzxsaSByb2xlPVwidmlkZW9cIiBjbGFzcz1cImNicjItdGFicy1pdGVtXCI+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnICAgPGEgZGF0YS10eXBlPVwidmlkZW9cIiByb2xlPVwidGFiXCI+JyArIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi50cmFuc2xhdGUoJ3NlbGVjdFJlc291cmNlc1ZpZGVvJykgKyAnPC9hPicpO1xuICAgICAgICBodG1sLnB1c2goJzwvbGk+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPGxpIHJvbGU9XCJhdWRpb1wiIGNsYXNzPVwiY2JyMi10YWJzLWl0ZW1cIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCcgICA8YSBkYXRhLXR5cGU9XCJhdWRpb1wiIHJvbGU9XCJ0YWJcIj4nICsgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLnRyYW5zbGF0ZSgnc2VsZWN0UmVzb3VyY2VzQXVkaW8nKSArICc8L2E+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPC9saT4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L3VsPicpO1xuICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJjYnItdGFiLWNvbnRlbnRcIj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCcgICA8ZGl2IHJvbGU9XCJ0YWJwYW5lbFwiIGNsYXNzPVwiY2JyLXRhYi1wYW5lIGFjdGl2ZVwiPicpO1xuICAgICAgICBodG1sLnB1c2goJyAgIDx1bCBjbGFzcz1cInJlc291cmNlcy1saXN0IGxpc3QtdW5zdHlsZWRcIj4nKTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLnJlbmRlckxpc3QocGZ4LCBodG1sLCBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4uZWRpdG9yUmVzb3VyY2VzKTtcbiAgICAgICAgaHRtbC5wdXNoKCcgICA8L3VsPicpO1xuICAgICAgICBodG1sLnB1c2goJzwvZGl2PicpO1xuICAgICAgICBodG1sLnB1c2goJzwvZGl2PicpO1xuXG4gICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygnaHRtbCcsIGh0bWwpO1xuICAgICAgICB2YXIgJG1vZGFsID0gVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLiRtb2RhbCA9IHQub3Blbk1vZGFsKFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi50cmFuc2xhdGUoJ3NlbGVjdFJlc291cmNlc0hlYWRlcicpLCBodG1sLmpvaW4oJycpKVxuICAgICAgICAgICAgLm9uKCd0Yndjb25maXJtJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0galF1ZXJ5KCdpbnB1dDpjaGVja2VkJywgJG1vZGFsKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gc2VsZWN0ZWQudmFsKCk7XG4gICAgICAgICAgICAgICAgLy92YXIgaSA9IHBhcnNlSW50KHNlbGVjdGVkLmRhdGEoJ2knKSwgMTApO1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gc2VsZWN0ZWQuZGF0YSgndHlwZScpO1xuXG4gICAgICAgICAgICAgICAgdC5yZXN0b3JlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0LnN5bmNDb2RlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbXA0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICd2aWRlbyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtcDMnIHx8IHR5cGUgPT09ICdhY2MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ2F1ZGlvJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ2FsbGVyeSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsICc8aW1nIHJlc291cmNlLWluLXJlc291cmNlLXJlbmRlciAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ2RhdGEtaXRlbS1pZD1cIicgKyB2YWwgKyAnXCIgZGF0YS10eXBlPVwiZ2FsbGVyeVwiIGRhdGEtZXh0PVwiJyArIHR5cGUgKyAnXCIgZGF0YS1nYWxsZXJ5LXNyYz1cIicgKyB2YWwgKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ3NyYz1cIi90aGVtZXMvZGVmYXVsdC9hc3NldHMvaW1nL2lubGluZS1nYWxsZXJ5LnBuZ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsICc8aWZyYW1lIHJlc291cmNlLWluLXJlc291cmNlLWlmcmFtZT1cIlwiIGFsbG93ZnVsbHNjcmVlbiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCI2NDBweFwiIGZyYW1lYm9yZGVyPVwiMFwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3JjPVwiL25vZGVfbW9kdWxlcy9jb2xsYWJvcmF0b3ItZ2FsbGVyeS9kaXN0L2luZGV4Lmh0bWw/aWQ9JyArIHZhbCArICdcIiBkYXRhLWl0ZW0taWQ9XCInICsgdmFsICsgJ1wiIHNjcm9sbGluZz1cIm5vXCIgbWFyZ2luaGVpZ2h0PVwiMFwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJuby1ib3JkZXIgZW1iZWQtcmVzcG9uc2l2ZS1pdGVtXCI+PC9pZnJhbWU+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd2aWRlbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsICc8aW1nIHJlc291cmNlLWluLXJlc291cmNlLXJlbmRlciAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ2RhdGEtaXRlbS1pZD1cIicgKyB2YWwgKyAnXCIgZGF0YS10eXBlPVwidmlkZW9cIiBkYXRhLWV4dD1cIicgKyB0eXBlICsgJ1wiIGRhdGEtdmlkZW8tc3JjPVwiJyArIHZhbCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAnc3JjPVwiL3RoZW1lcy9kZWZhdWx0L2Fzc2V0cy9pbWcvaW5saW5lLXZpZGVvLnBuZ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsICc8aWZyYW1lIHJlc291cmNlLWluLXJlc291cmNlLWlmcmFtZT1cIlwiIGFsbG93ZnVsbHNjcmVlbiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCI0ODBweFwiIGZyYW1lYm9yZGVyPVwiMFwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3JjPVwiL25vZGVfbW9kdWxlcy9jb2xsYWJvcmF0b3ItdmlkZW8tcGxheWVyL2Rpc3QvaW5kZXguaHRtbD9pZD0nICsgdmFsICsgJ1wiIGRhdGEtaXRlbS1pZD1cIicgKyB2YWwgKyAnXCIgc2Nyb2xsaW5nPVwibm9cIiBtYXJnaW5oZWlnaHQ9XCIwXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cIm5vLWJvcmRlciBlbWJlZC1yZXNwb25zaXZlLWl0ZW1cIj48L2lmcmFtZT4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2F1ZGlvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4uZWRpdG9yLmluc2VydEh0bWwodCwgJzxpbWcgcmVzb3VyY2UtaW4tcmVzb3VyY2UtcmVuZGVyICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAnZGF0YS1pdGVtLWlkPVwiJyArIHZhbCArICdcIiBkYXRhLXR5cGU9XCJhdWRpb1wiIGRhdGEtZXh0PVwiJyArIHR5cGUgKyAnXCIgZGF0YS1zcmM9XCInICsgdmFsICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICdzcmM9XCIvdGhlbWVzL2RlZmF1bHQvYXNzZXRzL2ltZy9pbmxpbmUtYXVkaW8ucG5nXCIgLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4uZWRpdG9yLmluc2VydEh0bWwodCwgJzxpZnJhbWUgcmVzb3VyY2UtaW4tcmVzb3VyY2UtaWZyYW1lPVwiXCIgYWxsb3dmdWxsc2NyZWVuIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjY1cHhcIiBmcmFtZWJvcmRlcj1cIjBcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NyYz1cIi9ub2RlX21vZHVsZXMvY29sbGFib3JhdG9yLWF1ZGlvLXBsYXllci9kaXN0L2luZGV4Lmh0bWw/aWQ9JyArIHZhbCArICdcIiBkYXRhLWl0ZW0taWQ9XCInICsgdmFsICsgJ1wiIHNjcm9sbGluZz1cIm5vXCIgbWFyZ2luaGVpZ2h0PVwiMFwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJuby1ib3JkZXIgZW1iZWQtcmVzcG9uc2l2ZS1pdGVtXCI+PC9pZnJhbWU+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5lZGl0b3IuaW5zZXJ0SHRtbCh0LCAnPGltZyByZXNvdXJjZS1pbi1yZXNvdXJjZS1yZW5kZXIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICdkYXRhLWl0ZW0taWQ9XCInICsgdmFsICsgJ1wiIGRhdGEtdHlwZT1cImh0bWxcIiBkYXRhLWV4dD1cIicgKyB0eXBlICsgJ1wiIGRhdGEtc3JjPVwiJyArIHZhbCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAnc3JjPVwiL3RoZW1lcy9kZWZhdWx0L2Fzc2V0cy9pbWcvaW5saW5lLXJlc291cmNlLnBuZ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsICc8aWZyYW1lIHJlc291cmNlLWluLXJlc291cmNlLWlmcmFtZT1cIlwiIGFsbG93ZnVsbHNjcmVlbiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCI2NDBweFwiIGZyYW1lYm9yZGVyPVwiMFwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3JjPVwiL25vZGVfbW9kdWxlcy9jb2xsYWJvcmF0b3ItaHRtbC1wbGF5ZXIvZGlzdC9pbmRleC5odG1sP2lkPScgKyB2YWwgKyAnXCIgc2Nyb2xsaW5nPVwibm9cIiBtYXJnaW5oZWlnaHQ9XCIwXCIgZGF0YS1pdGVtLWlkPVwiJyArIHZhbCArICdcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwibm8tYm9yZGVyIGVtYmVkLXJlc3BvbnNpdmUtaXRlbVwiPjwvaWZyYW1lPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCd0YndjYW5jZWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdC5yZXN0b3JlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0LmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGpRdWVyeSgnLmNicjItdGFicyBhJywgJG1vZGFsKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBqUXVlcnkoJy5jYnIyLXRhYnMtaXRlbScsICRtb2RhbCkucmVtb3ZlQ2xhc3MoJ2Nici10YWJzLWFjdGl2ZScpO1xuICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdjYnItdGFicy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLm9uU2VhcmNoLmVtaXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXR5cGUnKSB8fCAnYWxsJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogalF1ZXJ5KCcuY2JyLWlucHV0JywgJG1vZGFsKS52YWwoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpRdWVyeSgnLmNici1pY29uLWlucHV0JywgJG1vZGFsKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLm9uU2VhcmNoLmVtaXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXR5cGUnKSB8fCAnYWxsJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogalF1ZXJ5KCcuY2JyLWlucHV0JywgJG1vZGFsKS52YWwoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlUmVzb3VyY2VzKGVkaXRvclJlc291cmNlczogYW55W10pIHtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0UmVzb3VyY2VzUGx1Z2luLmVkaXRvclJlc291cmNlcyA9IGVkaXRvclJlc291cmNlcztcbiAgICAgICAgLy9cbiAgICAgICAgalF1ZXJ5KCcucmVzb3VyY2VzLWxpc3QnLCBUcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4uJG1vZGFsKS5lbXB0eSgpO1xuICAgICAgICB2YXIgbGh0bWw6IHN0cmluZ1tdID0gW107XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5yZW5kZXJMaXN0KFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi5wZngsIGxodG1sLCBlZGl0b3JSZXNvdXJjZXMpO1xuICAgICAgICBqUXVlcnkoJy5yZXNvdXJjZXMtbGlzdCcsIFRydW1ib3d5Z1NlbGVjdFJlc291cmNlc1BsdWdpbi4kbW9kYWwpLmFwcGVuZChsaHRtbC5qb2luKCcnKSk7XG4gICAgfVxufVxuIl19