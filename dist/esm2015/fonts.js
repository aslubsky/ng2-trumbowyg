export class TrumbowygFontsPlugin {
    static init(editor, lang) {
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
    }
    static buildDropdown(func, trumbowyg) {
        var dropdown = [];
        TrumbowygFontsPlugin.fonts.forEach((font, i) => {
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxPQUFPLG9CQUFvQjtJQUl0QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQVcsRUFBRSxJQUFZO1FBQ3hDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckMsb0JBQW9CO1FBQ3BCLG9CQUFvQixDQUFDLEtBQUssR0FBRztZQUN6QixPQUFPO1lBQ1AsU0FBUztZQUNULGFBQWE7WUFDYixTQUFTO1lBQ1QsV0FBVztZQUNYLFFBQVE7WUFDUixXQUFXO1lBQ1gsWUFBWTtZQUNaLE9BQU87WUFDUCxRQUFRO1lBQ1IsaUJBQWlCO1lBQ2pCLGNBQWM7WUFDZCxTQUFTO1NBQ1osQ0FBQztRQUVGLGlDQUFpQztRQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRztZQUN0QixJQUFJLEVBQUUsVUFBVSxTQUFjO2dCQUMxQixnREFBZ0Q7Z0JBQ2hELFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO2dCQUNsRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtvQkFDNUIsUUFBUSxFQUFFLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO2lCQUN0RSxDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQTtJQUVMLENBQUM7SUFFTyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVMsRUFBRSxTQUFjO1FBQ2xELElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUU1QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBWSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQzNELGlEQUFpRDtZQUNqRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNyQixFQUFFLEVBQUUsVUFBVSxLQUFVLEVBQUUsQ0FBTTtvQkFDNUIsMEJBQTBCO29CQUMxQixRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQy9DLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFHSCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcblxuZXhwb3J0IGNsYXNzIFRydW1ib3d5Z0ZvbnRzUGx1Z2luIHtcbiAgICBwdWJsaWMgc3RhdGljIGVkaXRvcjogYW55O1xuICAgIHB1YmxpYyBzdGF0aWMgZm9udHM6IHN0cmluZ1tdO1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGVkaXRvcjogYW55LCBsYW5nOiBzdHJpbmcpIHtcbiAgICAgICAgVHJ1bWJvd3lnRm9udHNQbHVnaW4uZWRpdG9yID0gZWRpdG9yO1xuXG4gICAgICAgIC8vIFNldCBkZWZhdWx0IGZvbnRzXG4gICAgICAgIFRydW1ib3d5Z0ZvbnRzUGx1Z2luLmZvbnRzID0gW1xuICAgICAgICAgICAgXCJBcmlhbFwiLFxuICAgICAgICAgICAgXCJDb3VyaWVyXCIsXG4gICAgICAgICAgICBcIkNvdXJpZXIgTmV3XCIsXG4gICAgICAgICAgICBcIkdlb3JnaWFcIixcbiAgICAgICAgICAgIFwiSGVsdmV0aWNhXCIsXG4gICAgICAgICAgICBcIkltcGFjdFwiLFxuICAgICAgICAgICAgXCJNb25vc3BhY2VcIixcbiAgICAgICAgICAgIFwiU2Fucy1zZXJpZlwiLFxuICAgICAgICAgICAgXCJTZXJpZlwiLFxuICAgICAgICAgICAgXCJUYWhvbWFcIixcbiAgICAgICAgICAgIFwiVGltZXMgTmV3IFJvbWFuXCIsXG4gICAgICAgICAgICBcIlRyZWJ1Y2hldCBNU1wiLFxuICAgICAgICAgICAgXCJWZXJkYW5hXCJcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBBZGQgYWxsIGZvbnRzIGluIHR3byBkcm9wZG93bnNcbiAgICAgICAgZWRpdG9yLnBsdWdpbnMuZm9udE5hbWUgPSB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAodHJ1bWJvd3lnOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udE5hbWUgdHJ1bWJvd3lnJywgdHJ1bWJvd3lnKTtcbiAgICAgICAgICAgICAgICB0cnVtYm93eWcuby5wbHVnaW5zLmZvbnROYW1lID0gdHJ1bWJvd3lnLm8ucGx1Z2lucy5mb250TmFtZSB8fCB7fTtcbiAgICAgICAgICAgICAgICB0cnVtYm93eWcuYWRkQnRuRGVmKCdmb250TmFtZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd246IFRydW1ib3d5Z0ZvbnRzUGx1Z2luLmJ1aWxkRHJvcGRvd24oJ2ZvbnROYW1lJywgdHJ1bWJvd3lnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBidWlsZERyb3Bkb3duKGZ1bmM6IGFueSwgdHJ1bWJvd3lnOiBhbnkpIHtcbiAgICAgICAgdmFyIGRyb3Bkb3duOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIFRydW1ib3d5Z0ZvbnRzUGx1Z2luLmZvbnRzLmZvckVhY2goKGZvbnQ6IHN0cmluZywgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ1RydW1ib3d5Z0ZvbnRzUGx1Z2luJywgZm9udCwgaSk7XG4gICAgICAgICAgICB2YXIgZm9udEFsaWFzID0gZm9udC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnJykucmVwbGFjZSgnLScsICcnKTtcbiAgICAgICAgICAgIHZhciBidG4gPSBmdW5jICsgJ18nICsgZm9udEFsaWFzO1xuICAgICAgICAgICAgdHJ1bWJvd3lnLmFkZEJ0bkRlZihidG4sIHtcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKHBhcmFtOiBhbnksIHQ6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmluZm8ocGFyYW0sIHQpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9udE5hbWUnLCBmYWxzZSwgcGFyYW0pO1xuICAgICAgICAgICAgICAgICAgICB0LnN5bmNDb2RlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBmb250LFxuICAgICAgICAgICAgICAgIHBhcmFtOiBmb250XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRyb3Bkb3duLnB1c2goYnRuKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gZHJvcGRvd247XG4gICAgfVxufVxuIl19