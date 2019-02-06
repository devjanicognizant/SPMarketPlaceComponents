/// <reference types="react" />
import * as React from 'react';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
export interface ISpComponentDetailsState {
    artifacts: any[];
    item: {
        "ComponentTitle": "";
        "ComponentDescription": "";
        "ComponentDescriptionContent": {
            __html: "";
        };
        "ShortDescription": "";
        "ComponentImage": {
            "Description": "";
            "Url": "";
        };
        "DemoUrl": {
            "Description": "";
            "Url": "";
        };
        "ComponentLimitations": "";
        "ComponentOwner": any;
        "ArtifactsLocation": {
            "Description": "";
            "Url": "";
        };
        "ComponentFeatures": any[];
        "FavoriteAssociates": "";
        "LikedById": any[];
        "LikesCount": number;
    };
    currentUser: {
        "Id": number;
        "Email": string;
        "LoginName": string;
        "Title": string;
    };
    componentOwnerDetails: any;
    inventoryListId: string;
}
export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
    constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState);
    private id;
    componentDidMount(): void;
    private renderDemoLink();
    private renderArtifacts();
    private getCurrentUserDetails();
    private getInventoryListId();
    private getCompOwnerDetails(ownerId);
    private renderFavouriteImage();
    private renderLike();
    render(): React.ReactElement<ISpComponentDetailsProps>;
}
