import './Footer.css';

function Footer() {
    return (
        <div className="footer">
            <ul className="page-indexer">
                <li className="selected"><span>1</span></li>
                <li><span>2</span></li>
                <li><span>3</span></li>
                <li><span>4</span></li>
                <li className="dots"><div></div><div></div><div></div></li>
                <li><span>51</span></li>
            </ul>
            <p className="system-information">Intel Core i7 8700 80% 5.3GB/16GB 320GB/2TB 23h 15min</p>
        </div>
    );
}

export default Footer;