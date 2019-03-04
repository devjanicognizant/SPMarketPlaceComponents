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
import { ListMock } from '../commonServices/ListMock';

// Interface representing webpart properties
export interface ISpComponentDetailsWebPartProps {
  inventoryListName:string;
  artifactsListName:string;
  activeFavouriteImgUrl:string;
  inactiveFavouriteImgUrl:string;
  activeLikeImgUrl: string;
  inactiveLikeImgUrl: string;
}

export default class SpComponentDetailsWebPart extends BaseClientSideWebPart<ISpComponentDetailsWebPartProps> {
   public render(): void {
    const element: React.ReactElement<ISpComponentDetailsProps > = React.createElement(
      SpComponentDetails,
      {
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
        siteurl: this.context.pageContext.web.absoluteUrl,
        listService: new ListMock()
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
  }
}
