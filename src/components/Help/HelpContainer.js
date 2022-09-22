import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import showdown from "showdown";
import * as appActions from "_core/actions/appActions";
import { HelpContainer as HelpContainerCore } from "_core/components/Help/HelpContainer.js";

export class HelpContainer extends HelpContainerCore {
    constructor(props) {
        super(props);

        // set up our markdown converter
        let cvt = new showdown.Converter();
        cvt.setFlavor("github");

        // set up our pages config
        this.helpPageConfig = {
            ABOUT: {
                key: "ABOUT",
                label: "About",
                content: cvt.makeHtml(require("default-data/eosc-data/help/about.md"))
            },
            FAQ: {
                key: "FAQ",
                label: "FAQ",
                content: cvt.makeHtml(require("default-data/eosc-data/help/faq.md"))
            },
            SYS_REQ: {
                key: "SYS_REQ",
                label: "System Requirements",
                content: cvt.makeHtml(require("default-data/eosc-data/help/systemReqs.md"))
            }
        };
        // TODO costumize datadir
        // const datadir = appConfig.DATA_DIRECTORY || "default-data/_core_default-data";
        // this.helpPageConfig = {
        //     ABOUT: {
        //         key: "ABOUT",
        //         label: "About",
        //         content: cvt.makeHtml(require(datadir +  "help/about.md"))
        //     },
        //     FAQ: {
        //         key: "FAQ",
        //         label: "FAQ",
        //         content: cvt.makeHtml(require(datadir + "/help/faq.md"))
        //     },
        //     SYS_REQ: {
        //         key: "SYS_REQ",
        //         label: "System Requirements",
        //         content: cvt.makeHtml(require(datadir + "/help/systemReqs.md"))
        //     }
        // };
    }
}

HelpContainer.propTypes = {
    appActions: PropTypes.object.isRequired,
    helpOpen: PropTypes.bool.isRequired,
    helpPage: PropTypes.string.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        helpOpen: state.help.get("isOpen"),
        helpPage: state.help.get("helpPage")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpContainer);
