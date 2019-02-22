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
                "ComponentOwner": [{}],
                "ArtifactsLocation": { "Description": "", "Url": "" },
                "ComponentFeatures": [],
                "TechnologyStack": [],
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
            componentOwnerDetails: [{ "Title": "", "Email": "" }],
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
        //this.id="6";
        // Service call to fetch the component details by component id
        pnp.sp.web.lists.getByTitle(inventoryList).items
            .getById(Number(this.id))
            .expand("ComponentOwner", "ComponentFeatures", "ComponentFeatures", "TechnologyStack0", "LikedBy")
            .select("ComponentTitle", "ComponentDescription", "ShortDescription", "ComponentImage", "DemoUrl", "ComponentLimitations", "ComponentOwner/Title", "ComponentOwner/UserName", "ComponentOwner/Id", "ArtifactsLocation", "ComponentFeatures/Title", "TechnologyStack0/Title", "FavoriteAssociates", "LikedBy/Id", "LikedById", "LikesCount")
            .get()
            .then(function (data) {
            console.log(data);
            if (data.ComponentOwner != null) {
                data.ComponentOwner.map(function (d, id) {
                    _this.getCompOwnerDetails(d.Id);
                });
            }
            // When anyone is yet to like the component, LikesCount comes as null. 
            // Set it as 0 in case it is null
            if (data.LikesCount == null) {
                data.LikesCount = 0;
            }
            data.ComponentDescriptionContent = { __html: data.ComponentDescription };
            data.TechnologyStack = data.TechnologyStack0;
            reactHandler.setState({
                // Assign returned list item data to state
                item: data
            });
            console.log(data);
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
            return (React.createElement("button", { className: "col-md-12 btn btn-default" },
                React.createElement("i", { className: "fa fa-chevron-right", "aria-hidden": "true" }),
                React.createElement("a", { target: "_blank", href: this.state.item.DemoUrl.Url, className: styles.link }, "View Component Demo")));
        }
        else {
            // Show message
            return (React.createElement("a", null,
                React.createElement("label", null, "No Demo available")));
        }
    };
    // Check the artifact files are available or not
    // If artifacts are not available, show some message, else show the files as listed elements
    SpComponentDetails.prototype.renderArtifacts = function () {
        if (this.state.artifacts != null && this.state.artifacts.length > 0) {
            // Build the markup for document links
            var artifactMarkup = this.state.artifacts.map(function (d, idx) {
                return (React.createElement("a", { href: d.ServerRelativeUrl }, d.Name));
            });
            return (artifactMarkup);
        }
        else {
            // Show message
            return (React.createElement("a", null, "No resource file available"));
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
            console.log("owner detail");
            console.log(result);
            reactHandler.state.componentOwnerDetails.push(result);
            console.log(reactHandler.state.componentOwnerDetails);
            if (reactHandler.state.componentOwnerDetails.length >= reactHandler.state.item.ComponentOwner.length) {
                var compOwners = reactHandler.state.componentOwnerDetails;
                reactHandler.setState({
                    // Set the returned user object to state
                    componentOwnerDetails: compOwners
                });
            }
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
        return (React.createElement("div", { className: "main-content" },
            React.createElement("div", { className: "content-container" },
                React.createElement("div", { className: "" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-md-12 compTitle paddingLeft0" },
                            React.createElement("h3", { className: "" }, escape(this.state.item.ComponentTitle))),
                        React.createElement("div", { className: "col-md-12 topTitle paddingLeft0" },
                            React.createElement("div", { className: "col-md-10 col-sm-9 padding0 topLeftTitle" },
                                React.createElement("div", { className: "padding0 lFloat" },
                                    React.createElement("label", { className: "caption" }, "Technology:"),
                                    React.createElement("label", { className: "description" }, this.state.item.TechnologyStack.map(function (d, idx) {
                                        if (idx == 0) {
                                            return (d.Title);
                                        }
                                        else {
                                            return ", " + (d.Title);
                                        }
                                    }))),
                                React.createElement("span", { className: "pipe" }, "|"),
                                React.createElement("div", { className: "padding0 lFloat" },
                                    React.createElement("label", { className: "caption" }, "Feature:"),
                                    React.createElement("label", { className: "description" }, this.state.item.ComponentFeatures.map(function (d, idx) {
                                        if (idx == 0) {
                                            return (d.Title);
                                        }
                                        else {
                                            return ", " + (d.Title);
                                        }
                                    })))),
                            React.createElement("div", { className: "col-md-2 col-sm-3 topRightTitle padding0" },
                                React.createElement("div", { className: "lFloat" },
                                    React.createElement("label", { className: "caption" }, "Date:"),
                                    React.createElement("label", { className: "description" }, "24.06.2018")),
                                (this.state.item.LikesCount != null && Number(this.state.item.LikesCount) > 0) ? React.createElement("span", { className: "pipe" }, "|") : "",
                                React.createElement("div", { className: "lFloat" },
                                    React.createElement("label", { className: "description" },
                                        (this.state.item.LikesCount != null && Number(this.state.item.LikesCount) > 0) ? this.state.item.LikesCount : "",
                                        " ",
                                        (this.state.item.LikesCount != null && Number(this.state.item.LikesCount) > 0) ? Number(this.state.item.LikesCount) > 1 ? "Likes" : "Like" : "")))),
                        React.createElement("div", { className: "col-md-12 noteContent paddingLeft0 " },
                            React.createElement("div", { className: "col-md-8 col-xs-12 paddingLeft0 leftContent" },
                                React.createElement("div", { className: "col-md-12 shortNoteSection paddingLeft0" },
                                    React.createElement("div", { className: "col-md-12 shortNote paddingLeft0" },
                                        React.createElement("h3", null, "Description:"),
                                        React.createElement("p", { dangerouslySetInnerHTML: this.state.item.ComponentDescriptionContent })),
                                    React.createElement("div", { className: "col-md-6 addtoFav" },
                                        React.createElement("div", { className: "col-md-6 paddingLeft0 addFavSection" },
                                            React.createElement("span", { className: "starIcon" }),
                                            React.createElement("label", null, " Add to favorite")),
                                        React.createElement("div", { className: "col-md-6 paddingLeft0 likeSection" },
                                            React.createElement("span", { className: "likeIcon" }),
                                            React.createElement("label", null, " Like"))))),
                            React.createElement("div", { className: "col-md-4 col-xs-12 rightContent" },
                                React.createElement("div", { className: "col-md-12 padding0" },
                                    React.createElement("h3", { className: "compowner" }, " Component Owner ")),
                                this.state.componentOwnerDetails.map(function (d, index) {
                                    if (index != 0) {
                                        return (React.createElement("div", { className: "col-md-12 compownerSection" },
                                            React.createElement("div", { className: "col-md-3 col-xs-1 padding0" },
                                                React.createElement("img", { className: "ms-Image-image is-loaded ms-Image-image--cover ms-Image-image--portrait is-fadeIn image-91 compownerPic", src: "/_layouts/15/userphoto.aspx?size=S&amp;accountname=" + d.UserName, alt: "" })),
                                            React.createElement("div", { className: "col-md-9 col-xs-11 padding0" },
                                                React.createElement("span", { className: "col-md-12 col-xs-12 compownerName" },
                                                    d.Title,
                                                    " "),
                                                React.createElement("span", { className: "col-md-12 col-xs-12 compownerDesig" },
                                                    d.Designation,
                                                    "  "),
                                                React.createElement("span", { className: "col-md-12 col-xs-12 compownerUnit" },
                                                    d.Department,
                                                    " "),
                                                React.createElement("span", { className: "col-md-3 col-xs-3 compownerEmailField" }, "Email: "),
                                                React.createElement("a", { className: "col-md-9 col-xs-9 compownerEmail" }, d.Email))));
                                    }
                                }),
                                React.createElement("div", { className: "col-md-12 compDemo" }, this.renderDemoLink()),
                                React.createElement("div", { className: "col-md-12 addRes" },
                                    React.createElement("h3", { className: "" }, "Additional Resource"),
                                    React.createElement("div", { className: "listOfRes" }, this.renderArtifacts()))),
                            React.createElement("br", null),
                            React.createElement("br", null)))))));
        {
        }
    };
    return SpComponentDetails;
}(React.Component));
export default SpComponentDetails;
//# sourceMappingURL=SpComponentDetails.js.map