import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpComponentDetailsWebPartStrings';
import SpComponentDetails from './components/SpComponentDetails';
import { ISpComponentDetailsProps } from './components/ISpComponentDetailsProps';

export interface ISpComponentDetailsWebPartProps {
  inventoryListName:string;
  artifactsListName:string;
}

export default class SpComponentDetailsWebPart extends BaseClientSideWebPart<ISpComponentDetailsWebPartProps> {
   public render(): void {
    const element: React.ReactElement<ISpComponentDetailsProps > = React.createElement(
      SpComponentDetails,
      {
        inventoryListName: this.properties.inventoryListName,
        artifactsListName: this.properties.artifactsListName,
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
               PropertyPaneTextField('inventoryListName', {
                  label: strings.InventoryListNameFieldLabel
                }),
                PropertyPaneTextField('artifactsListName', {
                  label: strings.ArtifactsListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
