import * as React from 'react';
import styles from './Home.module.scss';
import { IHomeProps } from './IHomeProps';
import { IHomeState } from './IHomeState';
import { ListItem } from '../services/ListItem';
//import Card from './Card/Card';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import './Dropdown.Basic.Example.scss';
import LogManager from '../../LogManager';

/*Constants */
// const Swiper:any = require('swiper/dist/js/swiper.min');
const _items:any[]=[];
const _filterArray:any[]=[];
const _filterArray1:{key:string,text:string}[]=[];

export default class Home extends React.Component<IHomeProps, IHomeState> {

  private uniqueId: number;

  constructor(props: IHomeProps) {
    super(props);
    this.state = { 
      listItems: []
    ,selectedFilter:"All"
    ,selectedOrderBy:"Latest"
    , latestLnkCssClass:"active"
    , likeLnkCssClass:""
     ,currentUser: {
        "Id": 0,
        "Email": "",
        "LoginName": "",
        "Title": ""
      }
    };
  
    
    this.uniqueId = Math.floor(Math.random() * 10000) + 1;
   // this._LoadFavourites=this._LoadFavourites.bind(this);
    this._LoadFilters=this._LoadFilters.bind(this);
  }
  public componentWillMount(): void {
          if(_filterArray1.length < 1){
            _filterArray1.push({key:"All",text:"All"});
          }
  }
 private inputSearch: HTMLButtonElement;
  public componentDidMount(): void {
    this.getCurrentUserDetails()
    this.props.listService.getAll(this.props.swiperOptions).then((result: Array<ListItem>) => {
      if(_items.length < 1)
      {        
        for(let i=0;i<result.length;i++)
        {
            _items.push(result[i]);
            if(_filterArray.indexOf(result[i].componentCategory) === -1)
            {
             _filterArray.push(result[i].componentCategory)       
             _filterArray1.push({key:result[i].componentCategory.toString(),text:result[i].componentCategory.toString()});                 
            }
        } 
      }

      
       var opts=this.props.swiperOptions;
       var numberOfTopRecords=Number(opts.selectTop);
       
        let _temp:any[]=[];
        _temp=_items;
        _temp.sort(function(a,b){return a.id-b.id});
        _temp.reverse();        
        _temp=_items.slice(0,numberOfTopRecords);
       
      this.setState({ listItems: _temp, selectedFilter:"All",selectedOrderBy:"Latest" });
      //this.setSwiper();
      this.inputSearch.focus();
    });
  }

  public componentDidUpdate(): void {
    this.inputSearch.focus();
  }

  // Make a service call to get the user details
  private getCurrentUserDetails() {
    this.props.listService.getCurrentUserDetails().then((result: any) => {
      this.setState({
        // Set the returned user object to state
        currentUser: result
      });
    });
     
  }

  // Return different markup when user has already likes the component
  // and different markup when user is yet to like the component
  private renderLike(item, index) {
     // Determine like image url
     var siteUrl = this.props.siteUrl;
     var likeActiveImgUrl = siteUrl +"/siteassets/images/like-red.png";
     var likeInactiveImgUrl = siteUrl +"/siteassets/images/unlike-red.png";

    // Initially hide both like and unlike divs
    var likeClass = "hide";
    var unlikeClass = "hide";
    // Set the css class based on the status whether user liked the component or not
    if (item.likedById != null
      && item.likedById.indexOf(this.state.currentUser.Id) != -1) {
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
        <div className={likeClass} id={"divLike"+index}>
          <a href="#" onClick={this.onSetLike.bind(this,index, item)}>
            <img src={likeActiveImgUrl} id="like-red" />
          </a>
        </div>
        <div className={unlikeClass} id={"divUnlike"+index}>
          <a href="#" onClick={this.onSetLike.bind(this,index, item)}>
            <img src={likeInactiveImgUrl} id="unlike-red" />
          </a>
        </div>
      </div>
    );
  }

/**
 * This method renders the swiper using properteis
 */
  public render(): React.ReactElement<IHomeProps> {
    return (
      <div>
          <nav>
            <div className="content content-container">
                <ul className="latest_links">
                  <li className={this.state.latestLnkCssClass}><a href="#" onClick={this.onLatestSort} >Latest Added</a></li>
                  <li className={this.state.likeLnkCssClass}><a href="#" onClick={this.onLikeSort}>Top Liked</a></li>
                </ul>
            </div>
          </nav>
          <div className="main-content">
            <div className="content-container">
              <div className="all_components_dropdwn">
                <div className="dropdown-div">
                  <label>Show</label>
                    <Dropdown                            
                        onChanged={this._LoadFilters}                          
                        defaultSelectedKey="All"                        
                        options={_filterArray1}
                      />   
                      <input ref={(input) => { this.inputSearch = input; }} className="hide-on-ui" type="button" />
                </div>
              </div>
              
              <div className="items">
                 {this.state.listItems.length &&
                    this.state.listItems.map((listItem, index) => {
                      var redirectUrl : string =  this.props.swiperOptions.redirectURL;
                      // Get the siteurl from property
                      return   <div className="item">
                                <div className="item-content">
                                  <div className="item-content-text">
                                    <a href={redirectUrl+"?ComponentID="+listItem.id}>
                                          <p className="item-p"> {listItem.title.length>35?listItem.title.slice(0,35)+"...": listItem.title}  </p>
                                          <p>{listItem.shortDescription.length>140?listItem.shortDescription.slice(0,140)+"...": listItem.shortDescription}</p>
                                    </a>
                                  </div>
                                  {this.renderLike(listItem, index)}
                                  <div className="item-content-likes-count" id={"divLikeCount"+index}>{listItem.likesCount} {Number(listItem.likesCount)>1?"Likes":"Like"}</div>
                                  
                                </div>
                              </div>;
                    })}
              </div>
          </div>
        </div>
      {/*<div className={`container-${this.uniqueId}`}> 
              
               
            <div>        
              <div>
                  <div>
                    {this.props.swiperOptions.showCategoryFilter?<div>
                      <div>Category</div>              
                      <div>
                        <Dropdown                            
                                  onChanged={this._LoadFilters}                          
                                  defaultSelectedKey="All"                        
                                  options={_filterArray1}
                                />                              
                      </div>
                    </div>:null}
                    {this.props.swiperOptions.showLatestFilter?<div>
                    <div>Sort By</div>
                    <div> 
                        <Dropdown                            
                                  onChanged={this._LoadFavourites}                          
                                  defaultSelectedKey="Latest"                        
                                  options={[
                                    { key: 'Latest', text: 'Latest' },
                                    { key: 'Most Liked', text: 'Most Liked' }
                                  ]}
                                />          
                      </div>
                  </div>:null}
                  </div>
              </div>
              <div className={`swiper-container ${styles.container} container-${this.uniqueId}`}>          
                <div className='swiper-wrapper'>
                  {this.state.listItems.length &&
                    this.state.listItems.map((listItem, i) => {
                      return <div style={{width:'162px !important'}}>

                        <Card listItem={listItem} key={i} redirectURL={this.props.swiperOptions.redirectURL}/>

                      </div>;
                    })}
                </div>

                {this.props.swiperOptions.enableNavigation &&
                
                  <div className={`swiper-button-next next-${this.uniqueId}`}></div>
                }
                {this.props.swiperOptions.enableNavigation &&
                  <div className={`swiper-button-prev prev-${this.uniqueId}`}></div>
                }

                {this.props.swiperOptions.enablePagination !== false &&
                  <div className={`swiper-pagination pagination-${this.uniqueId}`}></div>
                }
              </div>
            </div>
          </div>*/}
      </div>     
    );
  }
  public onSetLike = (index, item): void => {
    // _items[index].likesCount = _items[index].likesCount +1;
    //  this.setState({ listItems: _items});
    //this._LoadFavourites(this.state.selectedOrderBy);
    var likedBy = (item.likedById != null)?item.likedById.results:[];
    this.props.listService.setLikes(this.props.swiperOptions.sourceList,item.id, item.likedById, item.likesCount, this.state.currentUser.Id).then((result: any) => {
      _items[index].likedById = (result.LikedById != null && result.LikedById.results != null)?result.LikedById.results:result.LikedById;
      _items[index].likesCount = result.LikesCount;
       this.setState({ listItems: _items});
       this._LoadFavourites(this.state.selectedOrderBy);
    });
  };
   public onSetUnlike = (index, item): void => {
    // _items[index].likesCount = _items[index].likesCount -1;
   
  };
 public onLikeSort = (): void => {
   
    this._LoadFavourites("Most Liked");
     this.setState({ latestLnkCssClass:"", likeLnkCssClass:"active" });
  };
  public onLatestSort = (): void =>{
   
    this._LoadFavourites("Latest");
     this.setState({ latestLnkCssClass:"active", likeLnkCssClass:"" });
  };
  /**
   * This method sort datasource and set it in state according to selected criteria.
   * e.g. Most Liked - sort sccording to likes column desending
   * Latest - sort according to created date/id desending
   */
  public _LoadFavourites = (selectedOption:string): void =>{    
        try
        {
          var opts=this.props.swiperOptions;
          var numberOfTopRecords=Number(opts.selectTop);
          
          let _temp:any[]=[];
          _temp=_items;

          if(selectedOption == "Latest")
          {
            _temp.sort(function(a,b){return a.id-b.id});
            _temp.reverse(); //Sort desending
          }
          else if(selectedOption == "Most Liked")
          {
            _temp.sort(function(a,b){return a.likesCount-b.likesCount});
            _temp.reverse(); //Sort desending
          }

          if(this.state.selectedFilter == "All"){
          }
          else
          {
            _temp=_items.filter(a => a.componentCategory == this.state.selectedFilter);
          }      
          _temp=_temp.slice(0,numberOfTopRecords);
          this.setState({ listItems: _temp,selectedOrderBy:selectedOption });
          //this.setSwiper();     
        }    
        catch(e)
        {
          LogManager.logException(e,"Error occured while load favourites.","_LoadFavourites","ReactSlideSwiper");                              
        }    
  }; 
  /**
 * This method filter datasource in state and set it in state according to selected filter criteria 
 * selected records will be sorted accordingly selected sort criteria e.g Most Liked, Latest
 */
  public _LoadFilters = (item: IDropdownOption): void => {
      try
      {
        var opts=this.props.swiperOptions;
        var numberOfTopRecords=Number(opts.selectTop);
        
        let _temp:any[]=[];
        _temp=_items;

        if(this.state.selectedOrderBy == "Latest")
        {
          _temp.sort(function(a,b){return a.id-b.id});
          _temp.reverse();
        }      
        else if(this.state.selectedOrderBy == "Most Liked")
        {
          _temp.sort(function(a,b){return a.likesCount-b.likesCount});
          _temp.reverse();
        }

        if(item.text == "All"){
        // _temp=_items;
        }else{
          _temp=_items.filter(a => a.componentCategory == item.text);
        }
        _temp=_temp.slice(0,numberOfTopRecords);
        this.setState({ listItems: _temp,selectedFilter:item.text });
        //this.setSwiper();  
        this.inputSearch.focus();
    }
    catch(e) 
    {
      
      LogManager.logException(e,"Error occured while load favourites.","_LoadFilters","ReactSlideSwiper");                              
    }
  }
  /**
 * Sets default properties of swiper webpart 
 */  
  // private setSwiper(): void {
  //   const opts = this.props.swiperOptions;

  //   const options: any = {
  //     slidesPerView: parseInt(opts.slidesPerView) || 3,
  //     slidesPerGroup: parseInt(opts.slidesPerGroup) || 3,
  //     spaceBetween: parseInt(opts.spaceBetweenSlides) || 10,
  //     loop: opts.enableLoop || false,
  //     grabCursor: opts.enableGrabCursor || false,
  //     breakpoints: {
  //       1024: {
  //         slidesPerView: 3,
  //         spaceBetween: 10,
  //       },
  //       768: {
  //         slidesPerView: 2,
  //         spaceBetween: 10,
  //       },
  //       640: {
  //         slidesPerView: 1,
  //         spaceBetween: 5,
  //       },
  //       320: {
  //         slidesPerView: 1,
  //         spaceBetween: 5,
  //       }
  //     }
  //   };

  //   if (opts.enablePagination !== false) {

  //     options.pagination = {
  //       el: `.pagination-${this.uniqueId}`,
  //       clickable: true,
  //     };
  //   }

  //   if (opts.enableNavigation) {

  //     options.navigation = {
  //       nextEl: `.next-${this.uniqueId}`,
  //       prevEl: `.prev-${this.uniqueId}`,
  //     };
  //   }

  //   if (opts.enableAutoplay) {

  //     options.autoplay = {
  //       delay: opts.delayAutoplay,
  //       disableOnInteraction: opts.disableAutoplayOnInteraction,
  //     };
  //   }
  //   return new Swiper(`.container-${this.uniqueId}`, options);
  // }  
}
