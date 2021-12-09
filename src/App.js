import './App.css';

import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import SideMenu from './components/SideMenu/SideMenu';
import { SearchProvider } from './contexts/Search/provider';

function App() {
    return (
        <SearchProvider>
            {/* <BlurOverlay/> */}
            <SideMenu/>
            <main>
                <Header/>
                <MainContent/>
            </main>
        </SearchProvider>
    );
}

export default App;
