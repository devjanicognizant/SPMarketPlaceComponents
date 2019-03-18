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
        // Get the inventory list id and put it into state
    public getListId(listTitle:string){
       let list = pnp.sp.web.lists.getByTitle(listTitle);
       list.get().then((list) =>{
           return list.Id;
       });
        // return new Promise<string>((resolve:any) => { 
        //     pnp.sp.web.lists.getByTitle(listTitle).get().then((list) => {
        //         resolve(list.Id);
        //     })
        //     .catch((error) => {
        //     LogManager.logException(error
        //         , "Error occured while fetching list title by id for list:"+listTitle
        //         , "ListMock"
        //         , "getListId");
        //     });
        // });
    }
    public setDownload(listTitle:string, itemId:number, downloadAssociates:string, downloadCount:Number, currentUserId: any):any
    {
       // let listId:any = this.getListId(listTitle);
       return new Promise<any>((resolve:any) => { 
         let list = pnp.sp.web.lists.getByTitle(listTitle);
        list.get().then((list) =>{
            let listId:any = list.Id;
            
                let itemInformation=
                { 
                    DownloadAssociates: downloadAssociates,
                    DownloadCount: downloadCount
                };
                if(downloadAssociates == undefined || downloadAssociates.indexOf(currentUserId) ==-1)
                { 
                    let newDownloadAssociates:string=downloadAssociates.trim()+" "+currentUserId;
                    let newDownloadCount = newDownloadAssociates.trim().split(" ").length;
                    itemInformation=
                    { 
                        DownloadAssociates: newDownloadAssociates,
                        DownloadCount: newDownloadCount
                    };
                    this.updateListItem(listTitle,itemId,itemInformation);
                    // var downloadObj;
                    // if(localStorage["CognizantCDBMP.downloads"] === undefined){
                    //     downloadObj = {"userID":currentUserId, "downloadID":[{"id":itemId.toString()}]};        
                    // }
                    // else{
                    //     downloadObj = JSON.parse(localStorage["CognizantCDBMP.downloads"]);
                    //     if(downloadObj.userID === currentUserId){
                    //         downloadObj.downloadID.push({"id":itemId.toString()});
                    //     }else{
                    //         downloadObj = {"userID":currentUserId, "downloadID":[{"id":itemId.toString()}]};
                    //     }
                    // }
            
                    // localStorage["CognizantCDBMP.downloads"] = JSON.stringify(downloadObj);
                    this.addToLocalStorage(itemId.toString(), listId , currentUserId, "CognizantCDBMP.downloads", "downloadID","download");
                }

                resolve(itemInformation);
            });
         });
    } 

    public addToLocalStorage(itemId:string, listId: string, currentUserId: string, dictName: string, keyName:string, mode:string):void
    {
        var storageObj;
        var newRecord = false;
        switch(mode)
        {
            case "download": 
                if(localStorage[dictName] === undefined || localStorage[dictName].downloadID === undefined ){
                    storageObj = {"userID":currentUserId, "downloadID":[{"id":itemId, "list":listId}]}; 
                    newRecord = true;
                    break;
                }
            case "favourite": 
                if(localStorage[dictName] === undefined || localStorage[dictName].favID === undefined ){
                    storageObj = {"userID":currentUserId, "favID":[{"id":itemId, "list":listId}]};
                    newRecord = true;
                    break;
                }
            case "like": 
                if(localStorage[dictName] === undefined || localStorage[dictName].likeID === undefined ){
                    storageObj = {"userID":currentUserId, "likeID":[{"id":itemId, "list":listId}]};
                    newRecord = true;  
                    break;
                }
        }
        
        if(!newRecord){
            storageObj = JSON.parse(localStorage[dictName]);
            if(storageObj.userID === currentUserId){
                switch(mode)
                {
                    case "download": 
                        storageObj.downloadID.push({"id":itemId, "list":listId});
                        break;
                    case "favourite": 
                        storageObj.favID.push({"id":itemId, "list":listId});
                        break;
                    case "like": 
                        storageObj.likeID.push({"id":itemId, "list":listId});
                        break;
                }
                //storageObj.keyName.push({"id":itemId.toString(), "list":listId});
               
            }
            // else{
            //     storageObj = {"userID":currentUserId, keyName:[{"id":itemId.toString(), "list":listId}]};
            // }
        }
    
        localStorage[dictName] = JSON.stringify(storageObj);

    }
    public removeFromLocalStorage(itemId:string, listId: string, currentUserId: string, dictName: string, keyName:string, mode: string):void
    {
        if(localStorage[dictName] !== undefined){
            var storageObj;
            storageObj = JSON.parse(localStorage[dictName]);
            if(storageObj.userID === currentUserId){
                switch(mode)
                {
                    case "download": 
                        if(storageObj.downloadID !== undefined ){
                            storageObj.downloadID = storageObj.downloadID.filter( a => (a.id != itemId && a.listId != listId));
                        }
                        break;
                    case "favourite": 
                        if(storageObj.favID !== undefined ){
                            storageObj.favID = storageObj.favID.filter( a => (a.id != itemId && a.listId != listId));
                        }
                        break;
                    case "like": 
                        if(storageObj.likeID !== undefined ){
                            storageObj.likeID = storageObj.likeID.filter( a => (a.id != itemId && a.listId != listId));
                        }
                        break;
                }
                //storageObj.keyName = storageObj.keyName.filter( a => (a.id != itemId.toString() && a.listId != listId));
            }
            localStorage[dictName] = JSON.stringify(storageObj);
        }
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

    public setFavourites(listTitle:string,itemId:number,favouritesAssociates:string, currentUserId: any):any
    {
       
        return new Promise<any>((resolve:any) => { 
            let list = pnp.sp.web.lists.getByTitle(listTitle);
            list.get().then((list) =>{
                let listId:string = list.Id;
                let newfavouriteAssociates:string="";
                var add = false;
                var remove = false;
                if(favouritesAssociates != undefined && favouritesAssociates.indexOf(currentUserId) !=-1)
                { 
                    newfavouriteAssociates=favouritesAssociates.replace(currentUserId,"");
                    remove = true;
                }
                else
                {
                    add = true;
                    newfavouriteAssociates=favouritesAssociates+" "+currentUserId;
                }
                let itemInformation=
                { 
                    FavoriteAssociates:newfavouriteAssociates
                };
                this.updateListItem(listTitle,itemId,itemInformation);
                // var favObj;
                // if(add){
                //     if(localStorage["CognizantCDBMP.favorites"] === undefined){
                //         favObj = {"userID":currentUserId, "favID":[{"id":itemId.toString()}]};        
                //     }
                //     else{
                //         favObj = JSON.parse(localStorage["CognizantCDBMP.favorites"]);
                //         if(favObj.userID === currentUserId){
                //             favObj.favID.push({"id":itemId.toString()});
                //         }else{
                //             favObj = {"userID":currentUserId, "favID":[{"id":itemId.toString()}]};
                //         }
                //     }
                
                // }
                // if(remove && localStorage["CognizantCDBMP.favorites"] !== undefined){
                //     favObj = JSON.parse(localStorage["CognizantCDBMP.favorites"]);
                //      if(favObj.userID === currentUserId){
                //          favObj.favID = favObj.favID.filter( a => a.id != itemId.toString())
                //      }
                // }
                // localStorage["CognizantCDBMP.favorites"] = JSON.stringify(favObj);
                if(add){
                    this.addToLocalStorage(itemId.toString(), listId , currentUserId, "CognizantCDBMP.favorites", "favID","favourite");
                }
                if(remove && localStorage["CognizantCDBMP.favorites"] !== undefined){
                    this.removeFromLocalStorage(itemId.toString(), listId , currentUserId, "CognizantCDBMP.favorites", "favID","favourite");
                }
            
                resolve(itemInformation);
            });
          });
    } 
  }

  