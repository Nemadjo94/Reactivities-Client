import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// On routing scroll to top of the page
const ScrollToTop = ({ children, location: { pathname }}: any) => {
    useEffect(() => {
        window.scrollTo(0,0);
    }, [pathname]);

    return children;

};

export default withRouter(ScrollToTop);