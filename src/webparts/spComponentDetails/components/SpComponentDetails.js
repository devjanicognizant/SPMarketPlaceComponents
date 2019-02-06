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
import styles from './SpComponentDetails.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { Column, Row } from 'simple-flexbox';
import pnp from 'sp-pnp-js';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import LogManager from '../../LogManager';
// React enabled component class implementing property and state interfaces
var SpComponentDetails = (function (_super) {
    __extends(SpComponentDetails, _super);
    function SpComponentDetails(props, state) {
        var _this = _super.call(this, props) || this;
        // Initialize the state
        _this.state = {
            artifacts: [],
            item: {
                "ComponentTitle": "",
                "ComponentDescription": "",
                "ComponentDescriptionContent": { __html: "" },
                "ShortDescription": "",
                "ComponentImage": { "Description": "", "Url": "" },
                "DemoUrl": { "Description": "", "Url": "" },
                "ComponentLimitations": "",
                "ComponentOwner": {},
                "ArtifactsLocation": { "Description": "", "Url": "" },
                "ComponentFeatures": [],
                "FavoriteAssociates": "",
                "LikedById": [],
                "LikesCount": 0
            },
            currentUser: {
                "Id": 0,
                "Email": "",
                "LoginName": "",
                "Title": ""
            },
            componentOwnerDetails: { "Email": "" },
            inventoryListId: ""
        };
        return _this;
    }
    // Fetch the component details
    // Fetch the current user details
    // Fetch the component document set as well as artifact files
    SpComponentDetails.prototype.componentDidMount = function () {
        var _this = this;
        var reactHandler = this;
        // Get the siteurl from property
        var siteUrl = this.props.siteurl;
        // Get list names from properties
        var artifactListName = this.props.artifactsListName;
        var inventoryList = this.props.inventoryListName;
        // Get the user details
        this.getCurrentUserDetails();
        // Get the inventory list Id and put it into state
        this.getInventoryListId();
        // Get component id from query string
        var queryParameters = new UrlQueryParameterCollection(window.location.href);
        this.id = queryParameters.getValue("ComponentID");
        //this.id="4";
        // Service call to fetch the component details by component id
        pnp.sp.web.lists.getByTitle(inventoryList).items
            .getById(Number(this.id))
            .expand("ComponentOwner", "ComponentFeatures", "LikedBy")
            .select("ComponentTitle", "ComponentDescription", "ShortDescription", "ComponentImage", "DemoUrl", "ComponentLimitations", "ComponentOwner/Title", "ComponentOwner/UserName", "ComponentOwner/Id", "ArtifactsLocation", "ComponentFeatures/Title", "FavoriteAssociates", "LikedBy/Id", "LikedById", "LikesCount")
            .get()
            .then(function (data) {
            if (data.ComponentOwner.Id != null) {
                _this.getCompOwnerDetails(data.ComponentOwner.Id);
            }
            // When anyone is yet to like the component, LikesCount comes as null. 
            // Set it as 0 in case it is null
            if (data.LikesCount == null) {
                data.LikesCount = 0;
            }
            data.ComponentDescriptionContent = { __html: data.ComponentDescription };
            reactHandler.setState({
                // Assign returned list item data to state
                item: data
            });
            // Service call Get artifact document set for the component
            pnp.sp.web.lists.getByTitle(artifactListName).items
                .expand("Folder", "Folder/ComponentID", "Folder/ComponentID/Id")
                .filter("ComponentID/Id eq " + _this.id)
                .get()
                .then(function (folders) {
                if (folders.length > 0) {
                    // Get the folder relative url for the document set
                    var artifactLocationRelativeUrl = folders[0].Folder.ServerRelativeUrl;
                    // Service call to fetch the files from the document set
                    pnp.sp.web.getFolderByServerRelativeUrl(artifactLocationRelativeUrl).files.get()
                        .then(function (documents) {
                        reactHandler.setState({
                            // Assign returned files to state
                            artifacts: documents
                        });
                    })
                        .catch(function (error) {
                        LogManager.logException(error, "Error occured while fetching component artifact files from document set", "Cpmponent Details", "componentDidMount");
                    });
                }
            })
                .catch(function (error) {
                LogManager.logException(error, "Error occured while fetching component artifact document set.", "Cpmponent Details", "componentDidMount");
            });
        })
            .catch(function (error) {
            LogManager.logException(error, "Error occured while fetching component item details.", "Cpmponent Details", "componentDidMount");
        });
    };
    // Check the demo link is set or not
    // If demo link is not set, show message on the page, set show the demo link
    SpComponentDetails.prototype.renderDemoLink = function () {
        if (this.state.item.DemoUrl != null) {
            // Show demo link
            return (React.createElement("p", { className: styles.rcorner },
                React.createElement("a", { target: "_blank", href: this.state.item.DemoUrl.Url, className: styles.link }, "View Demo")));
        }
        else {
            // Show message
            return (React.createElement("p", { className: styles.rcornerDisabled }, "No Demo available"));
        }
    };
    // Check the artifact files are available or not
    // If artifacts are not available, show some message, else show the files as listed elements
    SpComponentDetails.prototype.renderArtifacts = function () {
        if (this.state.artifacts != null && this.state.artifacts.length > 0) {
            // Build the markup for document links
            var artifactMarkup = this.state.artifacts.map(function (d, idx) {
                return (React.createElement("li", { key: idx },
                    React.createElement("a", { href: d.ServerRelativeUrl }, d.Name)));
            });
            return (artifactMarkup);
        }
        else {
            // Show message
            return (React.createElement("li", null, "No resource file available"));
        }
    };
    // Make a service call to get the user details
    SpComponentDetails.prototype.getCurrentUserDetails = function () {
        var reactHandler = this;
        pnp.sp.web.currentUser.get().then(function (user) {
            reactHandler.setState({
                // Set the returned user object to state
                currentUser: user
            });
        })
            .catch(function (error) {
            LogManager.logException(error, "Error occured while fetching current user details.", "Cpmponent Details", "getCurrentUserDetails");
        });
    };
    // Get the inventory list id and put it into state
    SpComponentDetails.prototype.getInventoryListId = function () {
        var list = pnp.sp.web.lists.getByTitle(this.props.inventoryListName);
        var reactHandler = this;
        list.get().then(function (l) {
            reactHandler.setState({
                // Set the list id to state object
                inventoryListId: l.Id
            });
        })
            .catch(function (error) {
            LogManager.logException(error, "Error occured while fetching component inventory list Id", "Component Details", "getInventoryListId");
        });
    };
    // Make a service call to get component owner details by Id
    SpComponentDetails.prototype.getCompOwnerDetails = function (ownerId) {
        var reactHandler = this;
        pnp.sp.web.siteUsers.getById(ownerId).get().then(function (result) {
            reactHandler.setState({
                // Set the returned user object to state
                componentOwnerDetails: result
            });
        })
            .catch(function (error) {
            LogManager.logException(error, "Error occured while fetching component owner details.", "Cpmponent Details", "getCompOwnerDetails");
        });
    };
    // Return different markup when user has already set the component as favourite
    // and different markup when user is yet to set it as favourite
    SpComponentDetails.prototype.renderFavouriteImage = function () {
        // Get user's login name without membership detials part
        var userLoginName = this.state.currentUser.LoginName.split(/[| ]+/).pop();
        // Determine the favourite image url
        var siteUrl = this.props.siteurl;
        var favActiveImgUrl = siteUrl + this.props.activeFavouriteImgUrl;
        var favInactiveImgUrl = siteUrl + this.props.inactiveFavouriteImgUrl;
        if (this.state.item.FavoriteAssociates != null && this.state.item.FavoriteAssociates.toLowerCase().indexOf(userLoginName) != -1) {
            // Markup if user has already set the component as favourite
            return (React.createElement("p", { className: "rcornerDisabled", id: "pFavInactive" },
                React.createElement("span", { className: styles.topAlign }, "Add to favourite "),
                React.createElement("img", { id: "imgFav", src: favInactiveImgUrl })));
        }
        else {
            if (this.state.inventoryListId != "") {
                // Markup if user is yet to set the component as favourite
                return (React.createElement("p", { className: "rcorner", id: "pFavActive" },
                    React.createElement("span", { className: styles.topAlign }, "Add to favourite "),
                    React.createElement("a", { href: "javascript:CognizantCDBMP.addToFavorite('" + this.id + "', 'imgFav','" + this.state.inventoryListId + "');" },
                        React.createElement("img", { id: "imgFav", src: favActiveImgUrl }))));
            }
            else
                return (React.createElement("p", { className: "rcornerDisabled", id: "pFavInactive" }, "ERROR!!"));
        }
    };
    // Return different markup when user has already likes the component
    // and different markup when user is yet to like the component
    SpComponentDetails.prototype.renderLike = function () {
        // Determine like image url
        var siteUrl = this.props.siteurl;
        var likeActiveImgUrl = siteUrl + this.props.activeLikeImgUrl;
        var likeInactiveImgUrl = siteUrl + this.props.inactiveLikeImgUrl;
        // Initially hide both like and unlike divs
        var likeClass = "hide";
        var unlikeClass = "hide";
        // Set the css class based on the status whether user liked the component or not
        if (this.state.item.LikedById != null
            && this.state.item.LikedById.indexOf(this.state.currentUser.Id) != -1) {
            unlikeClass = "show";
        }
        else {
            likeClass = "show";
        }
        // Build the markup applying appropriate css classes
        // Call javascript method on icon click event to like or unlike the component
        // Put a common area to show no of likes for the coponent
        return (React.createElement("div", null,
            React.createElement("p", { id: "pLike", className: [likeClass, styles.rcorner].join(" ") },
                React.createElement("span", { className: styles.topAlign }, "Like it! "),
                React.createElement("a", { href: "javascript:SetLike(true,'" + this.props.inventoryListName + "'," + this.id + ")" },
                    React.createElement("img", { id: "imgLike", className: styles.imgIcon, src: likeActiveImgUrl })),
                React.createElement("span", { className: styles.topAlign }, " ("),
                React.createElement("span", { className: [styles.topAlign, "likeCount"].join(" "), id: "likeCountForLike" }, this.state.item.LikesCount),
                React.createElement("span", { className: styles.topAlign }, ")")),
            React.createElement("p", { id: "pUnlike", className: [unlikeClass, styles.rcorner].join(" ") },
                React.createElement("span", { className: styles.topAlign }, "Unlike it! "),
                React.createElement("a", { href: "javascript:SetLike(false,'" + this.props.inventoryListName + "'," + this.id + ")" },
                    React.createElement("img", { id: "imgLike", className: styles.imgIcon, src: likeInactiveImgUrl })),
                React.createElement("span", { className: styles.topAlign }, " ("),
                React.createElement("span", { className: [styles.topAlign, "likeCount"].join(" "), id: "likeCountForUnlike" }, this.state.item.LikesCount),
                React.createElement("span", { className: styles.topAlign }, ")"))));
    };
    // Build and render the final markup to show on the page
    // simple-flexbox module is used to build row column design
    SpComponentDetails.prototype.render = function () {
        return (React.createElement("div", null, (this.state && this.state.item && this.state.item.ComponentTitle != "") ?
            React.createElement("div", { className: styles.spComponentDetails },
                React.createElement(Row, { className: styles.containerRow },
                    React.createElement(Column, { flexGrow: 1, className: styles.left },
                        React.createElement("div", null,
                            React.createElement("div", { id: "divComponentTitle" },
                                React.createElement("h1", null, escape(this.state.item.ComponentTitle))),
                            React.createElement("div", { id: "divShortDescription" },
                                React.createElement("p", null, escape(this.state.item.ShortDescription))),
                            React.createElement("div", { id: "divComponentDescriptionContent" },
                                React.createElement("p", { dangerouslySetInnerHTML: this.state.item.ComponentDescriptionContent })),
                            React.createElement("div", { id: "divComponentImage" },
                                React.createElement("img", { src: this.state.item.ComponentImage.Url, alt: "" })))),
                    React.createElement(Column, { flexGrow: 1, className: styles.middle }),
                    React.createElement(Column, { flexGrow: 1, className: styles.right },
                        React.createElement("div", null,
                            React.createElement("br", null),
                            React.createElement("div", { id: "divDemoUrl" }, this.renderDemoLink()),
                            React.createElement("br", null),
                            React.createElement("div", { id: "dicAdditionalResourcesHeader" },
                                React.createElement("h2", null, "Additional Resources")),
                            React.createElement("div", { id: "divAdditionalResources" },
                                React.createElement("ul", null, this.renderArtifacts())),
                            React.createElement("br", null),
                            React.createElement("div", { id: "divComponentOwner" },
                                React.createElement("p", { className: styles.rcorner },
                                    React.createElement("a", { href: 'mailto:' + this.state.componentOwnerDetails.Email, className: styles.link }, "Contact Component Owner")))),
                        React.createElement("br", null),
                        React.createElement("div", { id: "divFav" }, this.renderFavouriteImage()),
                        React.createElement("br", null),
                        React.createElement("div", { id: "divLike" }, this.renderLike()))))
            : React.createElement("div", null, "Loading component details. Please wait...")));
    };
    return SpComponentDetails;
}(React.Component));
export default SpComponentDetails;
//# sourceMappingURL=SpComponentDetails.js.map