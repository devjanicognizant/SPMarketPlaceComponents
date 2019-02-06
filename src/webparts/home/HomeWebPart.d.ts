import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface IHomeWebPartProps {
    sourceList: string;
    imageColumnName: string;
    titleColumnName: string;
    filterColumnName: string;
    orderBy: string;
    isAsending: boolean;
    selectTop: string;
    showCategoryFilter: boolean;
    showLatestFilter: boolean;
    redirectURL: string;
}
export default class HomeWebPart extends BaseClientSideWebPart<IHomeWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
