import React from "react";
import { useSelector, useDispatch } from "react-redux";
import loaderGif from "./Helios-Logo_1_grey-matte.gif";
/*import { Spinner } from "reactstrap";*/
import "./LoaderComp.css";

const LoaderComp = () => {

    const isLoading = useSelector(state => state.rootReducer.Loader);


    return (
        <div className={`loader ${isLoading ? "visible" : "hidden"}`}>
            {/*   <Spinner color="primary" />*/}
            <img src={loaderGif} alt="Loading..." />
        </div>
    );
};

export default LoaderComp;