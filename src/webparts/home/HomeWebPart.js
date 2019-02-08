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
import { BaseClientSideWebPart, PropertyPaneTextField, PropertyPaneToggle, } from '@microsoft/sp-webpart-base';
import * as strings from 'HomeWebPartStrings';
import Home from './components/Home';
import { ListMock } from './services/ListMock';
var HomeWebPart = (function (_super) {
    __extends(HomeWebPart, _super);
    function HomeWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HomeWebPart.prototype.render = function () {
        var element = React.createElement(Home, {
            listService: new ListMock(),
            swiperOptions: this.properties,
            siteUrl: this.context.pageContext.web.absoluteUrl
        });
        ReactDom.render(element, this.domElement);
    };
    HomeWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(HomeWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    HomeWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: 'Swiper Options'
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        // {
                        //   groupName: strings.GeneralGroupName,
                        //   groupFields: [
                        //     PropertyPaneToggle('enableNavigation', {
                        //       label: strings.EnableNavigation
                        //     }),
                        //     PropertyPaneToggle('enablePagination', {
                        //       label: strings.EnablePagination,
                        //       checked: true
                        //     }),
                        //     PropertyPaneTextField('slidesPerView', {
                        //       label: strings.SlidesPerWiew,
                        //       value: '3'
                        //     })
                        //   ]
                        // },
                        // {
                        //   groupName: strings.AutoplayGroupName,
                        //   groupFields: [
                        //     PropertyPaneToggle('enableAutoplay', {
                        //       label: strings.EnableAutoplay
                        //     }),
                        //     PropertyPaneTextField('delayAutoplay', {
                        //       label: strings.DelayAutoplay,
                        //       description: strings.Miliseconds,
                        //       value: '2500',
                        //       disabled: !this.properties.enableAutoplay
                        //     }),
                        //     PropertyPaneToggle('disableAutoplayOnInteraction', {
                        //       label: strings.DisableAutoplayOnInteraction,
                        //       disabled: !this.properties.enableAutoplay
                        //     })
                        //   ],
                        //   isCollapsed: true
                        // },
                        // {
                        //   groupName: strings.AdvancedGroupName,
                        //   groupFields: [
                        //     PropertyPaneTextField('slidesPerGroup', {
                        //       label: strings.SlidesPerGroup,
                        //       value: '3'
                        //     }),
                        //     PropertyPaneTextField('spaceBetweenSlides', {
                        //       label: strings.SpaceBetweenSlides,
                        //       description: strings.InPixels,
                        //       value: '5'
                        //     }),
                        //     PropertyPaneToggle('enableGrabCursor', {
                        //       label: strings.EnableGrabCursor
                        //     }),
                        //     PropertyPaneToggle('enableLoop', {
                        //       label: strings.EnableLoop
                        //     })
                        //   ],
                        //   isCollapsed: true
                        // },
                        {
                            groupName: strings.DataSourceGroupName,
                            groupFields: [
                                PropertyPaneTextField('sourceList', {
                                    label: strings.SourceList,
                                    value: 'Component Inventory'
                                }),
                                PropertyPaneTextField('imageColumnName', {
                                    label: strings.ImageColumnName,
                                    value: 'ComponentImage'
                                }),
                                PropertyPaneTextField('titleColumnName', {
                                    label: strings.TitleColumnName,
                                    value: 'ComponentTitle'
                                }),
                                PropertyPaneTextField('filterColumnName', {
                                    label: strings.FilterColumnName,
                                    value: "ComponentCategory"
                                }),
                                PropertyPaneTextField('orderBy', {
                                    label: strings.OrderBy,
                                    value: "Modified"
                                }),
                                PropertyPaneToggle('isAsending', {
                                    label: strings.IsAsending,
                                    checked: true
                                }),
                                PropertyPaneTextField('selectTop', {
                                    label: strings.SelectTop,
                                    value: "10"
                                }),
                                PropertyPaneToggle('showCategoryFilter', {
                                    label: strings.ShowCategoryFilter,
                                    checked: true
                                }),
                                PropertyPaneToggle('showLatestFilter', {
                                    label: strings.ShowLatestFilter,
                                    checked: true
                                }),
                                PropertyPaneTextField('redirectURL', {
                                    label: strings.RedirectURL,
                                    value: "../../SPMarketPlace/SitePages/ComponentDetails.aspx"
                                }),
                            ],
                            isCollapsed: true
                        }
                    ]
                }
            ]
        };
    };
    return HomeWebPart;
}(BaseClientSideWebPart));
export default HomeWebPart;
//# sourceMappingURL=HomeWebPart.js.map