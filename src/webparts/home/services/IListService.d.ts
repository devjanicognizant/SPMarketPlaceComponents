import { ListItem } from "./ListItem";
/**
 * Function declaration
 * This getAll function will return Array of List Items.
 */
export interface IListServce {
    getAll(options: any): Promise<Array<ListItem>>;
}
