import { IListServce } from "../../commonServices/IListService";
import { IHomeWebPartProps } from "../HomeWebPart";
/*
 * Interface declaration of swiper properties
 */
export interface IHomeProps {
  listService: IListServce;
  swiperOptions: IHomeWebPartProps;  
  siteUrl: string;
}
