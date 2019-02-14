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
import pnp from 'sp-pnp-js';
import LogManager from '../../LogManager';
// React enabled component class implementing property and state interfaces
var IconBasedNavigation = (function (_super) {
    __extends(IconBasedNavigation, _super);
    function IconBasedNavigation(props, state) {
        var _this = _super.call(this, props) || this;
        // Icon lists to be part of the state
        _this.state = {
            icons: []
        };
        return _this;
    }
    // Fetch the icon list from the configuration list
    // List name is configured as webpart properties
    IconBasedNavigation.prototype.componentDidMount = function () {
        var _this = this;
        var reactHandler = this;
        // Get the site url from property
        var siteUrl = this.props.siteurl;
        // Get icon configuration list name from property
        var iconListName = this.props.iconListName;
        // Service call to fetch active set of icon list from list
        // The list is ordered by QuickLinkOrder column
        // Icons would be skipped if QuickLinkUrl or QuickLinkImage are not set
        pnp.sp.web.lists.getByTitle(iconListName).items
            .select("QuickLinkTitle", "QuickLinkUrl", "QuickLinkImage", "QuickLinkOrder", "LinkTarget", "LinkDescription")
            .orderBy("QuickLinkOrder", true)
            .filter("ItemStatus eq 'Active' and LinkType eq 'Navigation Link'")
            .get()
            .then(function (items) {
            // Local variable to store the relevant links
            var iconsRet = [];
            // Iterate throught eh list of items received from service call
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                // Only add the item having linkurl set
                if (item.QuickLinkUrl != null) {
                    // In case image url is not set, set the default image
                    if (item.QuickLinkImage == null) {
                        var defaultImg = {};
                        defaultImg.Url = _this.props.siteurl + _this.props.defaultImgUrl;
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
            .catch(function (error) {
            LogManager.logException(error, "Error occured while fetching icon details from SP list", "Icon Based Navigation", "componentDidMount");
        });
    };
    // Build and render the markup to the page
    IconBasedNavigation.prototype.render = function () {
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
        React.createElement("div", { className: "competency-container" },
            React.createElement("div", { className: "content-container" },
                React.createElement("div", { className: "competency-header" },
                    React.createElement("p", null, "I View Components by Competency")),
                React.createElement("div", { className: "competency-grids" }, this.state.icons.map(function (d, idx) {
                    return (React.createElement("div", { className: "competency-grid-size" },
                        React.createElement("a", { href: d.LinkTarget },
                            React.createElement("div", { className: "competency-inner-grid" },
                                React.createElement("img", { alt: d.QuickLinkTitle, src: d.QuickLinkImage.Url }),
                                React.createElement("p", { className: "competency-p" }, d.QuickLinkTitle),
                                React.createElement("p", null, d.LinkDescription)))));
                })))));
    };
    return IconBasedNavigation;
}(React.Component));
export default IconBasedNavigation;
//# sourceMappingURL=IconBasedNavigation.js.map