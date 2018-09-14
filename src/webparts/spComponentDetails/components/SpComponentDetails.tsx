import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Column, Row } from 'simple-flexbox';

export interface ISpComponentDetailsState{ 
  artifacts:{results:[{"Name":"","ServerRelativeUrl":""}]},
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
           "ComponentOwner":{"Title":"","EMail":""},
           "ComponentReviewers":{"results":[{"Title":"","EMail":""}]},
          "ArtifactsLocation":{"Description":"","Url":""},
          "ComponentFeatures":{"results":[{"Title":""}]},
           "DownloadedAssociates":{"results":[{"Title":"","EMail":""}]},
           "NoOfDownloads":0
        }
} 

export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
    this.state = { 
      artifacts:{results:[{"Name":"","ServerRelativeUrl":""}]},
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
         "ComponentOwner":{"Title":"","EMail":""},
         "ComponentReviewers":{"results":[{"Title":"","EMail":""}]},
        
         "ArtifactsLocation":{"Description":"","Url":""},
         "ComponentFeatures":{"results":[{"Title":""}]},
        "DownloadedAssociates":{"results":[{"Title":"","EMail":""}]},
         "NoOfDownloads":0
      }
    };
  } 

  public componentDidMount(){ 
    var reactHandler = this; 
    var siteUrl = this.props.siteurl;
     let id: string = window.location.search.split("ComponentID=")[1];
    jquery.ajax({ 
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Component Inventory')/items(`+id+`)?$expand=ComponentOwner,ComponentReviewers, DownloadedAssociates, ComponentFeatures&$select=ComponentTitle,ComponentCategory,ComponentDescription,ShortDescription,ComponentImage,DemoUrl,ComponentLimitations,ComponentOwner/Title,ArtifactsLocation,NoOfDownloads,ComponentReviewers/Title, DownloadedAssociates/Title, TechnologyStack, ComponentFeatures/Title`, 
        type: "GET", 
        headers:{'Accept': 'application/json; odata=verbose;'}, 
        success: function(resultData) {  
          resultData.d.ComponentDescriptionContent = { __html: resultData.d.ComponentDescription };
          reactHandler.setState({ 
            item: resultData.d
            
          }); 
          var artifactLocationRelativeUrl = resultData.d.ArtifactsLocation.Url.replace("https://cosmo2013.sharepoint.com","");
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
            } 
        });
        }, 
        error : function(jqXHR, textStatus, errorThrown) { 
        } 
    }); 
   
  } 

  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
      <div className={ styles.spComponentDetails }>
        {/* <div className={ styles.container }> */}
          {/* <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>{escape(this.state.item.ComponentTitle)}</span>
              <p className={ styles.subTitle }>{escape(this.state.item.ShortDescription)}</p>
              <p className={ styles.description } dangerouslySetInnerHTML={this.state.item.ComponentDescriptionContent}></p>
              <div>
                <img src={this.state.item.ComponentImage.Url} alt=""></img>
              </div>
            </div>
          </div> */}
          <Column flexGrow={1}>
            {/* <Row horizontal='center'>
                <h1>{escape(this.state.item.ComponentTitle)}</h1>
            </Row> */}
            <Row vertical='top'>
                <Column flexGrow={1} className={styles.width50}>
                  <h1>{escape(this.state.item.ComponentTitle)}</h1>
                  <p>{escape(this.state.item.ShortDescription)}</p>
                  <p dangerouslySetInnerHTML={this.state.item.ComponentDescriptionContent}></p>
                  <div>
                    <img src={this.state.item.ComponentImage.Url} alt=""></img>
                  </div>
                </Column>
                <Column flexGrow={1} className={styles.width10}>
                </Column>
                <Column flexGrow={1} className={styles.width40}>
                  <br />
                  <h3><a href="www.google.com">View Demo</a></h3>
                  <h2>
                    Additional Resources
                  </h2>
                  <div>
                    {this.state.artifacts.results.map(function(d, idx){
                      return (<li key={idx}><a href={d.ServerRelativeUrl}>{d.Name}</a></li>)
                    })}
                    {/* <a href={this.state.artifacts.results[0].ServerRelativeUrl}>{this.state.artifacts.results[0].Name}</a> */}
                  </div>
                  <h3><a href="www.google.com">Contact Component Owner</a></h3>
                </Column>
            </Row>
          </Column>
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
            
            
            
          </div> */}
          {/* <div className={ styles.row }>
            <div className={ styles.column }>
              Component Artifacts
            </div>
            <div className={ styles.column }>
              <a href={this.state.artifacts.results[0].ServerRelativeUrl}>{this.state.artifacts.results[0].Name}</a>
            </div>
            </div> */}
        {/* </div> */}
        
                     
      </div>
    );
  }
}
