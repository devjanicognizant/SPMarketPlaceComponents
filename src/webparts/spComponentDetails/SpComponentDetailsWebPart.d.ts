import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface ISpComponentDetailsWebPartProps {
    inventoryListName: string;
    artifactsListName: string;
    activeFavouriteImgUrl: string;
    inactiveFavouriteImgUrl: string;
    activeLikeImgUrl: string;
    inactiveLikeImgUrl: string;
}
export default class SpComponentDetailsWebPart extends BaseClientSideWebPart<ISpComponentDetailsWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
