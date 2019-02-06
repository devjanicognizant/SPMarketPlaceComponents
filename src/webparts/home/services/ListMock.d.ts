import { ListItem } from "./ListItem";
import { IListServce } from "./IListService";
export declare class ListMock implements IListServce {
    /**
     * This method fetch and return dataset from sharepoint list using PNP
     */
    getAll(options: any): Promise<Array<ListItem>>;
}
