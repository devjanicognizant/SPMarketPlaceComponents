import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface IIconBasedNavigationWebPartProps {
    iconListName: string;
    defaultImgUrl: string;
}
export default class IconBasedNavigationWebPart extends BaseClientSideWebPart<IIconBasedNavigationWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
