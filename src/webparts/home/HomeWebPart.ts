import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from '@microsoft/sp-webpart-base';

import * as strings from 'HomeWebPartStrings';
import Home from './components/Home';
import { IHomeProps } from './components/IHomeProps';
import { IListServce } from '../commonServices/IListService';
import { ListMock } from '../commonServices/ListMock';

export interface IHomeWebPartProps {
  // enableNavigation: boolean;
  // enablePagination: boolean;
  // enableAutoplay: boolean;
  // delayAutoplay: number;
  // disableAutoplayOnInteraction: boolean;
  // slidesPerView: string;
  // slidesPerGroup: string;
  // spaceBetweenSlides: string;
  // enableGrabCursor: boolean;
  // enableLoop: boolean;
  sourceList:string;
  imageColumnName:string;
  titleColumnName:string;  
  filterColumnName:string;
  orderBy:string;
  isAsending:boolean;
  selectTop:string;
  showCategoryFilter:boolean;
  showLatestFilter:boolean;
  redirectURL:string;
}

export default class HomeWebPart extends BaseClientSideWebPart<IHomeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHomeProps > = React.createElement(
      Home,
      {
        listService: new ListMock(),
        swiperOptions: this.properties,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
  }
}
