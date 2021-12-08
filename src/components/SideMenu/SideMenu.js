import './SideMenu.css';

import Recommendations from '../Recommendations/Recommendations';
import SearchBar from '../SearchBar/SearchBar';

function SideMenu() {
    return (
        <div className="side-menu">
            <SearchBar />
            <Recommendations />
        </div>
    );
}

export default SideMenu;
