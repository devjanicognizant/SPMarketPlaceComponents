import * as React from 'react';
import styles from './SpComponentDetails.module.scss';
import { ISpComponentDetailsProps } from './ISpComponentDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';

export interface ISpComponentDetailsState{ 
  item:{ 
          "ComponentTitle": "TEST", 
          "ComponentCategory": "", 
          "ComponentDescription":"", 
          "ShortDescription":""
        }
} 

export default class SpComponentDetails extends React.Component<ISpComponentDetailsProps, ISpComponentDetailsState> {
  public constructor(props: ISpComponentDetailsProps, state: ISpComponentDetailsState){ 
    super(props); 
    this.state = { 
      item:{ 
        "ComponentTitle": "TEST", 
        "ComponentCategory": "", 
        "ComponentDescription":"", 
        "ShortDescription":""
      }
    };
  } 

  public componentDidMount(){ 
    var reactHandler = this; 
    jquery.ajax({ 
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Component Inventory')/items(1)`, 
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
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more..test Git..Devjani</span>
              </a>
              <p className={ styles.description }>{escape(this.props.siteurl)}</p>
              <p className={ styles.description }>{escape(this.state.item.ComponentTitle)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
