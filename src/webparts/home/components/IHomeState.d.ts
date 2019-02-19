import { ListItem } from "../../commonServices/ListItem";
export interface IHomeState {
    listItems: Array<ListItem>;
    selectedFilter: string;
    selectedOrderBy: string;
    latestLnkCssClass: string;
    likeLnkCssClass: string;
    currentUser: any;
}
