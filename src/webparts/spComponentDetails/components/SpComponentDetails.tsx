import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Column, Row } from 'simple-flexbox';
import pnp  from 'sp-pnp-js';
import LogManager from '../../LogManager';

// Interface representing the state of component details webpart
export interface ISpComponentDetailsState{ 
  // Artifact documents
  artifacts:any[];
  // Component item
  item:{ 
      "ComponentTitle": "", 
      "ComponentCategory": "", 
      "ComponentDescription":"", 
      "ComponentDescriptionContent":{ __html: "" },
      "ShortDescription":"",
      "ComponentImage":{"Description":"","Url":""},
      "DemoUrl":{"Description":"","Url":""},
      "ComponentLimitations":"",
      "TechnologyStack":any[],
      "ComponentOwner":{"Title":"","UserName":""},
      "ComponentReviewers":any[],
      "ArtifactsLocation":{"Description":"","Url":""},
      "ComponentFeatures":any[],
      "DownloadedAssociates":any[],
      "NoOfDownloads":"0",
      "FavouriteAssociatesId":any[]
      "FavouriteAssociates":any[]
    };
    // Hold current user details
    currentUser:{
      "Id":number,
      "Email":string,
      "LoginName":string,
      "Title":string
    };
} 
// React enabled component class implementing property and state interfaces
export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
    // Initialize the state
    this.state = { 
      artifacts:[],
      item:{ 
        "ComponentTitle": "", 
        "ComponentCategory": "", 
        "ComponentDescription":"", 
        "ComponentDescriptionContent":{ __html: "" },
        "ShortDescription":"",
        "ComponentImage":{"Description":"","Url":""},
        "DemoUrl":{"Description":"","Url":""},
        "ComponentLimitations":"",
        "TechnologyStack":[],
        "ComponentOwner":{"Title":"","UserName":""},
        "ComponentReviewers":[],
        
        "ArtifactsLocation":{"Description":"","Url":""},
        "ComponentFeatures":[],
        "DownloadedAssociates":[],
        "NoOfDownloads":"0",
        "FavouriteAssociatesId":[],
        "FavouriteAssociates":[]
      },
      currentUser:{
        "Id":0,
        "Email":"",
        "LoginName":"",
        "Title":""
      }
    };
  } 
  // To store the component id coming from query string
  private id: string;
  // Fetch the component details
  // Fetch the current user details
  // Fetch the component document set as well as artifact files
  public componentDidMount(){
    var reactHandler = this; 
    // Get the siteurl from property
    var siteUrl = this.props.siteurl;
    // Get list names from properties
    var artifactListName = this.props.artifactsListName;
    var inventoryList = this.props.inventoryListName;

    // Get the user details
    this.getUserDetails();

    // Get component id from query string
    this.id = window.location.search.split("ComponentID=")[1];
    // Service call to fetch the component details by component id
    pnp.sp.web.lists.getByTitle(inventoryList).items
    .getById(Number(this.id))
    .expand("ComponentOwner","ComponentReviewers","DownloadedAssociates","ComponentFeatures","FavouriteAssociates")
    .select("ComponentTitle","ComponentCategory","ComponentDescription","ShortDescription","ComponentImage","DemoUrl","ComponentLimitations","ComponentOwner/Title", "ComponentOwner/UserName","ArtifactsLocation","NoOfDownloads","ComponentReviewers/Title","ComponentReviewers/UserName", "DownloadedAssociates/UserName", "TechnologyStack", "ComponentFeatures/Title", "FavouriteAssociatesId","FavouriteAssociates/Title","FavouriteAssociates/UserName","FavouriteAssociates/Id")
    .get()
    .then((data: any) => {
          data.ComponentDescriptionContent = { __html: data.ComponentDescription };
          reactHandler.setState({ 
            // Assign returned list item data to state
            item: data
          });
          // Service call Get artifact document set for the component
          pnp.sp.web.lists.getByTitle(artifactListName).items
          .expand("Folder","Folder/ComponentID","Folder/ComponentID/Id")
          .filter(`ComponentID/Id eq `+this.id)
          .get()
          .then((folders: any[]) => {
              if(folders.length>0)
              {
                 // Get the folder relative url for the document set
                 var artifactLocationRelativeUrl = folders[0].Folder.ServerRelativeUrl;
                 // Service call to fetch the files from the document set
                 pnp.sp.web.getFolderByServerRelativeUrl(artifactLocationRelativeUrl).files.get()
                 .then((documents: any[]) => {
                  reactHandler.setState({ 
                    // Assign returned files to state
                    artifacts:documents
                   }); 
                 })
                 .catch((error) => {
                    LogManager.logException(error
                    ,"Error occured while fetching component artifact files from document set"
                    ,"Icon Based Navigation"
                    ,"componentDidMount");
                 });
              }
          })
          .catch((error) => {
            LogManager.logException(error
              ,"Error occured while fetching component artifact document set."
              ,"Cpmponent Details"
              ,"componentDidMount");
          });
    })
    .catch((error) => {
      LogManager.logException(error
        ,"Error occured while fetching component item details."
        ,"Icon Based Navigation"
        ,"componentDidMount");
    });
  } 

  // Check the demo link is set or not
  // If demo link is not set, show message on the page, set show the demo link
  private renderDemoLink(){
    if(this.state.item.DemoUrl != null)
      {
        // SHow demo link
        return(
          <h3><a href={this.state.item.DemoUrl.Url}>View Demo</a></h3>
        );
      }
      else
      {
        // Show message
        return(
          <h3>No Demo available</h3>
        );
      }
  }  

  // Check the artifact files are available or not
  // If artifacts are not available, show some message, else show the files as listed elements
  private renderArtifacts(){
    if(this.state.artifacts != null && this.state.artifacts.length>0)
    {
      // Build the markup for document links
      var artifactMarkup = 
        this.state.artifacts.map((d, idx)=>{
          return (<li key={idx}><a href={d.ServerRelativeUrl}>{d.Name}</a></li>);
        });
      return(artifactMarkup);
    }
    else
    {
      // Show message
      return(
        <li>No resource file available</li>
      );
    }
  }  

  // Make a service call to get the user details
  private getUserDetails(){
    var reactHandler = this;
    pnp.sp.web.currentUser.get().then((user) => {
      reactHandler.setState({ 
        // Set the returned user object to state
        currentUser: user
       }); 
    });
  }

  // Return different markup when user has already set the component as favourite
  // and different markup when user is yet to set it as favourite
  private renderFavouriteImage(){
    if(this.state.item.FavouriteAssociatesId != null && this.state.item.FavouriteAssociatesId.indexOf(this.state.currentUser.Id) != -1){
      return(
        <img id="imgFav" 
          src="/sites/spmarketplace/Style%20Library/Images/if_Star%20On_58612.png"></img>
      );
    }
    else{
      return(
      <a href={"javascript:CognizantCDBMP.addToFavorite("+this.id+", 'imgFav');"}>
        <img id="imgFav" 
          src="/sites/spmarketplace/Style%20Library/Images/if_star-add_44384.png"></img>
      </a>
      );
    }
  }

  // Build and render the final markupo to show on the page
  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
      <div className={ styles.spComponentDetails }>
          <Row className={ styles.containerRow }> 
              <Column flexGrow={1} className={styles.width50}>
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
              <Column flexGrow={1} className={styles.width10}>
              </Column>
              <Column flexGrow={1} className={styles.width40}>
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
                  <br/>
                  <div id="divComponentOwner">
                    <h3><a href={'mailto:'+this.state.item.ComponentOwner.UserName} className={styles.button}>Contact Component Owner</a></h3>
                  </div>
                </div>
                <br/>
                <div id="divFav">
                   {this.renderFavouriteImage()} 
                </div>
              </Column>
          </Row>
      </div>
    );
  }
}
