import { ListItem } from "./ListItem";
/**
 * Function declaration
 * This getAll function will return Array of List Items.
 */
export interface IListServce {
    getAll(options: any): Promise<Array<ListItem>>;
    getCurrentUserDetails(): Promise<any>;
    setLikes(listTitle: any, itemIany: any, likedByUsers: any, likesCount: any, currentUserId: any): Promise<any>;
    setFavourites(listTitle: string, itemId: number, favouritesAssociates: any[], currentUserId: any): any;
    getAllRefByCategory(options: any): Promise<Array<ListItem>>;
}
