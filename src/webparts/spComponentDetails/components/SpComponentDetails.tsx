import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Column, Row } from 'simple-flexbox';
import pnp, { Item } from 'sp-pnp-js';
import LogManager from '../../LogManager';

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
    "ComponentOwner": any,
    "ComponentReviewers": any[],
    "ArtifactsLocation": { "Description": "", "Url": "" },
    "ComponentFeatures": any[],
    "FavouriteAssociatesId": any[]
    "FavouriteAssociates": any[],
    "FavoriteAssociates": "",
    "LikedById": any[],
    "LikesCount": number

  };
  // Hold current user details
  currentUser: {
    "Id": number,
    "Email": string,
    "LoginName": string,
    "Title": string
  };
  // Component owner details - required for fetching the email id
  componentOwnerDetails:any;
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
        "ComponentOwner": {},
        "ComponentReviewers": [],
        "ArtifactsLocation": { "Description": "", "Url": "" },
        "ComponentFeatures": [],
        "FavouriteAssociatesId": [],
        "FavouriteAssociates": [],
        "FavoriteAssociates": "",
        "LikedById": [],
        "LikesCount": 0
      },
      currentUser: {
        "Id": 0,
        "Email": "",
        "LoginName": "",
        "Title": ""
      },
      componentOwnerDetails:{"Email":""}
    };
  }
  // To store the component id coming from query string
  private id: string;
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

    // Get component id from query string
    this.id = window.location.search.split("ComponentID=")[1];
    // Service call to fetch the component details by component id
    pnp.sp.web.lists.getByTitle(inventoryList).items
      .getById(Number(this.id))
      .expand("ComponentOwner", "ComponentReviewers", "ComponentFeatures", "FavouriteAssociates", "LikedBy")
      .select("ComponentTitle"
        , "ComponentDescription"
        , "ShortDescription"
        , "ComponentImage"
        , "DemoUrl"
        , "ComponentLimitations"
        , "ComponentOwner/Title", "ComponentOwner/UserName", "ComponentOwner/Id"
        , "ArtifactsLocation"
        , "ComponentReviewers/Title", "ComponentReviewers/UserName"
        , "ComponentFeatures/Title"
        , "FavouriteAssociatesId", "FavouriteAssociates/Title", "FavouriteAssociates/UserName", "FavouriteAssociates/Id"
        , "FavoriteAssociates"
        , "LikedBy/Id", "LikedById", "LikesCount")
      .get()
      .then((data: any) => {
        if(data.ComponentOwner.Id != null){
          this.getCompOwnerDetails(data.ComponentOwner.Id);
        }
        // When anyone is yet to like the component, LikesCount comes as null. 
        // Set it as 0 in case it is null
        if (data.LikesCount == null) {
          data.LikesCount = 0;
        }
        data.ComponentDescriptionContent = { __html: data.ComponentDescription };
        reactHandler.setState({
          // Assign returned list item data to state
          item: data
        });
        // Service call Get artifact document set for the component
        pnp.sp.web.lists.getByTitle(artifactListName).items
          .expand("Folder", "Folder/ComponentID", "Folder/ComponentID/Id")
          .filter(`ComponentID/Id eq ` + this.id)
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
        <p className={styles.rcorner}><a target="_blank" href={this.state.item.DemoUrl.Url} className={styles.link}>View Demo</a></p>
      );
    }
    else {
      // Show message
      return (
        <p className={styles.rcornerDisabled}>No Demo available</p>
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
          return (<li key={idx}><a href={d.ServerRelativeUrl}>{d.Name}</a></li>);
        });
      return (artifactMarkup);
    }
    else {
      // Show message
      return (
        <li>No resource file available</li>
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

   // Make a service call to get component owner details by Id
   private getCompOwnerDetails(ownerId) {
    var reactHandler = this;
    pnp.sp.web.siteUsers.getById(ownerId).get().then(function(result) {
      reactHandler.setState({
        // Set the returned user object to state
        componentOwnerDetails : result
      });
    })
    .catch((error) => {
      LogManager.logException(error
        , "Error occured while fetching component owner details."
        , "Cpmponent Details"
        , "getCompOwnerDetails");
    });
  }

  // Return different markup when user has already set the component as favourite
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
        <p className={styles.rcornerDisabled} id="pFavInactive">
          <span className={styles.topAlign}>Add to favourite </span>
          <img id="imgFav"
            src= {favInactiveImgUrl}>
          </img>
        </p>
      );
    }
    else {
      // Markup if user is yet to set the component as favourite
      return (
        <p className={styles.rcorner} id="pFavActive">
          <span className={styles.topAlign}>Add to favourite </span>
          <a href={"javascript:CognizantCDBMP.addToFavorite('" + this.id + "', 'imgFav');"}>
            <img id="imgFav"
              src={favActiveImgUrl}></img>
          </a>
        </p>
      );
    }
  }

  // Return different markup when user has already likes the component
  // and different markup when user is yet to like the component
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
  }

  // Build and render the final markup to show on the page
  // simple-flexbox module is used to build row column design
  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
      <div>
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
      </div>
    );
  }
}
