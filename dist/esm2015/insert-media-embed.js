export class TrumbowygInsertMediaEmbedPlugin {
    static init(editor, lang) {
        TrumbowygInsertMediaEmbedPlugin.editor = editor;
        editor.plugins.insertMediaEmbed = {
            init: (trumbowyg) => {
                trumbowyg.o.plugins.insertMediaEmbed = trumbowyg.o.plugins.insertMediaEmbed || {};
                trumbowyg.addBtnDef('insertMediaEmbed', {
                    fn: (params, t) => {
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
                            .on('tbwconfirm', () => {
                            t.restoreRange();
                            t.syncCode();
                            var code = jQuery('textarea', $modal).val();
                            if (code) {
                                TrumbowygInsertMediaEmbedPlugin.editor.insertHtml(t, code);
                            }
                            setTimeout(() => {
                                t.closeModal();
                            }, 250);
                        })
                            .on('tbwcancel', () => {
                            t.restoreRange();
                            t.closeModal();
                        });
                    }
                });
            }
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LW1lZGlhLWVtYmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2luc2VydC1tZWRpYS1lbWJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sK0JBQStCO0lBR2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBVyxFQUFFLElBQVk7UUFDeEMsK0JBQStCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVoRCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHO1lBQzlCLElBQUksRUFBRSxDQUFDLFNBQWMsRUFBRSxFQUFFO2dCQUNyQixTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7Z0JBQ2xGLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUU7b0JBQ3BDLEVBQUUsRUFBRSxDQUFDLE1BQVcsRUFBRSxDQUFNLEVBQUUsRUFBRTt3QkFDeEIsa0NBQWtDO3dCQUNsQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBRWxCLElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQzt3QkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7d0JBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3dCQUVoQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzZCQUNoRCxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTs0QkFDbkIsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNqQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBRWIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDNUMsSUFBSSxJQUFJLEVBQUU7Z0NBQ04sK0JBQStCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7NkJBQzlEOzRCQUVELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0NBQ1osQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDOzRCQUNuQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ1osQ0FBQyxDQUFDOzZCQUNELEVBQUUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFOzRCQUNsQixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7NEJBQ2pCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDbkIsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsQ0FBQztpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQTtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIGpRdWVyeTogYW55O1xuXG5leHBvcnQgY2xhc3MgVHJ1bWJvd3lnSW5zZXJ0TWVkaWFFbWJlZFBsdWdpbiB7XG4gICAgcHVibGljIHN0YXRpYyBlZGl0b3I6IGFueTtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdChlZGl0b3I6IGFueSwgbGFuZzogc3RyaW5nKSB7XG4gICAgICAgIFRydW1ib3d5Z0luc2VydE1lZGlhRW1iZWRQbHVnaW4uZWRpdG9yID0gZWRpdG9yO1xuXG4gICAgICAgIGVkaXRvci5wbHVnaW5zLmluc2VydE1lZGlhRW1iZWQgPSB7XG4gICAgICAgICAgICBpbml0OiAodHJ1bWJvd3lnOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0cnVtYm93eWcuby5wbHVnaW5zLmluc2VydE1lZGlhRW1iZWQgPSB0cnVtYm93eWcuby5wbHVnaW5zLmluc2VydE1lZGlhRW1iZWQgfHwge307XG4gICAgICAgICAgICAgICAgdHJ1bWJvd3lnLmFkZEJ0bkRlZignaW5zZXJ0TWVkaWFFbWJlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgZm46IChwYXJhbXM6IGFueSwgdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdpbnNlcnRNZWRpYUVtYmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHRydW1ib3d5ZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWw6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXJcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cIm1vZGFsLW1lYWRpYS1lbWJlZFwiPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGV4dGFyZWE+PC90ZXh0YXJlYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goJzwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0TWVkaWFFbWJlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gdC5vcGVuTW9kYWwoJ0VtYmVkIENvZGUnLCBodG1sLmpvaW4oJycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbigndGJ3Y29uZmlybScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5yZXN0b3JlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5zeW5jQ29kZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlID0galF1ZXJ5KCd0ZXh0YXJlYScsICRtb2RhbCkudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcnVtYm93eWdJbnNlcnRNZWRpYUVtYmVkUGx1Z2luLmVkaXRvci5pbnNlcnRIdG1sKHQsIGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbigndGJ3Y2FuY2VsJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnJlc3RvcmVSYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19