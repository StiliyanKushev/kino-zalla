import './App.css';

import MainContent from './components/MainContent/MainContent';
import SideMenu from './components/SideMenu/SideMenu';

function App() {
    return (
        <>
            {/* <BlurOverlay/> */}
            <SideMenu/>
            <MainContent/>
        </>
    );
}

export default App;
