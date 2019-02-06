import { ListItem } from "./ListItem";
import { IListServce } from "./IListService";
import pnp from "sp-pnp-js";
import LogManager from '../../LogManager';

export class ListMock implements IListServce {

    /**
     * This method fetch and return dataset from sharepoint list using PNP 
     */    
    public getAll(options): Promise<Array<ListItem>> {
        //Logger.subscribe(new ConsoleListener());
      return new Promise<Array<ListItem>>((resolve:any) => { 
            const sliderdata: Array<ListItem>  = [
            ];        
            pnp.sp.web.lists.getByTitle(options.sourceList).items
            .filter("ComponentStatus eq 'Approved'")
            .select("ID",options.titleColumnName,options.imageColumnName,'Modified',"ComponentCategory0/Title",'LikesCount')
            .expand("ComponentCategory0")
            .orderBy(options.orderBy,options.isAsending)            
            .get().then( r => 
            {                                     
                    for(let i=0;i<r.length;i++){
                        sliderdata.push({id:r[i].ID,title:r[i][options.titleColumnName],modified:r[i].Modified,imageUrl:r[i][options.imageColumnName].Url,componentCategory:(r[i]["ComponentCategory0"]).Title,likesCount:r[i].LikesCount});       
                    }                              
                    resolve(sliderdata);                        
            })
            .catch((e)=> {      
                LogManager.logException(e,"Error occured while fetching data from sharepoint list.","getAll","ListMock");                              
            });  
            });   
    }
}
  