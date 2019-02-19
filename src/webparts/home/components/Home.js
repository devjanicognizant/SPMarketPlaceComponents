var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
//import Card from './Card/Card';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import './Dropdown.Basic.Example.scss';
import LogManager from '../../LogManager';
/*Constants */
// const Swiper:any = require('swiper/dist/js/swiper.min');
var _items = [];
var _filterArray = [];
var _filterArray1 = [];
var Home = (function (_super) {
    __extends(Home, _super);
    function Home(props) {
        var _this = _super.call(this, props) || this;
        _this.onSetLike = function (index, item) {
            // _items[index].likesCount = _items[index].likesCount +1;
            //  this.setState({ listItems: _items});
            //this._LoadFavourites(this.state.selectedOrderBy);
            var likedBy = (item.likedById != null) ? item.likedById.results : [];
            _this.props.listService.setLikes(_this.props.swiperOptions.sourceList, item.id, item.likedById, item.likesCount, _this.state.currentUser.Id).then(function (result) {
                _items[index].likedById = (result.LikedById != null && result.LikedById.results != null) ? result.LikedById.results : result.LikedById;
                _items[index].likesCount = result.LikesCount;
                _this.setState({ listItems: _items });
                _this._LoadFavourites(_this.state.selectedOrderBy);
            });
        };
        _this.onSetUnlike = function (index, item) {
            // _items[index].likesCount = _items[index].likesCount -1;
        };
        _this.onLikeSort = function () {
            _this._LoadFavourites("Most Liked");
            _this.setState({ latestLnkCssClass: "", likeLnkCssClass: "active" });
        };
        _this.onLatestSort = function () {
            _this._LoadFavourites("Latest");
            _this.setState({ latestLnkCssClass: "active", likeLnkCssClass: "" });
        };
        /**
         * This method sort datasource and set it in state according to selected criteria.
         * e.g. Most Liked - sort sccording to likes column desending
         * Latest - sort according to created date/id desending
         */
        _this._LoadFavourites = function (selectedOption) {
            try {
                var opts = _this.props.swiperOptions;
                var numberOfTopRecords = Number(opts.selectTop);
                var _temp = [];
                _temp = _items;
                if (selectedOption == "Latest") {
                    _temp.sort(function (a, b) { return a.id - b.id; });
                    _temp.reverse(); //Sort desending
                }
                else if (selectedOption == "Most Liked") {
                    _temp.sort(function (a, b) { return a.likesCount - b.likesCount; });
                    _temp.reverse(); //Sort desending
                }
                if (_this.state.selectedFilter == "All") {
                }
                else {
                    _temp = _items.filter(function (a) { return a.componentCategory == _this.state.selectedFilter; });
                }
                _temp = _temp.slice(0, numberOfTopRecords);
                _this.setState({ listItems: _temp, selectedOrderBy: selectedOption });
                //this.setSwiper();     
            }
            catch (e) {
                LogManager.logException(e, "Error occured while load favourites.", "_LoadFavourites", "ReactSlideSwiper");
            }
        };
        /**
       * This method filter datasource in state and set it in state according to selected filter criteria
       * selected records will be sorted accordingly selected sort criteria e.g Most Liked, Latest
       */
        _this._LoadFilters = function (item) {
            try {
                var opts = _this.props.swiperOptions;
                var numberOfTopRecords = Number(opts.selectTop);
                var _temp = [];
                _temp = _items;
                if (_this.state.selectedOrderBy == "Latest") {
                    _temp.sort(function (a, b) { return a.id - b.id; });
                    _temp.reverse();
                }
                else if (_this.state.selectedOrderBy == "Most Liked") {
                    _temp.sort(function (a, b) { return a.likesCount - b.likesCount; });
                    _temp.reverse();
                }
                if (item.text == "All") {
                    // _temp=_items;
                }
                else {
                    _temp = _items.filter(function (a) { return a.componentCategory == item.text; });
                }
                _temp = _temp.slice(0, numberOfTopRecords);
                _this.setState({ listItems: _temp, selectedFilter: item.text });
                //this.setSwiper();  
                _this.inputSearch.focus();
            }
            catch (e) {
                LogManager.logException(e, "Error occured while load favourites.", "_LoadFilters", "ReactSlideSwiper");
            }
        };
        _this.state = {
            listItems: [],
            selectedFilter: "All",
            selectedOrderBy: "Latest",
            latestLnkCssClass: "active",
            likeLnkCssClass: "",
            currentUser: {
                "Id": 0,
                "Email": "",
                "LoginName": "",
                "Title": ""
            }
        };
        _this.uniqueId = Math.floor(Math.random() * 10000) + 1;
        // this._LoadFavourites=this._LoadFavourites.bind(this);
        _this._LoadFilters = _this._LoadFilters.bind(_this);
        return _this;
    }
    Home.prototype.componentWillMount = function () {
        if (_filterArray1.length < 1) {
            _filterArray1.push({ key: "All", text: "All" });
        }
    };
    Home.prototype.componentDidMount = function () {
        var _this = this;
        this.getCurrentUserDetails();
        this.props.listService.getAll(this.props.swiperOptions).then(function (result) {
            if (_items.length < 1) {
                for (var i = 0; i < result.length; i++) {
                    _items.push(result[i]);
                    if (_filterArray.indexOf(result[i].componentCategory) === -1) {
                        _filterArray.push(result[i].componentCategory);
                        _filterArray1.push({ key: result[i].componentCategory.toString(), text: result[i].componentCategory.toString() });
                    }
                }
            }
            var opts = _this.props.swiperOptions;
            var numberOfTopRecords = Number(opts.selectTop);
            var _temp = [];
            _temp = _items;
            _temp.sort(function (a, b) { return a.id - b.id; });
            _temp.reverse();
            _temp = _items.slice(0, numberOfTopRecords);
            _this.setState({ listItems: _temp, selectedFilter: "All", selectedOrderBy: "Latest" });
            //this.setSwiper();
            _this.inputSearch.focus();
        });
    };
    Home.prototype.componentDidUpdate = function () {
        this.inputSearch.focus();
    };
    // Make a service call to get the user details
    Home.prototype.getCurrentUserDetails = function () {
        var _this = this;
        this.props.listService.getCurrentUserDetails().then(function (result) {
            _this.setState({
                // Set the returned user object to state
                currentUser: result
            });
        });
    };
    // Return different markup when user has already likes the component
    // and different markup when user is yet to like the component
    Home.prototype.renderLike = function (item, index) {
        // Determine like image url
        var siteUrl = this.props.siteUrl;
        var likeActiveImgUrl = siteUrl + "/siteassets/images/like-red.png";
        var likeInactiveImgUrl = siteUrl + "/siteassets/images/unlike-red.png";
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
        return (React.createElement("div", { className: "item-content-like-symbol" },
            React.createElement("div", { className: likeClass, id: "divLike" + index },
                React.createElement("a", { href: "#", onClick: this.onSetLike.bind(this, index, item) },
                    React.createElement("img", { src: likeActiveImgUrl, id: "like-red" }))),
            React.createElement("div", { className: unlikeClass, id: "divUnlike" + index },
                React.createElement("a", { href: "#", onClick: this.onSetLike.bind(this, index, item) },
                    React.createElement("img", { src: likeInactiveImgUrl, id: "unlike-red" })))));
    };
    /**
     * This method renders the swiper using properteis
     */
    Home.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("nav", null,
                React.createElement("div", { className: "content content-container" },
                    React.createElement("ul", { className: "latest_links" },
                        React.createElement("li", { className: this.state.latestLnkCssClass },
                            React.createElement("a", { href: "#", onClick: this.onLatestSort }, "Latest Added")),
                        React.createElement("li", { className: this.state.likeLnkCssClass },
                            React.createElement("a", { href: "#", onClick: this.onLikeSort }, "Top Liked"))))),
            React.createElement("div", { className: "main-content" },
                React.createElement("div", { className: "content-container" },
                    React.createElement("div", { className: "all_components_dropdwn" },
                        React.createElement("div", { className: "dropdown-div" },
                            React.createElement("label", null, "Show"),
                            React.createElement(Dropdown, { onChanged: this._LoadFilters, defaultSelectedKey: "All", options: _filterArray1 }),
                            React.createElement("input", { ref: function (input) { _this.inputSearch = input; }, className: "hide-on-ui", type: "button" }))),
                    React.createElement("div", { className: "items" }, this.state.listItems.length &&
                        this.state.listItems.map(function (listItem, index) {
                            var redirectUrl = _this.props.swiperOptions.redirectURL;
                            // Get the siteurl from property
                            return React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item-content" },
                                    React.createElement("div", { className: "item-content-text" },
                                        React.createElement("a", { href: redirectUrl + "?ComponentID=" + listItem.id },
                                            React.createElement("p", { className: "item-p" },
                                                " ",
                                                listItem.title.length > 25 ? listItem.title.slice(0, 25) + "..." : listItem.title,
                                                "  "),
                                            React.createElement("p", null, listItem.shortDescription.length > 120 ? listItem.shortDescription.slice(0, 120) + "..." : listItem.shortDescription))),
                                    _this.renderLike(listItem, index),
                                    React.createElement("div", { className: "item-content-likes-count", id: "divLikeCount" + index },
                                        (listItem.likesCount != null && Number(listItem.likesCount) > 0) ? listItem.likesCount : "",
                                        " ",
                                        (listItem.likesCount != null && Number(listItem.likesCount) > 0) ? Number(listItem.likesCount) > 1 ? "Likes" : "Like" : "")));
                        }))))));
    };
    return Home;
}(React.Component));
export default Home;
//# sourceMappingURL=Home.js.map