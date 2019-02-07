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
        _this.onLike = function () {
            _this.setState({ latestLnkCssClass: "", likeLnkCssClass: "active" });
            _this._LoadFavourites("Most Liked");
        };
        _this.onLatest = function () {
            _this.setState({ latestLnkCssClass: "active", likeLnkCssClass: "" });
            _this._LoadFavourites("Latest");
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
            }
            catch (e) {
                LogManager.logException(e, "Error occured while load favourites.", "_LoadFilters", "ReactSlideSwiper");
            }
        };
        _this.state = { listItems: [], selectedFilter: "All", selectedOrderBy: "Latest", latestLnkCssClass: "active", likeLnkCssClass: "" };
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
        });
    };
    /**
     * This method renders the swiper using properteis
     * Card component will be used inside this to render images.
     */
    Home.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("nav", null,
                React.createElement("div", { className: "content content-container" },
                    React.createElement("ul", { className: "latest_links" },
                        React.createElement("li", { className: this.state.latestLnkCssClass },
                            React.createElement("a", { href: "#", onClick: this.onLatest }, "Latest Added")),
                        React.createElement("li", { className: this.state.likeLnkCssClass },
                            React.createElement("a", { href: "#", onClick: this.onLike }, "Top Liked"))))),
            React.createElement("div", { className: "main-content" },
                React.createElement("div", { className: "content-container" },
                    React.createElement("div", { className: "all_components_dropdwn" },
                        React.createElement("div", { className: "dropdown-div" },
                            React.createElement("label", null, "Show"),
                            React.createElement(Dropdown, { onChanged: this._LoadFilters, defaultSelectedKey: "All", options: _filterArray1 }))),
                    React.createElement("div", { className: "items" }, this.state.listItems.length &&
                        this.state.listItems.map(function (listItem, i) {
                            var redirectUrl = _this.props.swiperOptions.redirectURL;
                            return React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item-content" },
                                    React.createElement("div", { className: "item-content-text" },
                                        React.createElement("a", { href: redirectUrl + "?ComponentID=" + listItem.id },
                                            React.createElement("p", null,
                                                " ",
                                                React.createElement("h3", null,
                                                    " ",
                                                    listItem.title,
                                                    " "),
                                                " "))),
                                    React.createElement("div", { className: "item-content-like-symbol" },
                                        React.createElement("a", { href: "#" },
                                            React.createElement("img", { src: "images/like-red.png", id: "like-red" }))),
                                    React.createElement("div", { className: "item-content-likes-count" },
                                        React.createElement("a", { href: "#" }, "Count"))));
                        }))))));
    };
    return Home;
}(React.Component));
export default Home;
//# sourceMappingURL=Home.js.map