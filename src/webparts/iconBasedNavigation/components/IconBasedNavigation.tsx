import * as React from 'react';
import styles from './IconBasedNavigation.module.scss';
import { IIconBasedNavigationProps } from './IIconBasedNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Column, Row } from 'simple-flexbox';
import pnp  from 'sp-pnp-js'
import {
  Logger,
  ConsoleListener,
  LogLevel
} from "sp-pnp-js";

// subscribe a listener
Logger.subscribe(new ConsoleListener())

// set the active log level
Logger.activeLogLevel = LogLevel.Info;

export interface IIconBasedNavigationState{
  icons:[{
      "QuickLinkTitle": "", 
      "QuickLinkUrl":{"Description":"","Url":""},
      "QuickLinkImage":{"Description":"","Url":""},
      "QuickLinkOrder":number
    }];
  test:string;
} 
export default class IconBasedNavigation extends React.Component<IIconBasedNavigationProps, IIconBasedNavigationState> {
  public constructor(props: IIconBasedNavigationProps, state: IIconBasedNavigationState){ 
    super(props); 
    this.state = {
      icons:[{
          "QuickLinkTitle": "", 
          "QuickLinkUrl":{"Description":"","Url":""},
          "QuickLinkImage":{"Description":"","Url":""},
          "QuickLinkOrder":0
        }],
      test:"test"

    }
  } 

  public componentDidMount(){
    var reactHandler = this; 
    var siteUrl = this.props.siteurl;
    var iconListName = this.props.iconListName;
    pnp.sp.web.lists.getByTitle(iconListName).items
    .select("QuickLinkTitle", "QuickLinkUrl","QuickLinkImage","QuickLinkOrder")
    .orderBy("QuickLinkOrder", true)
    .filter(`ItemStatus eq 'Active'`)
    .get()
    .then((items: any[]) => {
      console.log(items);
     
      let iconsRet = [{}] as [{
        "QuickLinkTitle": "", 
        "QuickLinkUrl":{"Description":"","Url":""},
        "QuickLinkImage":{"Description":"","Url":""},
        "QuickLinkOrder":number
      }];
      iconsRet.pop();
      for(let item of items)
      {
        if(item.QuickLinkImage != null && item.QuickLinkUrl != null)
        {
          iconsRet.push(item);
        }
      }
      reactHandler.setState({ 
        icons: iconsRet
      }); 

    });
 
  }

  public render(): React.ReactElement<IIconBasedNavigationProps> {
    return (
      <div className={ styles.iconBasedNavigation }>
        <Row vertical='top'> 
          {this.state.icons.map(function(d, idx){
            return (<Column key={idx}><a href={d.QuickLinkUrl.Url} title={d.QuickLinkTitle}><img width="50px" height="50px" alt={d.QuickLinkTitle} src={d.QuickLinkImage.Url}></img> </a></Column>);
          })}
        
        </Row>
      </div>
    );
  }
}
