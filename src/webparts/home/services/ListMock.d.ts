import { ListItem } from "./ListItem";
import { IListServce } from "./IListService";
export declare class ListMock implements IListServce {
    /**
     * This method fetch and return dataset from sharepoint list using PNP
     */
    getAll(options: any): Promise<Array<ListItem>>;
    getCurrentUserDetails(): Promise<any>;
    updateListItem(listTitle: string, itemId: number, itemInformation: any): Promise<void>;
    setLikes(listTitle: any, itemId: any, likedByUsers: any[], likesCount: any, currentUserId: any): any;
    setFavourites(listTitle: string, itemId: number, favouritesAssociates: any[], currentUserId: any): any;
}
