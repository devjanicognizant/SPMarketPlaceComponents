var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import * as strings from 'IconBasedNavigationWebPartStrings';
import IconBasedNavigation from './components/IconBasedNavigation';
var IconBasedNavigationWebPart = (function (_super) {
    __extends(IconBasedNavigationWebPart, _super);
    function IconBasedNavigationWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconBasedNavigationWebPart.prototype.render = function () {
        var element = React.createElement(IconBasedNavigation, {
            iconListName: this.properties.iconListName,
            defaultImgUrl: this.properties.defaultImgUrl,
            siteurl: this.context.pageContext.web.absoluteUrl
        });
        ReactDom.render(element, this.domElement);
    };
    IconBasedNavigationWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(IconBasedNavigationWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    IconBasedNavigationWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('iconListName', {
                                    label: strings.IconListNameFieldLabel
                                }),
                                PropertyPaneTextField('defaultImgUrl', {
                                    label: strings.DefaultImgUrl
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return IconBasedNavigationWebPart;
}(BaseClientSideWebPart));
export default IconBasedNavigationWebPart;
//# sourceMappingURL=IconBasedNavigationWebPart.js.map