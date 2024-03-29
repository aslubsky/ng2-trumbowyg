export class TrumbowygSelectStylesPlugin {
    static init(editor, lang) {
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
    }
    static selectStylesCb(params, t) {
        var pfx = t.o.prefix;
        var html = [];
        html.push('<div class="modal-container styles-select">');
        html.push('   <ul class="styles-list template-gallery list-unstyled">');
        TrumbowygSelectStylesPlugin.allStyles.forEach((style) => {
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
    }
    ;
    static setStyles(allStyles) {
        TrumbowygSelectStylesPlugin.allStyles = allStyles;
    }
}
TrumbowygSelectStylesPlugin.allStyles = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXN0eWxlcy5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9hc2x1YnNreS93b3JrL2NvbGxhYm9yYXRvci9uZzItdHJ1bWJvd3lnL3NyYy8iLCJzb3VyY2VzIjpbInNlbGVjdC1zdHlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxPQUFPLDJCQUEyQjtJQU03QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQVcsRUFBRSxJQUFZO1FBQ3hDLDJCQUEyQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDNUMsMkJBQTJCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRztZQUMxQixJQUFJLEVBQUUsVUFBVSxTQUFjO2dCQUMxQixTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztnQkFFMUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7b0JBQ2hDLEVBQUUsRUFBRSxVQUFVLE1BQVc7d0JBQ3JCLDJCQUEyQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ2xFLENBQUM7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUNELEdBQUcsRUFBRSxLQUFLO1NBQ2IsQ0FBQTtJQUNMLENBQUM7SUFFTyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQVcsRUFBRSxDQUFNO1FBRTdDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1FBQ3hFLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFXLEVBQUUsRUFBRTtZQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsOEJBQThCO2dCQUMzRSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyw0REFBNEQsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLG9CQUFvQjtnQkFDMUgsdUJBQXVCLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTO2dCQUNqRCxlQUFlLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQixJQUFJLGtCQUFrQixHQUFXLElBQUksQ0FBQztRQUN0QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuSSxFQUFFLENBQUMsWUFBWSxFQUFFO1lBQ2QsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUUvQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxtQ0FBbUM7Z0JBQ2xDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyw4RUFBOEUsR0FBRyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztnQkFDM0gsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUM3QjtZQUVELFVBQVUsQ0FBQztnQkFDUCxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLFdBQVcsRUFBRTtZQUNiLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFFUCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZCLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUs7WUFDNUUsTUFBTSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUFBLENBQUM7SUFFSyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQWdCO1FBQ3BDLDJCQUEyQixDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEQsQ0FBQzs7QUF6RWEscUNBQVMsR0FBVSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcblxuZXhwb3J0IGNsYXNzIFRydW1ib3d5Z1NlbGVjdFN0eWxlc1BsdWdpbiB7XG4gICAgcHVibGljIHN0YXRpYyBhbGxTdHlsZXM6IGFueVtdID0gW107XG5cbiAgICBwdWJsaWMgc3RhdGljIGVkaXRvcjogYW55O1xuICAgIHB1YmxpYyBzdGF0aWMgbGFuZzogc3RyaW5nO1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGVkaXRvcjogYW55LCBsYW5nOiBzdHJpbmcpIHtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0U3R5bGVzUGx1Z2luLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgICAgVHJ1bWJvd3lnU2VsZWN0U3R5bGVzUGx1Z2luLmxhbmcgPSBsYW5nO1xuICAgICAgICBlZGl0b3IucGx1Z2lucy5zZWxlY3RTdHlsZXMgPSB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAodHJ1bWJvd3lnOiBhbnkpIHtcbiAgICAgICAgICAgICAgICB0cnVtYm93eWcuby5wbHVnaW5zLnNlbGVjdFN0eWxlcyA9IHRydW1ib3d5Zy5vLnBsdWdpbnMuc2VsZWN0U3R5bGVzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgdHJ1bWJvd3lnLmFkZEJ0bkRlZignc2VsZWN0U3R5bGVzJywge1xuICAgICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUcnVtYm93eWdTZWxlY3RTdHlsZXNQbHVnaW4uc2VsZWN0U3R5bGVzQ2IocGFyYW1zLCB0cnVtYm93eWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFnOiAnaW1nJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2VsZWN0U3R5bGVzQ2IocGFyYW1zOiBhbnksIHQ6IGFueSkge1xuXG4gICAgICAgIHZhciBwZnggPSB0Lm8ucHJlZml4O1xuICAgICAgICB2YXIgaHRtbDogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXIgc3R5bGVzLXNlbGVjdFwiPicpO1xuICAgICAgICBodG1sLnB1c2goJyAgIDx1bCBjbGFzcz1cInN0eWxlcy1saXN0IHRlbXBsYXRlLWdhbGxlcnkgbGlzdC11bnN0eWxlZFwiPicpO1xuICAgICAgICBUcnVtYm93eWdTZWxlY3RTdHlsZXNQbHVnaW4uYWxsU3R5bGVzLmZvckVhY2goKHN0eWxlIDogYW55KSA9PiB7XG4gICAgICAgICAgICBodG1sLnB1c2goJyAgIDxsaSB0aXRsZT1cIicgKyBzdHlsZS5kZXNjcmlwdGlvbiArICdcIiBjbGFzcz1cIml0ZW0gc3R5bGVcIj48bGFiZWw+JyArXG4gICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIHN0eWxlLmljb24gKyAnXCIgY2xhc3M9XCJzZWxlY3QtdGVtcGxhdGUtaWNvblwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cIicgKyBzdHlsZS5pZCArICdcIiBuYW1lPVwidGVtcGxhdGVcIj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPiAnICsgc3R5bGUudGl0bGUgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8L2xhYmVsPjwvbGk+Jyk7XG4gICAgICAgIH0pO1xuICAgICAgICBodG1sLnB1c2goJyAgIDwvdWw+Jyk7XG4gICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkSW1hZ2VJbmRleDogbnVtYmVyID0gbnVsbDtcbiAgICAgICAgdmFyICRtb2RhbCA9IHQub3Blbk1vZGFsKFRydW1ib3d5Z1NlbGVjdFN0eWxlc1BsdWdpbi5lZGl0b3IubGFuZ3NbVHJ1bWJvd3lnU2VsZWN0U3R5bGVzUGx1Z2luLmxhbmddLnNlbGVjdFRlbXBsYXRlc1N0eWxlLCBodG1sLmpvaW4oJycpKVxuICAgICAgICAgICAgLm9uKCd0Yndjb25maXJtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IGpRdWVyeSgnaW5wdXQ6Y2hlY2tlZCcsICRtb2RhbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGVJZCA9IHBhcnNlSW50KHNlbGVjdGVkLnZhbCgpLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N0eWxlSWQnLCBzdHlsZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9ICRtb2RhbC5wYXJlbnQoKS5maW5kKCcudHJ1bWJvd3lnLWVkaXRvcicpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3IuZmluZCgnLmN1c3RvbVN0eWxlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5hcHBlbmQoJzxzdHlsZSBjbGFzcz1cImN1c3RvbVN0eWxlXCI+QGltcG9ydCB1cmwoaHR0cHM6Ly9ldHMuZGF2aW50b28uY29tL3VwbG9hZHMvY3NzLycgKyBzdHlsZUlkICsgJy5jc3MpOzwvc3R5bGU+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHQuc3luY1RleHRhcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgIHQuJGMudHJpZ2dlcigndGJ3Y2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCd0YndjYW5jZWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdC5yZXN0b3JlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICB0LmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICRtb2RhbC5hZGRDbGFzcygnYmlnJyk7XG5cbiAgICAgICAgalF1ZXJ5KCcuc3R5bGVzLWxpc3QgbGkgbGFiZWwnLCAkbW9kYWwpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZTphbnkpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnN0eWxlcy1saXN0IGxpJywgJG1vZGFsKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICBqUXVlcnkodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBwdWJsaWMgc3RhdGljIHNldFN0eWxlcyhhbGxTdHlsZXM6IGFueVtdKSB7XG4gICAgICAgIFRydW1ib3d5Z1NlbGVjdFN0eWxlc1BsdWdpbi5hbGxTdHlsZXMgPSBhbGxTdHlsZXM7XG4gICAgfVxufVxuIl19