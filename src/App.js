import './App.css';

import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import SideMenu from './components/SideMenu/SideMenu';

function App() {
    return (
        <>
            {/* <BlurOverlay/> */}
            <SideMenu/>
            <main>
                <Header/>
                <MainContent/>
            </main>
        </>
    );
}

export default App;
