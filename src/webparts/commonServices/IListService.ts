
import { ListItem } from "./ListItem";
/**
 * Function declaration
 * This getAll function will return Array of List Items.
 */
export interface IListServce {
    getAll(options): Promise<Array<ListItem>>;
    getCurrentUserDetails(): Promise<any>;
    setLikes(listTitle,itemIany,likedByUsers,likesCount, currentUserId):Promise<any>;
    setFavourites(listTitle:string,itemId:number,favouritesAssociates:string, currentUserId: any):any;
    setDownload(listTitle:string,itemId:number,downloadAssociates:string, downloadCount:Number, currentUserId: any):any;
    getAllRefByCategory(options): Promise<Array<ListItem>>;
    setViewCount(listTitle:string,listId:string,itemId:number,viewCount:number, currentUserId: any):any;
}