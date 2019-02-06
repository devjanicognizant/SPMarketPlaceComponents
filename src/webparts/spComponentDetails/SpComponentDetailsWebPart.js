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
import * as strings from 'SpComponentDetailsWebPartStrings';
import SpComponentDetails from './components/SpComponentDetails';
var SpComponentDetailsWebPart = (function (_super) {
    __extends(SpComponentDetailsWebPart, _super);
    function SpComponentDetailsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpComponentDetailsWebPart.prototype.render = function () {
        var element = React.createElement(SpComponentDetails, {
            // Webpart property representing inventory list name
            inventoryListName: this.properties.inventoryListName,
            // Webpart property representing artoifacts document library
            artifactsListName: this.properties.artifactsListName,
            // Webpart property to configure the favourite image url when user is yet to mark the componet as favourite
            activeFavouriteImgUrl: this.properties.activeFavouriteImgUrl,
            // Webpart property to configure the favourite image url when user has already marked the component as favourite
            inactiveFavouriteImgUrl: this.properties.inactiveFavouriteImgUrl,
            // Webpart property to configure like image url when user is yet to like the component
            activeLikeImgUrl: this.properties.activeLikeImgUrl,
            // Webpart property to configure like image url when user has already liked the component
            inactiveLikeImgUrl: this.properties.inactiveLikeImgUrl,
            siteurl: this.context.pageContext.web.absoluteUrl
        });
        ReactDom.render(element, this.domElement);
    };
    SpComponentDetailsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(SpComponentDetailsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    SpComponentDetailsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneTextField('inventoryListName', {
                                    label: strings.InventoryListNameFieldLabel
                                }),
                                PropertyPaneTextField('artifactsListName', {
                                    label: strings.ArtifactsListNameFieldLabel
                                }),
                                PropertyPaneTextField('activeFavouriteImgUrl', {
                                    label: strings.ActiveFavouriteImgUrl
                                }),
                                PropertyPaneTextField('inactiveFavouriteImgUrl', {
                                    label: strings.InactiveFavouriteImgUrl
                                }),
                                PropertyPaneTextField('activeLikeImgUrl', {
                                    label: strings.ActiveLikeImgUrl
                                }),
                                PropertyPaneTextField('inactiveLikeImgUrl', {
                                    label: strings.InactiveLikeImgUrl
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return SpComponentDetailsWebPart;
}(BaseClientSideWebPart));
export default SpComponentDetailsWebPart;
//# sourceMappingURL=SpComponentDetailsWebPart.js.map