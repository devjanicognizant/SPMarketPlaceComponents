import { IListServce } from "../../commonServices/IListService";
export interface IIconBasedNavigationProps {
    iconListName: string;
    defaultImgUrl: string;
    siteurl: string;
    listService: IListServce;
    inventoryListName: string;
}
