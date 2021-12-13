import './App.css';

import { ToastContainer } from 'react-toastify';

import BlurOverlay from './components/BlurOverlay/BlurOverlay';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import SideMenu from './components/SideMenu/SideMenu';
import StreamOptions from './components/StreamOptions/StreamOptions';
import { SearchProvider } from './contexts/Search/provider';
import { StreamProvider } from './contexts/Stream/provider';

function App() {
    return (
        <StreamProvider>
            <SearchProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    style={{ width: "600px" }}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={'dark'}
                />
                {/* some components make this visible to disable mouse input */}
                <div className="preventInput"/>
                <StreamOptions/>
                <BlurOverlay/>
                <SideMenu/>
                <main>
                    <Header/>
                    <MainContent/>
                </main>
            </SearchProvider>
        </StreamProvider>
    );
}

export default App;
