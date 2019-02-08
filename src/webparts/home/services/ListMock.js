import pnp from "sp-pnp-js";
import LogManager from '../../LogManager';
var ListMock = (function () {
    function ListMock() {
    }
    /**
     * This method fetch and return dataset from sharepoint list using PNP
     */
    ListMock.prototype.getAll = function (options) {
        //Logger.subscribe(new ConsoleListener());
        return new Promise(function (resolve) {
            var sliderdata = [];
            pnp.sp.web.lists.getByTitle(options.sourceList).items
                .filter("ComponentStatus eq 'Approved'")
                .select("ID", options.titleColumnName, options.imageColumnName, 'Modified', "ComponentCategory0/Title", 'LikesCount', 'ShortDescription')
                .expand("ComponentCategory0")
                .orderBy(options.orderBy, options.isAsending)
                .get().then(function (r) {
                for (var i = 0; i < r.length; i++) {
                    sliderdata.push({ id: r[i].ID, title: r[i][options.titleColumnName], modified: r[i].Modified, imageUrl: r[i][options.imageColumnName].Url, componentCategory: (r[i]["ComponentCategory0"]).Title, likesCount: r[i].LikesCount, shortDescription: r[i].ShortDescription });
                }
                resolve(sliderdata);
            })
                .catch(function (e) {
                LogManager.logException(e, "Error occured while fetching data from sharepoint list.", "getAll", "ListMock");
            });
        });
    };
    return ListMock;
}());
export { ListMock };
//# sourceMappingURL=ListMock.js.map