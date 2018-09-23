import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IconBasedNavigationWebPartStrings';
import IconBasedNavigation from './components/IconBasedNavigation';
import { IIconBasedNavigationProps } from './components/IIconBasedNavigationProps';

export interface IIconBasedNavigationWebPartProps {
  iconListName: string;
}

export default class IconBasedNavigationWebPart extends BaseClientSideWebPart<IIconBasedNavigationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIconBasedNavigationProps > = React.createElement(
      IconBasedNavigation,
      {
        iconListName: this.properties.iconListName,
        siteurl: this.context.pageContext.web.absoluteUrl
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('iconListName', {
                  label: strings.IconListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
