import { ListItem } from "./ListItem";
import { IListServce } from "./IListService";
import pnp from "sp-pnp-js";
import LogManager from '../LogManager';

export class ListMock implements IListServce {

    /**
     * This method fetch and return dataset from sharepoint list using PNP 
     */    
    public getAll(options): Promise<Array<ListItem>> {
        //Logger.subscribe(new ConsoleListener());
      return new Promise<Array<ListItem>>((resolve:any) => { 
            const data: Array<ListItem>  = [];        
            pnp.sp.web.lists.getByTitle(options.sourceList).items
            .filter("ComponentStatus eq 'Active'")
            .select("ID",options.titleColumnName,options.imageColumnName,'Modified',"ComponentCategory/Title",'LikesCount','ShortDescription', "LikedBy/Id", "LikedById")
            .expand("ComponentCategory", "LikedBy")
            .orderBy(options.orderBy,options.isAsending)            
            .get().then( r => 
            {                                     
                    for(let i=0;i<r.length;i++){
                        data.push({id:r[i].ID,title:r[i][options.titleColumnName],modified:r[i].Modified,imageUrl:r[i][options.imageColumnName].Url,componentCategory:(r[i]["ComponentCategory"]).Title,likesCount:r[i].LikesCount,shortDescription:r[i].ShortDescription,likedById:r[i].LikedById});       
                    }                              
                    resolve(data);                        
            })
            .catch((e)=> {      
                LogManager.logException(e,"Error occured while fetching data from sharepoint list.","getAll","ListMock");                              
            });  
            });   
    }

    public getAllRefByCategory(sourceList): Promise<Array<ListItem>> {
        //Logger.subscribe(new ConsoleListener());
      return new Promise<Array<ListItem>>((resolve:any) => { 
            const data: Array<ListItem>  = [];        
            pnp.sp.web.lists.getByTitle(sourceList).items
            .filter("ComponentStatus eq 'Active'")
            .select("ID","ComponentCategory/Title")
            .expand("ComponentCategory")      
            .get().then( r => 
            {                                     
                    for(let i=0;i<r.length;i++){
                        data.push({id:r[i].ID,title:"",modified:"",imageUrl:"",componentCategory:(r[i]["ComponentCategory"]).Title,likesCount:"",shortDescription:"",likedById:[]});       
                    }                              
                    resolve(data);                        
            })
            .catch((e)=> {      
                LogManager.logException(e,"Error occured while fetching data from sharepoint list.","getAllRefByCategory","ListMock");                              
            });  
            });   
    }
     // Make a service call to get the user details
    public getCurrentUserDetails() {
        return new Promise<any>((resolve:any) => { 
            pnp.sp.web.currentUser.get().then((user) => {
                resolve(user);
            })
            .catch((error) => {
            LogManager.logException(error
                , "Error occured while fetching current user details."
                , "ListMock"
                , "getCurrentUserDetails");
            });
        });
    }
    public async updateListItem(listTitle:string,itemId:number,itemInformation:any)
    {
        let list = pnp.sp.web.lists.getByTitle(listTitle);
        await list.items.getById(itemId)
        .update(itemInformation)
        .then(i => {console.log(i);})
        .catch((error)=>{console.log(error)})
    }

    public setLikes(listTitle:any,itemId:any,likedByUsers:any[],likesCount:any, currentUserId: any):any
    {
         return new Promise<any>((resolve:any) => { 
            let newLikedBy:any[]=[];

            if(likedByUsers != undefined && likedByUsers.filter(a=> a == currentUserId).length >0)
            { 
                newLikedBy=likedByUsers.filter( a => a != currentUserId)
                likesCount=(likesCount != null && likesCount >0)?likesCount-1:0;
            }
            else
            {
                newLikedBy=(likedByUsers != undefined)?likedByUsers:[]
                newLikedBy.push(currentUserId)
                likesCount=(likesCount != null && likesCount >0)?likesCount+1:1;
            }
            let itemInformation=
            {
                LikedById:{results:newLikedBy},
                LikesCount:likesCount
            };
            this.updateListItem(listTitle,itemId,itemInformation);
            resolve(itemInformation);
         });
    } 

    public setFavourites(listTitle:string,itemId:number,favouritesAssociates:any[], currentUserId: any):any
    {
        let newfavouriteAssociates:any[]=[];
        if(favouritesAssociates != undefined && favouritesAssociates.filter(a=> a == currentUserId).length >0)
        { 
            newfavouriteAssociates=newfavouriteAssociates.filter(a => a != currentUserId)
        }
        else
        {
            newfavouriteAssociates=(newfavouriteAssociates != undefined)?newfavouriteAssociates:[]
            newfavouriteAssociates.push(currentUserId)
        }
        let itemInformation=
        { 
            FavouritesAssociates:newfavouriteAssociates.toString()
        };
        this.updateListItem(listTitle,itemId,itemInformation);
        return itemInformation;
    } 
  }

  