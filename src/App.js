import './App.css';

import { ToastContainer } from 'react-toastify';

import BlurOverlay from './components/BlurOverlay/BlurOverlay';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import SideMenu from './components/SideMenu/SideMenu';
import { SearchProvider } from './contexts/Search/provider';

function App() {
    return (
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
            <BlurOverlay/>
            <SideMenu/>
            <main>
                <Header/>
                <MainContent/>
            </main>
        </SearchProvider>
    );
}

export default App;
