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
    this.state = { listItems: [],selectedFilter:"All",selectedOrderBy:"Latest", latestLnkCssClass:"active", likeLnkCssClass:"" };
  
    
    this.uniqueId = Math.floor(Math.random() * 10000) + 1;
   // this._LoadFavourites=this._LoadFavourites.bind(this);
    this._LoadFilters=this._LoadFilters.bind(this);
  }
  public componentWillMount(): void {
          if(_filterArray1.length < 1){
            _filterArray1.push({key:"All",text:"All"});
          }
  }
 
  public componentDidMount(): void {

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
    });
  }

/**
 * This method renders the swiper using properteis
 * Card component will be used inside this to render images. 
 */
  public render(): React.ReactElement<IHomeProps> {
    return (
      <div>
          <nav>
            <div className="content content-container">
                <ul className="latest_links">
                  <li className={this.state.latestLnkCssClass}><a href="#" onClick={this.onLatest} >Latest Added</a></li>
                  <li className={this.state.likeLnkCssClass}><a href="#" onClick={this.onLike}>Top Liked</a></li>
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
                </div>
              </div>
              <div className="items">
                 {this.state.listItems.length &&
                    this.state.listItems.map((listItem, i) => {
                      var redirectUrl : string =  this.props.swiperOptions.redirectURL;
                      // Get the siteurl from property
                      var siteUrl = this.props.siteUrl;
                      var likeImageUrl = siteUrl + "/siteassets/images/like-red.png";
                      return   <div className="item">
                                <div className="item-content">
                                  <div className="item-content-text">
                                    <a href={redirectUrl+"?ComponentID="+listItem.id}>
                                          <p className="item-p"> {listItem.title}  </p>
                                          <p>{listItem.shortDescription}</p>
                                    </a>
                                  </div>
                                  <div className="item-content-like-symbol"><a href="#"><img src={likeImageUrl} id="like-red" /></a></div>
                                  <div className="item-content-likes-count">{listItem.likesCount} Likes</div>
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
 public onLike = (): void => {
    this.setState({ latestLnkCssClass:"", likeLnkCssClass:"active" });
    this._LoadFavourites("Most Liked");
  };
  public onLatest = (): void =>{
    this.setState({ latestLnkCssClass:"active", likeLnkCssClass:"" });
    this._LoadFavourites("Latest");
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
