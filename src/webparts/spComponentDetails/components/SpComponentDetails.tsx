import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Column, Row } from 'simple-flexbox';
import pnp  from 'sp-pnp-js';
import {
  Logger,
  ConsoleListener,
  LogLevel
} from "sp-pnp-js";

// subscribe a listener
Logger.subscribe(new ConsoleListener());

// set the active log level
Logger.activeLogLevel = LogLevel.Info;

export interface ISpComponentDetailsState{ 
  artifacts:any[];
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
    currentUser:{
      "Id":number,
      "Email":string,
      "LoginName":string,
      "Title":string
    };

} 

export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
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
  private id: string;
  public componentDidMount(){
    var reactHandler = this; 
    var siteUrl = this.props.siteurl;
    var artifactListName = this.props.artifactsListName;
    var inventoryList = this.props.inventoryListName;
    // Get component id from query string
    this.id = window.location.search.split("ComponentID=")[1];
    let compId:Number = Number(this.id);
    pnp.sp.web.lists.getByTitle(inventoryList).items
    .getById(Number(this.id))
    .expand("ComponentOwner","ComponentReviewers","DownloadedAssociates","ComponentFeatures","FavouriteAssociates")
    .select("ComponentTitle","ComponentCategory","ComponentDescription","ShortDescription","ComponentImage","DemoUrl","ComponentLimitations","ComponentOwner/Title", "ComponentOwner/UserName","ArtifactsLocation","NoOfDownloads","ComponentReviewers/Title","ComponentReviewers/UserName", "DownloadedAssociates/UserName", "TechnologyStack", "ComponentFeatures/Title", "FavouriteAssociatesId","FavouriteAssociates/Title","FavouriteAssociates/UserName","FavouriteAssociates/Id")
    .get()
    .then((data: any) => {
          data.ComponentDescriptionContent = { __html: data.ComponentDescription };
          reactHandler.setState({ 
            item: data
          }); 
          console.log(data);
          reactHandler.getUserDetails();
          // Get artifact document set for the component
          pnp.sp.web.lists.getByTitle(artifactListName).items
          .expand("Folder","Folder/ComponentID","Folder/ComponentID/Id")
          .filter(`ComponentID/Id eq `+this.id)
          .get()
          .then((folders: any[]) => {
              if(folders.length>0)
              {

                 // Get artifact files from the document set
                 var artifactLocationRelativeUrl = folders[0].Folder.ServerRelativeUrl;
                 pnp.sp.web.getFolderByServerRelativeUrl(artifactLocationRelativeUrl).files.get()
                 .then((documents: any[]) => {
                  reactHandler.setState({ 
                    artifacts:documents
                   }); 
                 })
                 .catch((error) => {
                  console.log('Error occured while fetching component artifact files from document set');
                  console.log(error);
                 });
              }
          })
          .catch((error) => {
            console.log('Error occured while fetching component artifact document set');
            console.log(error);
          });
    })
    .catch((error) => {
      console.log('Error occured while fetching component item details');
      console.log(error);
    });
  } 

  private renderDemoLink(){
    if(this.state.item.DemoUrl != null)
      {
        return(
          <h3><a href={this.state.item.DemoUrl.Url}>View Demo</a></h3>
        );
      }
      else
      {
        return(
          <h3>No Demo available</h3>
        );
      }
  }  

  private renderArtifacts(){
    if(this.state.artifacts != null && this.state.artifacts.length>0)
    {
      var artifactMarkup = 
      this.state.artifacts.map(function(d, idx){
        return (<li key={idx}><a href={d.ServerRelativeUrl}>{d.Name}</a></li>);
      });
      return(artifactMarkup);
    }
    else
    {
      return(
        <li>No resource file available</li>
      );
    }
  }  

  private getUserDetails():number{
    let id:number = 0;
    var reactHandler = this;
    pnp.sp.web.currentUser.get().then((user) => {
      reactHandler.setState({ 
        currentUser: user
       }); 
        console.log(user);
        id = user.Id;
    });
    return id;
  }
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


  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
      <div className={ styles.spComponentDetails }>
          <Row vertical='top'> 
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
