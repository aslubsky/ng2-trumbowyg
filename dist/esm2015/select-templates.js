// import {EventEmitter}         from '@angular/core';
const DEFAULT_ICON = 'themes/default/assets/img/t-icon.png';
export class TrumbowygSelectTemplatesPlugin {
    static init(editor, lang) {
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
    }
    static selectTemplatesCb(params, t) {
        var pfx = t.o.prefix;
        //console.log('editorResources', editorResources);
        var html = [];
        html.push('<div class="modal-container templates-select">');
        html.push('<ul class="cbr2-tabs" role="tablist">');
        TrumbowygSelectTemplatesPlugin.templates.forEach((templateSet, i) => {
            html.push('<li role="' + templateSet.id + '" class="cbr2-tabs-item ' + (i == 0 ? 'active' : '') + '">');
            html.push('   <a data-tab="' + templateSet.id + '"  role="tab" data-toggle="tab">' + templateSet.label + '</a>');
            html.push('</li>');
        });
        html.push('</ul>');
        html.push('<div class="cbr-tab-content">');
        TrumbowygSelectTemplatesPlugin.templates.forEach((templateSet, i) => {
            html.push('   <div role="tabpanel" id="' + templateSet.id + '" class="cbr-tab-pane ' + (i == 0 ? 'active' : '') + '">');
            html.push('   <ul class="templates-list template-gallery list-unstyled">');
            templateSet.elements.forEach((template, j) => {
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
    }
    static setTemplates(templates, allTemplates) {
        TrumbowygSelectTemplatesPlugin.templates = templates;
        TrumbowygSelectTemplatesPlugin.allTemplates = allTemplates;
    }
}
TrumbowygSelectTemplatesPlugin.templates = [];
TrumbowygSelectTemplatesPlugin.allTemplates = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXRlbXBsYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZWxlY3QtdGVtcGxhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDtBQUl0RCxNQUFNLFlBQVksR0FBRyxzQ0FBc0MsQ0FBQztBQUU1RCxNQUFNLE9BQU8sOEJBQThCO0lBT2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBVyxFQUFFLElBQVk7UUFDeEMsOEJBQThCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMvQyw4QkFBOEIsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRTNDLDRGQUE0RjtRQUU1RiwrREFBK0Q7UUFFL0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUc7WUFDN0IsSUFBSSxFQUFFLFVBQVUsU0FBYztnQkFDMUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7Z0JBQ2hGLFNBQVMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUU7b0JBQ25DLEVBQUUsRUFBRSxVQUFVLE1BQVc7d0JBQ3JCLGlFQUFpRTt3QkFDakUsOEJBQThCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUN4RSxDQUFDO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxHQUFHLEVBQUUsS0FBSztTQUNiLENBQUE7UUFHRCw4QkFBOEIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzFDLEVBQUUsRUFBRSxhQUFhO1lBQ2pCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLHFCQUFxQjtZQUMvQyxRQUFRLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQztRQUNILDhCQUE4QixDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztZQUMzRCxPQUFP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TUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBTTtZQUNsRixpQ0FBaUM7WUFDakMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBZ0IsRUFBRSxZQUFpQjtRQUMxRCw4QkFBOEIsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3JELDhCQUE4QixDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDL0QsQ0FBQzs7QUF2SGEsd0NBQVMsR0FBVSxFQUFFLENBQUM7QUFDdEIsMkNBQVksR0FBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge0V2ZW50RW1pdHRlcn0gICAgICAgICBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XG5cbmNvbnN0IERFRkFVTFRfSUNPTiA9ICd0aGVtZXMvZGVmYXVsdC9hc3NldHMvaW1nL3QtaWNvbi5wbmcnO1xuXG5leHBvcnQgY2xhc3MgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luIHtcbiAgICBwdWJsaWMgc3RhdGljIHRlbXBsYXRlczogYW55W10gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIGFsbFRlbXBsYXRlczogYW55ID0ge307XG5cbiAgICBwdWJsaWMgc3RhdGljIGVkaXRvcjogYW55O1xuICAgIHB1YmxpYyBzdGF0aWMgbGFuZzogc3RyaW5nO1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGVkaXRvcjogYW55LCBsYW5nOiBzdHJpbmcpIHtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLmxhbmcgPSBsYW5nO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2luaXQnLCBlZGl0b3IsIGVkaXRvci5sYW5ncywgbGFuZywgZWRpdG9yLmxhbmdzW2xhbmddLnNlbGVjdFRlbXBsYXRlc05vRGF0YSk7XG5cbiAgICAgICAgLy9UcnVtYm93eWdTZWxlY3RSZXNvdXJjZXNQbHVnaW4ub25TZWFyY2ggPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAgICAgZWRpdG9yLnBsdWdpbnMuc2VsZWN0VGVtcGxhdGVzID0ge1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKHRydW1ib3d5ZzogYW55KSB7XG4gICAgICAgICAgICAgICAgdHJ1bWJvd3lnLm8ucGx1Z2lucy5zZWxlY3RUZW1wbGF0ZXMgPSB0cnVtYm93eWcuby5wbHVnaW5zLnNlbGVjdFRlbXBsYXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICB0cnVtYm93eWcuYWRkQnRuRGVmKCdzZWxlY3RUZW1wbGF0ZXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAocGFyYW1zOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3RJbWFnZUNiJywgcGFyYW1zLCB0cnVtYm93eWcsIGVkaXRvckltYWdlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW4uc2VsZWN0VGVtcGxhdGVzQ2IocGFyYW1zLCB0cnVtYm93eWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFnOiAnaW1nJ1xuICAgICAgICB9XG5cblxuICAgICAgICBUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW4udGVtcGxhdGVzLnB1c2goe1xuICAgICAgICAgICAgaWQ6ICd0YWItbm8tZGF0YScsXG4gICAgICAgICAgICBsYWJlbDogZWRpdG9yLmxhbmdzW2xhbmddLnNlbGVjdFRlbXBsYXRlc05vRGF0YSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbXVxuICAgICAgICB9KTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLmFsbFRlbXBsYXRlc1sndGVtcGxhdGUtbm8tZGF0YSddID1cbiAgICAgICAgICAgICc8ZGl2PicgKyBlZGl0b3IubGFuZ3NbbGFuZ10uc2VsZWN0VGVtcGxhdGVzTm9EYXRhICsgJzwvZGl2Pic7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2VsZWN0VGVtcGxhdGVzQ2IocGFyYW1zOiBhbnksIHQ6IGFueSkge1xuICAgICAgICB2YXIgcGZ4OiBzdHJpbmcgPSB0Lm8ucHJlZml4O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdlZGl0b3JSZXNvdXJjZXMnLCBlZGl0b3JSZXNvdXJjZXMpO1xuXG4gICAgICAgIHZhciBodG1sOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lciB0ZW1wbGF0ZXMtc2VsZWN0XCI+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPHVsIGNsYXNzPVwiY2JyMi10YWJzXCIgcm9sZT1cInRhYmxpc3RcIj4nKTtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLnRlbXBsYXRlcy5mb3JFYWNoKCh0ZW1wbGF0ZVNldCwgaSkgPT4ge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8bGkgcm9sZT1cIicgKyB0ZW1wbGF0ZVNldC5pZCArICdcIiBjbGFzcz1cImNicjItdGFicy1pdGVtICcgKyAoaSA9PSAwID8gJ2FjdGl2ZScgOiAnJykgKyAnXCI+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJyAgIDxhIGRhdGEtdGFiPVwiJyArIHRlbXBsYXRlU2V0LmlkICsgJ1wiICByb2xlPVwidGFiXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj4nICsgdGVtcGxhdGVTZXQubGFiZWwgKyAnPC9hPicpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2xpPicpO1xuICAgICAgICB9KTtcblxuICAgICAgICBodG1sLnB1c2goJzwvdWw+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cImNici10YWItY29udGVudFwiPicpO1xuXG5cbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLnRlbXBsYXRlcy5mb3JFYWNoKCh0ZW1wbGF0ZVNldCwgaSkgPT4ge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCcgICA8ZGl2IHJvbGU9XCJ0YWJwYW5lbFwiIGlkPVwiJyArIHRlbXBsYXRlU2V0LmlkICsgJ1wiIGNsYXNzPVwiY2JyLXRhYi1wYW5lICcgKyAoaSA9PSAwID8gJ2FjdGl2ZScgOiAnJykgKyAnXCI+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJyAgIDx1bCBjbGFzcz1cInRlbXBsYXRlcy1saXN0IHRlbXBsYXRlLWdhbGxlcnkgbGlzdC11bnN0eWxlZFwiPicpO1xuICAgICAgICAgICAgdGVtcGxhdGVTZXQuZWxlbWVudHMuZm9yRWFjaCgodGVtcGxhdGU6IGFueSwgajogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUuaWNvbiA9IHRlbXBsYXRlLmljb24gfHwgREVGQVVMVF9JQ09OO1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnICAgPGxpIHRpdGxlPVwiJyArIHRlbXBsYXRlLmRlc2NyaXB0aW9uICsgJ1wiIGNsYXNzPVwiaXRlbVwiPjxsYWJlbD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIHRlbXBsYXRlLmljb24gKyAnXCIgY2xhc3M9XCJzZWxlY3QtdGVtcGxhdGUtaWNvblwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cIicgKyB0ZW1wbGF0ZS5pZCArICdcIiBuYW1lPVwidGVtcGxhdGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidGl0bGVcIj4gJyArIHRlbXBsYXRlLnRpdGxlICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4gJyArIHRlbXBsYXRlLmRlc2NyaXB0aW9uICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvbGFiZWw+PC9saT4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCcgICA8L3VsPicpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCcgICA8L2Rpdj4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcbiAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcblxuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2h0bWwnLCBodG1sKTtcbiAgICAgICAgdmFyICRtb2RhbCA9IHQub3Blbk1vZGFsKFRydW1ib3d5Z1NlbGVjdFRlbXBsYXRlc1BsdWdpbi5lZGl0b3IubGFuZ3NbVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLmxhbmddLnNlbGVjdFRlbXBsYXRlc0hlYWRlciwgaHRtbC5qb2luKCcnKSlcbiAgICAgICAgICAgIC5vbigndGJ3Y29uZmlybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSBqUXVlcnkoJ2lucHV0OmNoZWNrZWQnLCAkbW9kYWwpO1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBzZWxlY3RlZC52YWwoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWwsIGFsbFRlbXBsYXRlc1t2YWxdKTtcbiAgICAgICAgICAgICAgICAvLyBqUXVlcnkodGhpcykub2ZmKHBmeCArICdjb25maXJtJyk7XG5cbiAgICAgICAgICAgICAgICB0LnJlc3RvcmVSYW5nZSgpO1xuICAgICAgICAgICAgICAgIHQuc3luY0NvZGUoKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgVHJ1bWJvd3lnU2VsZWN0VGVtcGxhdGVzUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsIFRydW1ib3d5Z1NlbGVjdFRlbXBsYXRlc1BsdWdpbi5hbGxUZW1wbGF0ZXNbdmFsXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCd0YndjYW5jZWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdC5yZXN0b3JlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0LmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAkbW9kYWwuYWRkQ2xhc3MoJ2JpZycpO1xuXG4gICAgICAgIGpRdWVyeSgnLmNicjItdGFicyBhJywgJG1vZGFsKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBqUXVlcnkoJy5jYnIyLXRhYnMtaXRlbScsICRtb2RhbCkucmVtb3ZlQ2xhc3MoJ2Nici10YWJzLWFjdGl2ZScpO1xuICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdjYnItdGFicy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ09fTycsICQodGhpcykuYXR0cignZGF0YS10YWInKSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5jYnItdGFiLWNvbnRlbnQgLmNici10YWItcGFuZScsICRtb2RhbCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgalF1ZXJ5KCcjJyArIGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXRhYicpKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBqUXVlcnkoJy50ZW1wbGF0ZS1nYWxsZXJ5IGxpIGxhYmVsJywgJG1vZGFsKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnT19PJywgZSwgJCh0aGlzKSk7XG4gICAgICAgICAgICBqUXVlcnkoJy50ZW1wbGF0ZS1nYWxsZXJ5IGxpJywgJG1vZGFsKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICBqUXVlcnkodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNldFRlbXBsYXRlcyh0ZW1wbGF0ZXM6IGFueVtdLCBhbGxUZW1wbGF0ZXM6IGFueSkge1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW4udGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RUZW1wbGF0ZXNQbHVnaW4uYWxsVGVtcGxhdGVzID0gYWxsVGVtcGxhdGVzO1xuICAgIH1cbn1cbiJdfQ==