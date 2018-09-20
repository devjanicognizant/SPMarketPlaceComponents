import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Column, Row } from 'simple-flexbox';

export interface ISpComponentDetailsState{ 
  artifacts:{results:[{"Name":"No Resource file available","ServerRelativeUrl":"javascript:"}]},
  item:{ 
          "ComponentTitle": "", 
          "ComponentCategory": "", 
          "ComponentDescription":"", 
          "ComponentDescriptionContent":{ __html: "" },
          "ShortDescription":"",
          "ComponentImage":{"Description":"","Url":""},
          "DemoUrl":{"Description":"","Url":""},
          "ComponentLimitations":"",
          "TechnologyStack":{"results":[""]},
          "ComponentOwner":{"Title":"","UserName":""},
          "ComponentReviewers":{"results":[{"Title":"","UserName":""}]},
          "ArtifactsLocation":{"Description":"","Url":""},
          "ComponentFeatures":{"results":[{"Title":""}]},
          "DownloadedAssociates":{"results":[{"Title":"","UserName":""}]},
          "NoOfDownloads":0,
          "FavouriteAssociatesId":""
        }
} 

export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
    this.state = { 
      artifacts:{results:[{"Name":"No Resource file available","ServerRelativeUrl":"javascript:"}]},
      item:{ 
        "ComponentTitle": "", 
        "ComponentCategory": "", 
        "ComponentDescription":"", 
        "ComponentDescriptionContent":{ __html: "" },
        "ShortDescription":"",
        "ComponentImage":{"Description":"","Url":""},
        "DemoUrl":{"Description":"","Url":""},
        "ComponentLimitations":"",
        "TechnologyStack":{"results":[""]},
        "ComponentOwner":{"Title":"","UserName":""},
        "ComponentReviewers":{"results":[{"Title":"","UserName":""}]},
        
        "ArtifactsLocation":{"Description":"","Url":""},
        "ComponentFeatures":{"results":[{"Title":""}]},
        "DownloadedAssociates":{"results":[{"Title":"","UserName":""}]},
        "NoOfDownloads":0,
        "FavouriteAssociatesId":""
      }
    };
  } 

  public componentDidMount(){ 
    jquery("div[class^='pageTitle_']").hide();
    jquery("div[class^='footerBar_']").hide();
    var reactHandler = this; 
    var siteUrl = this.props.siteurl;
    // Get component id from query string
    let id: string = window.location.search.split("ComponentID=")[1];
    // Get component details by id
    jquery.ajax({ 
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Component Inventory')/items(`+id+`)?$expand=ComponentOwner,ComponentReviewers, DownloadedAssociates, ComponentFeatures&$select=ComponentTitle,ComponentCategory,ComponentDescription,ShortDescription,ComponentImage,DemoUrl,ComponentLimitations,ComponentOwner/Title, ComponentOwner/UserName,ArtifactsLocation,NoOfDownloads,ComponentReviewers/Title,ComponentReviewers/UserName, DownloadedAssociates/UserName, TechnologyStack, ComponentFeatures/Title, FavouriteAssociatesId`, 
        type: "GET", 
        headers:{'Accept': 'application/json; odata=verbose;'}, 
        success: function(resultData) {  
          resultData.d.ComponentDescriptionContent = { __html: resultData.d.ComponentDescription };
          reactHandler.setState({ 
            item: resultData.d
          }); 
          // Get artifact document set for the component
          jquery.ajax({ 
            url: siteUrl+ "/_api/web/lists/getbytitle('Component%20Artifacts')/items?$expand=Folder,Folder/ComponentID,Folder/ComponentID/Id&$filter=ComponentID/Id%20eq%20%27"+id+"%27", 
            type: "GET", 
            headers:{'Accept': 'application/json; odata=verbose;'}, 
            success: function(resultData) {  
              if(resultData.d.results.length>0)
              {
                // Get artifact files from the document set
                var artifactLocationRelativeUrl = resultData.d.results[0].Folder.ServerRelativeUrl;
                jquery.ajax({ 
                  url: siteUrl+ "/_api/Web/GetFolderByServerRelativeUrl('"+artifactLocationRelativeUrl+"')/files", 
                  type: "GET", 
                  headers:{'Accept': 'application/json; odata=verbose;'}, 
                  success: function(resultData) {  
                    reactHandler.setState({ 
                     artifacts: resultData.d
                    }); 
                  }, 
                  error : function(jqXHR, textStatus, errorThrown) { 
                    console.log('Error occured while fetching component artifact files from document set');
                    console.log(errorThrown);
                  } 
                });
              }
              
            }, 
            error : function(jqXHR, textStatus, errorThrown) { 
              console.log('Error occured while fetching component artifact document set');
              console.log(errorThrown);
            } 
          });

          
        }, 
        error : function(jqXHR, textStatus, errorThrown) { 
          console.log('Error occured while fetching component item details');
          console.log(errorThrown);
        } 
    }); 
   
  } 

  renderDemoLink(){
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
                      {this.state.artifacts.results.map(function(d, idx){
                        return (<li key={idx}><a href={d.ServerRelativeUrl}>{d.Name}</a></li>)
                      })}
                    </ul>
                  </div>
                  <br/>
                  <div id="divComponentOwner">
                    <h3><a href={'mailto:'+this.state.item.ComponentOwner.UserName} className={styles.button}>Contact Component Owner</a></h3>
                  </div>
                </div>
                <br/>
                <div id="divFav">
                  <a href={"javascript:CognizantCDBMP.addToFavorite(6, 'imgFav');"}>
                    <img id="imgFav" 
                      src="/sites/spmarketplace/Style%20Library/Images/if_star-add_44384.png"></img>
                  </a>   
                </div>
              </Column>
          </Row>
          {/* <div className={ styles.row }>
            
            <div className={ styles.column }>
              Component Category
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{escape(this.state.item.ComponentCategory)}</p>
            </div>
            <div className={ styles.column }>
            Component Description
            </div>
            <div className={ styles.column }>
              <div contentEditable={true} dangerouslySetInnerHTML={this.state.item.ComponentDescriptionContent}></div>
            </div>
            <div className={ styles.column }>
              Short Description
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ShortDescription}</p>
            </div>
            <div className={ styles.column }>
              Component Image
            </div>
            <div className={ styles.column }>
              <img src={this.state.item.ComponentImage.Url} alt=""></img>
            </div>
            
            <div className={ styles.column }>
              Component Limitations
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentLimitations}</p>
            </div>
            <div className={ styles.column }>
            Demo Url
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.DemoUrl.Url}</p>
            </div>
            <div className={ styles.column }>
             Technology Stack
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.TechnologyStack.results[0]}</p>
            </div>
             <div className={ styles.column }>
              Component Owner
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentOwner.Title}</p>
            </div>
            <div className={ styles.column }>
              Artifacts Location
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ArtifactsLocation.Url}</p>
            </div>
            <div className={ styles.column }>
              No Of Downloads
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.NoOfDownloads}</p>
            </div>
            
            <div className={ styles.column }>
            Component Reviewers
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentReviewers.results[0].Title}</p>
            </div> 
            <div className={ styles.column }>
              Downloaded Associates
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.DownloadedAssociates.results[0].Title}</p>
            </div>
            
            
            <div className={ styles.column }>
              Component Features
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentFeatures.results[0].Title}</p>
            </div>
            
            
            
          </div> 
           <div className={ styles.row }>
            <div className={ styles.column }>
              Component Artifacts
            </div>
            <div className={ styles.column }>
              <a href={this.state.artifacts.results[0].ServerRelativeUrl}>{this.state.artifacts.results[0].Name}</a>
            </div>
            </div> 
        </div> */}
      </div>
    );
  }
}
