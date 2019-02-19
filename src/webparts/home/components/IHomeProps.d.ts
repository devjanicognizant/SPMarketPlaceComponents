import { IListServce } from "../../commonServices/IListService";
import { IHomeWebPartProps } from "../HomeWebPart";
export interface IHomeProps {
    listService: IListServce;
    swiperOptions: IHomeWebPartProps;
    siteUrl: string;
}
