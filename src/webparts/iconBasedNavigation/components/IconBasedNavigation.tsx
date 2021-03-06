import * as React from 'react';
import styles from './IconBasedNavigation.module.scss';
import { IIconBasedNavigationProps } from './IIconBasedNavigationProps';
import { Column, Row } from 'simple-flexbox';
import pnp  from 'sp-pnp-js';
import { ListItem } from '../../commonServices/ListItem';


import LogManager from '../../LogManager';

// Represents the webpart state interface
export interface IIconBasedNavigationState{
  icons:any[];
  listItems: Array<ListItem>;
} 
// React enabled component class implementing property and state interfaces
export default class IconBasedNavigation extends React.Component<IIconBasedNavigationProps, IIconBasedNavigationState> {
  public constructor(props: IIconBasedNavigationProps, state: IIconBasedNavigationState){ 
    super(props); 
    // Icon lists to be part of the state
    this.state = {
        icons:[]
        ,listItems:[]
    };
  } 

  // Fetch the icon list from the configuration list
  // List name is configured as webpart properties
  public componentDidMount(){
    var reactHandler = this; 
    // Get the site url from property
    var siteUrl = this.props.siteurl;

    // Get icon configuration list name from property
    var iconListName = this.props.iconListName;

    this.props.listService.getAllRefByCategory(this.props.inventoryListName).then((result: Array<ListItem>) => {
      this.setState({listItems: result});
    });

    // Service call to fetch active set of icon list from list
    // The list is ordered by QuickLinkOrder column
    // Icons would be skipped if QuickLinkUrl or QuickLinkImage are not set
    pnp.sp.web.lists.getByTitle(iconListName).items
    .select("QuickLinkTitle", "QuickLinkUrl","QuickLinkImage","QuickLinkOrder","LinkTarget","LinkDescription")
    .orderBy("QuickLinkOrder", true)
    .filter(`ItemStatus eq 'Active' and LinkType eq 'Navigation Link'`)
    .get()
    .then((items: any[]) => {
       
      // Local variable to store the relevant links
      let iconsRet: any[]=[];
      // Iterate throught eh list of items received from service call
      for(let item of items)
      {
        // Only add the item having linkurl set
        if(item.QuickLinkUrl != null)
        {
          // In case image url is not set, set the default image
          if(item.QuickLinkImage == null)
          {
            let defaultImg:any={};
            defaultImg.Url = this.props.siteurl + this.props.defaultImgUrl; 
            item.QuickLinkImage = defaultImg;
          }
          iconsRet.push(item);
        }
      }
      reactHandler.setState({ 
        // Set the icon list to the state
        icons: iconsRet
      });
      //$("#titleAreaBox").append($(".icons").detach());
    })
    .catch(error => {
      LogManager.logException(error
        ,"Error occured while fetching icon details from SP list"
        ,"Icon Based Navigation"
        ,"componentDidMount");
    });
  }

  private getCompCount = function (category):any{
    var countfiltered = this.state.listItems.filter(function(element){
          return element.componentCategory == category;
      }).length;
      console.log(countfiltered);
      return countfiltered;
  }

  // Build and render the markup to the page
  public render(): React.ReactElement<IIconBasedNavigationProps> {
    return (
      // <div className="icons">
      //   <div className={ styles.iconBasedNavigation }>
      //     <Row className={styles.containerRow}> 
      //       {this.state.icons.map((d, idx)=>{
      //         return (
      //             <Column key={idx}>
      //                 <a href={d.QuickLinkUrl.Url} title={d.QuickLinkTitle}>
      //                 <img className={styles.imgIcon}
      //                   alt={d.QuickLinkTitle} src={d.QuickLinkImage.Url}></img> 
      //               </a>
      //             </Column>);
      //         })
      //       }
      //     </Row>
      //   </div>
      // </div>
      <div className="competency-container">
			  <div className="content-container">
          <div className="competency-header">
            <p>I View Components by Competency</p>
          </div>
          <div className="competency-grids">
            {
              this.state.icons.map((d, idx)=>{
              return (
                        <div className="competency-grid-size">
                          <a href={d.LinkTarget}>
                            <div className="competency-inner-grid">
                              <img alt={d.QuickLinkTitle} src={d.QuickLinkImage.Url} />
                                <p className="competency-p">{d.QuickLinkTitle}</p>
                                <p>{d.LinkDescription}</p>
                                <p>Component: {this.getCompCount(d.QuickLinkTitle)}</p>
                            </div>
                          </a>
                        </div>
                   );
              })
                   
             }
           
        </div>	
			</div>
		</div>
    );
  }
}
