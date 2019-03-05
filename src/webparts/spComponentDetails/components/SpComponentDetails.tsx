import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Item } from 'sp-pnp-js';
import {  UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import LogManager from '../../LogManager';
import Moment from 'react-moment';
import { ListItem } from '../../commonServices/ListItem';


// Interface representing the state of component details webpart
export interface ISpComponentDetailsState {
  // Artifact documents
  artifacts: any[];
  // Component item
  item: {
    "ComponentTitle": "",
    "ComponentDescription": "",
    "ComponentDescriptionContent": { __html: "" },
    "ShortDescription": "",
    "ComponentImage": { "Description": "", "Url": "" },
    "DemoUrl": { "Description": "", "Url": "" },
    "ComponentLimitations": "",
    "ComponentOwner": any[],
    "ArtifactsLocation": { "Description": "", "Url": "" },
    "ComponentFeatures": any[],
    "TechnologyStack":any[],
    "FavoriteAssociates": "",
    "LikedById": any[],
    "LikesCount": number,
    "Created":any,
    "ComponentCategory":any,
    "ComponentSubCategory":any
  };
  // Hold current user details
  currentUser: {
    "Id": number,
    "Email": string,
    "LoginName": string,
    "Title": string,
    "UserPrincipalName": string
  };
  // Component owner details - required for fetching the email id
  componentOwnerDetails:any[];

  // Inventory list Guid
  inventoryListId: string;
  id:string;
}
// React enabled component class implementing property and state interfaces
export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState) {
    super(props);
    // Initialize the state
    this.state = {
      artifacts: [],
      item: {
        "ComponentTitle": "",
        "ComponentDescription": "",
        "ComponentDescriptionContent": { __html: "" },
        "ShortDescription": "",
        "ComponentImage": { "Description": "", "Url": "" },
        "DemoUrl": { "Description": "", "Url": "" },
        "ComponentLimitations": "",
        "ComponentOwner": [{}],
        "ArtifactsLocation": { "Description": "", "Url": "" },
        "ComponentFeatures": [],
        "TechnologyStack":[],
        "FavoriteAssociates": "",
        "LikedById": [],
        "LikesCount": 0,
        "Created":new Date(),
        "ComponentCategory":"",
        "ComponentSubCategory":""
      },
      currentUser: {
        "Id": 0,
        "Email": "",
        "LoginName": "",
        "Title": "",
        "UserPrincipalName": ""
      },
      componentOwnerDetails:[{"Title":"","Email":""}],
      inventoryListId:"",
      id:""
    };
  }
  // To store the component id coming from query string
 // private id: string;
  // Fetch the component details
  // Fetch the current user details
  // Fetch the component document set as well as artifact files
  public componentDidMount() {
    var reactHandler = this;
    // Get the siteurl from property
    var siteUrl = this.props.siteurl;
    // Get list names from properties
    var artifactListName = this.props.artifactsListName;
    var inventoryList = this.props.inventoryListName;

    // Get the user details
    this.getCurrentUserDetails();

    // Get the inventory list Id and put it into state
    this.getInventoryListId();

    // Get component id from query string
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    var id = queryParameters.getValue("ComponentID");
    //id="55";
    console.log(id);
    this.setState({id: id});
    // Service call to fetch the component details by component id
    pnp.sp.web.lists.getByTitle(inventoryList).items
      .getById(Number(id))
      .expand("ComponentOwner", "ComponentFeatures", "ComponentFeatures", "TechnologyStack", "LikedBy","ComponentCategory","ComponentSubCategory")
      .select("ComponentTitle"
        , "ComponentDescription"
        , "ShortDescription"
        , "ComponentImage"
        , "DemoUrl"
        , "ComponentLimitations"
        , "ComponentOwner/Title", "ComponentOwner/UserName", "ComponentOwner/Id"
        , "ArtifactsLocation"
        , "ComponentFeatures/Title"
        , "TechnologyStack/Title"
        , "FavoriteAssociates"
        , "LikedBy/Id", "LikedById", "LikesCount"
        , "Created"
        , "ComponentCategory/Title"
        , "ComponentSubCategory/Title")
      .get()
      .then((data: any) => {
         console.log(data);
        if(data.ComponentOwner != null){
          data.ComponentOwner.map((d,id)=>{
            this.getCompOwnerDetails(d.Id);
          });
        }
        // When anyone is yet to like the component, LikesCount comes as null. 
        // Set it as 0 in case it is null
        if (data.LikesCount == null) {
          data.LikesCount = 0;
        }
        data.ComponentDescriptionContent = { __html: data.ComponentDescription };
       // data.TechnologyStack = data.TechnologyStack;
        reactHandler.setState({
          // Assign returned list item data to state
          item: data
        });
        console.log(data);
        // Service call Get artifact document set for the component
        pnp.sp.web.lists.getByTitle(artifactListName).items
          .expand("Folder", "Folder/ComponentID", "Folder/ComponentID/Id")
          .filter(`ComponentID/Id eq ` + this.state.id)
          .get()
          .then((folders: any[]) => {
            if (folders.length > 0) {
              // Get the folder relative url for the document set
              var artifactLocationRelativeUrl = folders[0].Folder.ServerRelativeUrl;
              // Service call to fetch the files from the document set
              pnp.sp.web.getFolderByServerRelativeUrl(artifactLocationRelativeUrl).files.get()
                .then((documents: any[]) => {
                  reactHandler.setState({
                    // Assign returned files to state
                    artifacts: documents
                  });
                })
                .catch((error) => {
                  LogManager.logException(error
                    , "Error occured while fetching component artifact files from document set"
                    , "Cpmponent Details"
                    , "componentDidMount");
                });
            }
          })
          .catch((error) => {
            LogManager.logException(error
              , "Error occured while fetching component artifact document set."
              , "Cpmponent Details"
              , "componentDidMount");
          });
      })
      .catch((error) => {
        LogManager.logException(error
          , "Error occured while fetching component item details."
          , "Cpmponent Details"
          , "componentDidMount");
      });
  }

  // Check the demo link is set or not
  // If demo link is not set, show message on the page, set show the demo link
  private renderDemoLink() {
    if (this.state.item.DemoUrl != null) {
      // Show demo link
      return (
					<a  target="_blank" href={this.state.item.DemoUrl.Url} className="col-md-12 btn btn-default"><i className="fa fa-chevron-right" aria-hidden="true"></i>&nbsp;View Component Demo</a>
        // <button className="col-md-12 btn btn-default"><i className="fa fa-chevron-right" aria-hidden="true"></i><a target="_blank" href={this.state.item.DemoUrl.Url} className={styles.link}>View Component Demo</a></button>
      );
    }
    else {
      // Show message
      return (
        <a><label>No Demo available</label></a>
      );
    }
  }

  // Check the artifact files are available or not
  // If artifacts are not available, show some message, else show the files as listed elements
  private renderArtifacts() {
    if (this.state.artifacts != null && this.state.artifacts.length > 0) {
      // Build the markup for document links
      var artifactMarkup =
        this.state.artifacts.map((d, idx) => {
          return (<a href={d.ServerRelativeUrl}>{d.Name}</a>);
        });
      return (artifactMarkup);
    }
    else {
      // Show message
      return (
       <a>No resource file available</a>
      );
    }
  }

  // Make a service call to get the user details
  private getCurrentUserDetails() {
    var reactHandler = this;
    pnp.sp.web.currentUser.get().then((user) => {
      reactHandler.setState({
        // Set the returned user object to state
        currentUser: user
      });
    })
    .catch((error) => {
      LogManager.logException(error
        , "Error occured while fetching current user details."
        , "Cpmponent Details"
        , "getCurrentUserDetails");
    });
  }

  // Get the inventory list id and put it into state
  private getInventoryListId(){
    let list = pnp.sp.web.lists.getByTitle(this.props.inventoryListName);
    var reactHandler = this;
      list.get().then(l => {
         reactHandler.setState({
            // Set the list id to state object
            inventoryListId: l.Id
          });
        })
        .catch((error) => {
            LogManager.logException(error
              , "Error occured while fetching component inventory list Id"
              , "Component Details"
              , "getInventoryListId");
          });
  }

   // Make a service call to get component owner details by Id
   private getCompOwnerDetails(ownerId) {
    var reactHandler = this;
    pnp.sp.web.siteUsers.getById(ownerId).get().then(function(user) {
      pnp.sp.profiles.getPropertiesFor(user.LoginName).then(function(result) {
          console.log(result);
          var userProfle = result.UserProfileProperties;
          var owner:any = {};
          owner.Title = userProfle.filter((e) => e.Key === "LastName")[0].Value+", "+userProfle.filter((e) => e.Key === "FirstName")[0].Value;
          owner.Designation = userProfle.filter((e) => e.Key === "Title")[0].Value;
          owner.Department = userProfle.filter((e) => e.Key === "Department")[0].Value;
          owner.Email = result.Email;

          reactHandler.state.componentOwnerDetails.push(owner);
              console.log(reactHandler.state.componentOwnerDetails);
              if(reactHandler.state.componentOwnerDetails.length>= reactHandler.state.item.ComponentOwner.length){
                var compOwners = reactHandler.state.componentOwnerDetails;
                reactHandler.setState({
                  // Set the returned user object to state
                  componentOwnerDetails : compOwners
                });
              }
        })
        .catch((error) => {
          LogManager.logException(error
            , "Error occured while fetching component owner details."
            , "Cpmponent Details"
            , "getCompOwnerDetails");
        });
    })
    .catch((error) => {
        LogManager.logException(error
          , "Error occured while fetching component owner details."
          , "Cpmponent Details"
          , "getCompOwnerDetails");
      });





    // pnp.sp.web.siteUsers.getById(ownerId).get().then(function(result) {
    //   console.log("owner detail");
    //   console.log(result);
    //   pnp.sp.profiles.myProperties.get().then(function(result) {
    //     var props = result.UserProfileProperties;
    //     console.log(props);
    //   });
    //   pnp.sp.profiles.getPropertiesFor(result.LoginName).then(function(desigResult) {
    //     console.log(desigResult);
    //     result.Designation = desigResult.UserProfileProperties.Title;
    //     reactHandler.state.componentOwnerDetails.push(result);
    //         console.log(reactHandler.state.componentOwnerDetails);
    //         if(reactHandler.state.componentOwnerDetails.length>= reactHandler.state.item.ComponentOwner.length){
    //           var compOwners = reactHandler.state.componentOwnerDetails;
    //           reactHandler.setState({
    //             // Set the returned user object to state
    //             componentOwnerDetails : compOwners
    //           });
    //         }
    //   });
    // })
    // .catch((error) => {
    //   LogManager.logException(error
    //     , "Error occured while fetching component owner details."
    //     , "Cpmponent Details"
    //     , "getCompOwnerDetails");
    // });
  }

  /*// Return different markup when user has already set the component as favourite
  // and different markup when user is yet to set it as favourite
  private renderFavouriteImage() {
    // Get user's login name without membership detials part
    var userLoginName = this.state.currentUser.LoginName.split(/[| ]+/).pop();
    // Determine the favourite image url
    var siteUrl = this.props.siteurl;
    var favActiveImgUrl = siteUrl + this.props.activeFavouriteImgUrl;
    var favInactiveImgUrl = siteUrl + this.props.inactiveFavouriteImgUrl;

    if (this.state.item.FavoriteAssociates != null && this.state.item.FavoriteAssociates.toLowerCase().indexOf(userLoginName) != -1) {
      // Markup if user has already set the component as favourite
      return (
        <p className="rcornerDisabled" id="pFavInactive">
          <span className={styles.topAlign}>Add to favourite </span>
          <img id="imgFav"
            src= {favInactiveImgUrl}>
          </img>
        </p>
      );
    }
    else {
      if(this.state.inventoryListId != ""){
         // Markup if user is yet to set the component as favourite
          return (
            <p className="rcorner" id="pFavActive">
              <span className={styles.topAlign}>Add to favourite </span>
              <a href={"javascript:CognizantCDBMP.addToFavorite('" + this.state.id + "', 'imgFav','" + this.state.inventoryListId + "');"}>
                <img id="imgFav"
                  src={favActiveImgUrl}></img>
              </a>
            </p>
          );
      }
      else  return (
        <p className="rcornerDisabled" id="pFavInactive">
          ERROR!!
        </p>
      );
      
      }
  }*/

  // Return different markup when user has already likes the component
  // and different markup when user is yet to like the component
  private renderLike() {
     // Determine like image url
     var siteUrl = this.props.siteurl;
     var likeActiveImgUrl = siteUrl +"/siteassets/images/like-red.png";
     var likeInactiveImgUrl = siteUrl +"/siteassets/images/unlike-red.png";

    // Initially hide both like and unlike divs
    var likeClass = "hide";
    var unlikeClass = "hide";
    // Set the css class based on the status whether user liked the component or not
    if (this.state.item.LikedById != null
      && this.state.item.LikedById.indexOf(this.state.currentUser.Id) != -1) {
      unlikeClass = "show";
      
    }
    else {
      likeClass = "show";
    }
    // Build the markup applying appropriate css classes
    // Call javascript method on icon click event to like or unlike the component
    // Put a common area to show no of likes for the coponent
    return (
      <div className="item-content-like-symbol">
        <div className={likeClass} id={"divLike"}>
          <a href="#" onClick={this.onSetLike.bind(this)}>
            <img src={likeActiveImgUrl} id="like-red" />
          </a>
        </div>
        <div className={unlikeClass} id={"divUnlike"}>
          <a href="#" onClick={this.onSetLike.bind(this)}>
            <img src={likeInactiveImgUrl} id="unlike-red" />
          </a>
        </div>
      </div>
    );
  }

   public onSetLike = (): void => {
    // _items[index].likesCount = _items[index].likesCount +1;
    //  this.setState({ listItems: _items});
    //this._LoadFavourites(this.state.selectedOrderBy);
    console.log("fired like!")
    var likedBy = (this.state.item.LikedById != null)?this.state.item.LikedById:[];
    this.props.listService.setLikes(this.props.inventoryListName,this.state.id, this.state.item.LikedById, this.state.item.LikesCount, this.state.currentUser.Id).then((result: any) => {
      this.state.item.LikedById = (result.LikedById != null && result.LikedById.results != null)?result.LikedById.results:result.LikedById;
      this.state.item.LikesCount = result.LikesCount;
      this.setState({item:this.state.item});
    });
  };

  /*// Return different markup when user has already likes the component
  // and different markup when user is yet to like the componen           t
  private renderLike() {
     // Determine like image url
     var siteUrl = this.props.siteurl;
     var likeActiveImgUrl = siteUrl + this.props.activeLikeImgUrl;
     var likeInactiveImgUrl = siteUrl + this.props.inactiveLikeImgUrl;

    // Initially hide both like and unlike divs
    var likeClass = "hide";
    var unlikeClass = "hide";
    // Set the css class based on the status whether user liked the component or not
    if (this.state.item.LikedById != null
      && this.state.item.LikedById.indexOf(this.state.currentUser.Id) != -1) {
      unlikeClass = "show";
    }
    else {
      likeClass = "show";
    }
    // Build the markup applying appropriate css classes
    // Call javascript method on icon click event to like or unlike the component
    // Put a common area to show no of likes for the coponent
    return (
      <div>
        <p id="pLike" className={[likeClass, styles.rcorner].join(" ")}>
          <span className={styles.topAlign}>Like it! </span>
          <a href={"javascript:SetLike(true,'" + this.props.inventoryListName + "'," + this.id + ")"}>
            <img id="imgLike" className={styles.imgIcon}
              src={likeActiveImgUrl}></img>
          </a>
          <span className={styles.topAlign}> (</span><span className={[styles.topAlign, "likeCount"].join(" ")} id="likeCountForLike">{this.state.item.LikesCount}</span><span className={styles.topAlign}>)</span>
        </p>
        <p id="pUnlike" className={[unlikeClass, styles.rcorner].join(" ")}>
          <span className={styles.topAlign}>Unlike it! </span>
          <a href={"javascript:SetLike(false,'" + this.props.inventoryListName + "'," + this.id + ")"}>
            <img id="imgLike" className={styles.imgIcon}
              src={likeInactiveImgUrl}></img>
          </a>
          <span className={styles.topAlign}> (</span><span className={[styles.topAlign, "likeCount"].join(" ")} id="likeCountForUnlike">{this.state.item.LikesCount}</span><span className={styles.topAlign}>)</span>
        </p>
      </div>
    );
  }*/

   // Return different markup when user has already likes the component
  // and different markup when user is yet to like the component
  private renderFavourite() {
     // Determine fav image url
     var siteUrl = this.props.siteurl;
    // var favActiveImgUrl = siteUrl +"/siteassets/images/fav-red.png";
    var favImgUrl = siteUrl +"/Style%20Library/Images/if_Star%20On_58612.png?csf=1";
    var unFavImgUrl =  siteUrl +"/siteassets/images/unlike-red.png";

    // Initially hide both fav and unfav divs
    var favClass = "hide";
    var unfavClass = "hide";
    // Set the css class based on the status whether user favd the component or not
    if (this.state.item.FavoriteAssociates != null
      && this.state.item.FavoriteAssociates.indexOf(this.state.currentUser.UserPrincipalName) != -1) {
      unfavClass = "show";
       return(<img src={favImgUrl}  className="fav-image" onClick={this.onSetFavourite.bind(this)}/>)
      
    }
    else {
      favClass = "show";
      return(<span className="starIcon" onClick={this.onSetFavourite.bind(this)}></span>)
                 {/*<img src={unFavImgUrl} />*/}
    }
    // Build the markup applying appropriate css classes
    // Call javascript method on icon click event to fav or unfav the component
    // Put a common area to show no of favs for the coponent
    /*return (
      <div>
        <div className={favClass} id={"divfav"}>
          <a href="#" onClick={this.onSetFavourite.bind(this)}>
           <span className="starIcon"></span>

          </a>
        </div>
        <div className={unfavClass} id={"divUnfav"}>
          <a href="#" onClick={this.onSetFavourite.bind(this)}>
            <img src={favImgUrl}  className="fav-image"/>
          </a>
        </div>
      </div>
    );*/
  }

   public onSetFavourite = (): void => {
    // _items[index].likesCount = _items[index].likesCount +1;
    //  this.setState({ listItems: _items});
    //this._LoadFavourites(this.state.selectedOrderBy);
    console.log("fired favourite!")
    var favBy = (this.state.item.FavoriteAssociates != null)?this.state.item.FavoriteAssociates:"";
    this.props.listService.setFavourites(this.props.inventoryListName,Number(this.state.id), this.state.item.FavoriteAssociates, this.state.currentUser.UserPrincipalName).then((result: any) => {
      this.state.item.FavoriteAssociates = result.FavoriteAssociates;
      this.setState({item:this.state.item});
    });
  };

  // Build and render the final markup to show on the page
  // simple-flexbox module is used to build row column design
  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
    <div className="main-content">
		  <div className="content-container"> 
        <div className="">
          <div className="row">
            <div className="col-md-12 compTitle paddingLeft0">
              <h3 className="">{escape(this.state.item.ComponentTitle)}</h3>
            </div>
            <div className="col-md-12 topTitle paddingLeft0">
              <div className="col-md-10 col-sm-9 padding0 topLeftTitle">
                <div className="padding0 lFloat">
                  {/*<label className="caption">Technology:</label>
                  <label className="description">
                     {this.state.item.TechnologyStack.map((d, idx) => {
                       if(idx==0){
                        return (d.Title);
                       }
                       else{
                         return ", " + (d.Title);
                       }
                    })}
                  </label>*/}
                  <label className="caption">Category:</label>
                   <label className="description">{this.state.item.ComponentCategory.Title}</label>
                </div>
                <span className="pipe">|</span>
                <div className="padding0 lFloat">
                  <label className="caption">Sub Category:</label>
                   <label className="description">{this.state.item.ComponentSubCategory.Title}</label>
                </div>
                {/*<div className="padding0 lFloat">
                  <label className="caption">Feature:</label>
                  <label className="description">
                     {this.state.item.ComponentFeatures.map((d, idx) => {
                       if(idx==0){
                        return (d.Title);
                       }
                       else{
                         return ", " + (d.Title);
                       }
                    })}
                    </label>
                </div>*/}
               
              </div>
              <div className="col-md-2 col-sm-3 topRightTitle padding0">
                <div className="lFloat">
                  <label className="caption">Date:</label>
                  <label className="description">
                    <Moment format="DD.MM.YYYY">
                       {this.state.item.Created}
                    </Moment>
                    {/*{this.state.item.Created.toLocaleDateString()}*/}
                    </label>
                </div>
                {(this.state.item.LikesCount!=null && Number(this.state.item.LikesCount)>0)?<span className="pipe">|</span>:""}
                <div className="lFloat">
                  <label className="description">
                    {(this.state.item.LikesCount!=null && Number(this.state.item.LikesCount)>0)?this.state.item.LikesCount:""} {(this.state.item.LikesCount!=null && Number(this.state.item.LikesCount)>0)?Number(this.state.item.LikesCount)>1?"Likes":"Like":""}
                    </label>					
                </div>
            </div>
          </div> 	        
          <div className="col-md-12 noteContent paddingLeft0 ">
            <div className="col-md-8 col-xs-12 paddingLeft0 leftContent">
              <div className="col-md-12 shortNoteSection paddingLeft0">
                <div className="col-md-12 shortNote paddingLeft0">
                  <h3>Description:</h3>
                  <p dangerouslySetInnerHTML={this.state.item.ComponentDescriptionContent}></p>
                </div>
                
                {
                  (this.state.item.TechnologyStack.length>0)? (
                    <div className="col-md-12 topTitle paddingLeft0 technoDiv">
                      <div className="col-md-10 col-sm-9 padding0 topLeftTitle">
                        <div className="padding0 lFloat">
                          <h3>Technology:</h3>
                          <ul>
                            {this.state.item.TechnologyStack.map((d, idx) => {
                            
                              return (<li>{d.Title}</li>)
                            
                            })
                            }
                            
                          </ul>
                        </div>							
                      </div>
                    </div>
                  ):("")
                }

                 {
                  (this.state.item.ComponentFeatures.length>0)? (
                    <div className="col-md-12 topTitle paddingLeft0 technoDiv">
                      <div className="col-md-10 col-sm-9 padding0 topLeftTitle">
                        <div className="padding0 lFloat">
                          <h3>Feature:</h3>
                          <ul>
                            {this.state.item.ComponentFeatures.map((d, idx) => {
                            
                              return (<li>{d.Title}</li>)
                            
                            })
                            }
                            
                          </ul>
                        </div>							
                      </div>
                    </div>
                  ):("")
                }
                {
                  (this.state.item.ComponentLimitations != null && this.state.item.ComponentLimitations != "")? (				
                    <div className="col-md-12 shortNote paddingLeft0">
                      <h3>Limitations:</h3>
                      <p>{this.state.item.ComponentLimitations}</p>
                    </div>
                  ):("")
                }
                <div className="col-md-6 addtoFav">
                  <div className="col-md-6 paddingLeft0 addFavSection">				
                    {this.renderFavourite()}							
                    <label> Add to favorite</label>						
                  </div>
                  <div className="col-md-6 paddingLeft0 likeSection">				
                   {this.renderLike()}					
                    <label> Like</label>						
                  </div>
                </div>
              </div>
            </div>
            
         
          <div className="col-md-4 col-xs-12 rightContent">
            <div className="col-md-12 padding0">
              <h3 className="compowner"> Component Owner </h3>
            </div>
            {
              this.state.componentOwnerDetails.map((d,index)=>{
                if(index!=0){
                    return(
                    <div className="col-md-12 compownerSection">
                    <div className="col-md-3 col-xs-1 padding0">
                        <img className="ms-Image-image is-loaded ms-Image-image--cover ms-Image-image--portrait is-fadeIn image-91 compownerPic" src={"/_layouts/15/userphoto.aspx?size=S&amp;accountname="+d.UserName} alt="" />
                    </div>
                    <div className="col-md-9 col-xs-11 padding0">
                      <span className="col-md-12 col-xs-12 compownerName">{d.Title} </span>
                      <span className="col-md-12 col-xs-12 compownerDesig">{d.Designation}  </span>
                      <span className="col-md-12 col-xs-12 compownerUnit">{d.Department} </span>
                      <span className="col-md-12 col-xs-12"><a className="compownerEmail" href={'mailto:' + d.Email}>{d.Email}</a></span>
                    </div>
                  </div>);
                }
              })
              
            }
            
            {/*<div className="col-md-12 compownerSection">
              <div className="col-md-3 col-xs-1 padding0">
                <span className="compownerPic">  </span>
              </div>
              <div className="col-md-9 col-xs-11 padding0">
                <span className="col-md-12 col-xs-12 compownerName">Mike Jackson </span>
                <span className="col-md-12 col-xs-12 compownerDesig">Sr. Architect  </span>
                <span className="col-md-12 col-xs-12 compownerUnit">Cognizant Interactive </span>
                <span className="col-md-3 col-xs-3 compownerEmailField">Email: </span>
                <a className="col-md-9 col-xs-9 compownerEmail">Mike.jackson@cognizant.com</a>
              </div>
            </div>*/}
            
            <div className="col-md-12 compDemo">
              {this.renderDemoLink()}
            </div>
            
            <div className="col-md-12 addRes">
              <h3 className="">Additional Resource</h3>
              <div className="listOfRes">
                {this.renderArtifacts()}
              </div>
            </div>            
          </div><br /><br />
           </div>
        </div>           
      </div>
    </div>
  </div>
 );





      {/*<div>
      { 
        (this.state && this.state.item && this.state.item.ComponentTitle !="")?
        <div className={styles.spComponentDetails}>
          <Row className={styles.containerRow}>
            <Column flexGrow={1} className={styles.left}>
              <div>
                <div id="divComponentTitle">
                  <h1>{escape(this.state.item.ComponentTitle)}</h1>
                </div>
                <div id="divShortDescription">
                  <p>{escape(this.state.item.ShortDescription)}</p>
                </div>
                <div id="divComponentDescriptionContent">
                  <p dangerouslySetInnerHTML={this.state.item.ComponentDescriptionContent}></p>
                </div>
                <div id="divComponentImage">
                  <img src={this.state.item.ComponentImage.Url} alt=""></img>
                </div>
              </div>
            </Column>
            <Column flexGrow={1} className={styles.middle}>
            </Column>
            <Column flexGrow={1} className={styles.right}>
              <div>
                <br />
                <div id="divDemoUrl">
                  {this.renderDemoLink()}
                </div>
                <br />
                <div id="dicAdditionalResourcesHeader">
                  <h2>
                    Additional Resources
                      </h2>
                </div>
                <div id="divAdditionalResources">
                  <ul>
                    {
                      this.renderArtifacts()
                    }
                  </ul>
                </div>
                <br />
                <div id="divComponentOwner">
                  <p className={styles.rcorner}>
                    <a href={'mailto:' + this.state.componentOwnerDetails.Email} className={styles.link}>Contact Component Owner</a>
                  </p>
                </div>
              </div>
              <br />
              <div id="divFav">
                {this.renderFavouriteImage()}
              </div>
              <br />
              <div id="divLike">
                {this.renderLike()}
              </div>
            </Column>
          </Row>
        </div>
        :<div>Loading component details. Please wait...</div>
      }
      </div>*/}
  }
}
