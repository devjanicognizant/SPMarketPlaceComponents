var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import pnp from "sp-pnp-js";
import LogManager from '../LogManager';
var ListMock = (function () {
    function ListMock() {
    }
    /**
     * This method fetch and return dataset from sharepoint list using PNP
     */
    ListMock.prototype.getAll = function (options) {
        //Logger.subscribe(new ConsoleListener());
        return new Promise(function (resolve) {
            var data = [];
            pnp.sp.web.lists.getByTitle(options.sourceList).items
                .filter("ComponentStatus eq 'Active'")
                .select("ID", options.titleColumnName, options.imageColumnName, 'Modified', "ComponentCategory/Title", 'LikesCount', 'ShortDescription', "LikedBy/Id", "LikedById")
                .expand("ComponentCategory", "LikedBy")
                .orderBy(options.orderBy, options.isAsending)
                .get().then(function (r) {
                for (var i = 0; i < r.length; i++) {
                    data.push({ id: r[i].ID, title: r[i][options.titleColumnName], modified: r[i].Modified, imageUrl: r[i][options.imageColumnName].Url, componentCategory: (r[i]["ComponentCategory"]).Title, likesCount: r[i].LikesCount, shortDescription: r[i].ShortDescription, likedById: r[i].LikedById });
                }
                resolve(data);
            })
                .catch(function (e) {
                LogManager.logException(e, "Error occured while fetching data from sharepoint list.", "getAll", "ListMock");
            });
        });
    };
    ListMock.prototype.getAllRefByCategory = function (sourceList) {
        //Logger.subscribe(new ConsoleListener());
        return new Promise(function (resolve) {
            var data = [];
            pnp.sp.web.lists.getByTitle(sourceList).items
                .filter("ComponentStatus eq 'Active'")
                .select("ID", "ComponentCategory/Title")
                .expand("ComponentCategory")
                .get().then(function (r) {
                for (var i = 0; i < r.length; i++) {
                    data.push({ id: r[i].ID, title: "", modified: "", imageUrl: "", componentCategory: (r[i]["ComponentCategory"]).Title, likesCount: "", shortDescription: "", likedById: [] });
                }
                resolve(data);
            })
                .catch(function (e) {
                LogManager.logException(e, "Error occured while fetching data from sharepoint list.", "getAllRefByCategory", "ListMock");
            });
        });
    };
    // Make a service call to get the user details
    ListMock.prototype.getCurrentUserDetails = function () {
        return new Promise(function (resolve) {
            pnp.sp.web.currentUser.get().then(function (user) {
                resolve(user);
            })
                .catch(function (error) {
                LogManager.logException(error, "Error occured while fetching current user details.", "ListMock", "getCurrentUserDetails");
            });
        });
    };
    ListMock.prototype.updateListItem = function (listTitle, itemId, itemInformation) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = pnp.sp.web.lists.getByTitle(listTitle);
                        return [4 /*yield*/, list.items.getById(itemId)
                                .update(itemInformation)
                                .then(function (i) { console.log(i); })
                                .catch(function (error) { console.log(error); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListMock.prototype.setLikes = function (listTitle, itemId, likedByUsers, likesCount, currentUserId) {
        var _this = this;
        return new Promise(function (resolve) {
            var newLikedBy = [];
            if (likedByUsers != undefined && likedByUsers.filter(function (a) { return a == currentUserId; }).length > 0) {
                newLikedBy = likedByUsers.filter(function (a) { return a != currentUserId; });
                likesCount = (likesCount != null && likesCount > 0) ? likesCount - 1 : 0;
            }
            else {
                newLikedBy = (likedByUsers != undefined) ? likedByUsers : [];
                newLikedBy.push(currentUserId);
                likesCount = (likesCount != null && likesCount > 0) ? likesCount + 1 : 1;
            }
            var itemInformation = {
                LikedById: { results: newLikedBy },
                LikesCount: likesCount
            };
            _this.updateListItem(listTitle, itemId, itemInformation);
            resolve(itemInformation);
        });
    };
    ListMock.prototype.setFavourites = function (listTitle, itemId, favouritesAssociates, currentUserId) {
        var newfavouriteAssociates = [];
        if (favouritesAssociates != undefined && favouritesAssociates.filter(function (a) { return a == currentUserId; }).length > 0) {
            newfavouriteAssociates = newfavouriteAssociates.filter(function (a) { return a != currentUserId; });
        }
        else {
            newfavouriteAssociates = (newfavouriteAssociates != undefined) ? newfavouriteAssociates : [];
            newfavouriteAssociates.push(currentUserId);
        }
        var itemInformation = {
            FavouritesAssociates: newfavouriteAssociates.toString()
        };
        this.updateListItem(listTitle, itemId, itemInformation);
        return itemInformation;
    };
    return ListMock;
}());
export { ListMock };
//# sourceMappingURL=ListMock.js.map