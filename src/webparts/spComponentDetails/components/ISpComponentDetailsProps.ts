import { IListServce } from "../../commonServices/IListService";

export interface ISpComponentDetailsProps {
  inventoryListName: string;
  artifactsListName: string;
  activeFavouriteImgUrl: string;
  inactiveFavouriteImgUrl: string;
  activeLikeImgUrl: string;
  inactiveLikeImgUrl: string;
  siteurl: string;
  listService: IListServce;
}
