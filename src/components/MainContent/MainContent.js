import './MainContent.css';

import Film from '../../shared/Film/Film';
import Footer from '../Footer/Footer';

function MainContent() {
    return (
        <div className="main-content">
            <div className="films-holder">
                <div className="row">
                    <Film/>
                    <Film/>
                    <Film/>
                    <Film/>
                    <Film/>
                </div>
                <div className="row">
                    <Film/>
                    <Film/>
                    <Film/>
                    <Film/>
                    <Film/>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MainContent;