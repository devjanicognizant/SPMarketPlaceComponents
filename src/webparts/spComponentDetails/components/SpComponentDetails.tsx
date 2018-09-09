import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';

export interface ISpComponentDetailsState{ 
  item:{ 
          "ComponentTitle": "devjani", 
          "ComponentCategory": "", 
          "ComponentDescription":"", 
          "ShortDescription":"",
          "ComponentImage":{"Description":"","Url":""},
          "DemoUrl":{"Description":"","Url":""},
           "ComponentLimitations":"",
           //"TechnologyStack":[""]
           "ComponentOwner":{"Title":"","EMail":""}
          // "ComponentReviewers":"",
          // "ArtifactsLocation":"",
          // "ComponentFeatures":"",
          // "DownloadedAssociates":"",
          // "NoOfDownloads":0
        }
} 

export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
    this.state = { 
      item:{ 
        "ComponentTitle": "devjani", 
        "ComponentCategory": "", 
        "ComponentDescription":"", 
        "ShortDescription":"",
        "ComponentImage":{"Description":"","Url":""},
        "DemoUrl":{"Description":"","Url":""},
        "ComponentLimitations":"",
        //"TechnologyStack":[""]
         "ComponentOwner":{"Title":"","EMail":""}
        // "ComponentReviewers":"",
        
        // "ArtifactsLocation":"",
        // "ComponentFeatures":"",
        // "DownloadedAssociates":"",
        // "NoOfDownloads":0
      }
    };
  } 

  public componentDidMount(){ 
    var reactHandler = this; 
    jquery.ajax({ 
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Component Inventory')/items(1)$expand=ComponentOwner&$select=*,ComponentOwner/Title,EMail`, 
        type: "GET", 
        headers:{'Accept': 'application/json; odata=verbose;'}, 
        success: function(resultData) {          
          reactHandler.setState({ 
            item: resultData.d
          }); 
        }, 
        error : function(jqXHR, textStatus, errorThrown) { 
        } 
    }); 
  } 

  public render(): React.ReactElement<ISpComponentDetailsProps> {
    return (
      <div className={ styles.spComponentDetails }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              Component Title
            </div>
            <div className={ styles.column }>
              {/* <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more..test Git..Devjani</span>
              </a>
              <p className={ styles.description }>{escape(this.props.siteurl)}</p> */}
              <p className={ styles.description }>{escape(this.state.item.ComponentTitle)}</p>
            </div>
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
              <p className={ styles.description }>{this.state.item.ComponentDescription}</p>
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
              <p className={ styles.description }>{this.state.item.ComponentImage.Url}</p>
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
            {/* <div className={ styles.column }>
             Technology Stack
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.TechnologyStack[0]}</p>
            </div> */}
             <div className={ styles.column }>
              Component Owner
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentOwner.Title}</p>
            </div>
            {/*
            <div className={ styles.column }>
            Component Reviewers
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentReviewers}</p>
            </div> 
           
            
             <div className={ styles.column }>
              Artifacts Location
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ArtifactsLocation}</p>
            </div>
            <div className={ styles.column }>
              Component Features
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.ComponentFeatures}</p>
            </div>
            
            <div className={ styles.column }>
              Downloaded Associates
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.DownloadedAssociates}</p>
            </div>
            <div className={ styles.column }>
              No Of Downloads
            </div>
            <div className={ styles.column }>
              <p className={ styles.description }>{this.state.item.NoOfDownloads}</p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
