import { ListItem } from "../services/ListItem";
export interface IHomeState {
    listItems: Array<ListItem>;
    selectedFilter: string;
    selectedOrderBy: string;
    latestLnkCssClass: string;
    likeLnkCssClass: string;
}
