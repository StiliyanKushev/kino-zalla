import './Film.css';

function Film() {
    return (
        <div className="film">
            <div className="banner">
                <i className="far fa-star"></i>
                <i className="fas fa-play-circle"></i>
            </div>
            <p className="title">The Office</p>
            <p className="duration">2 ч 28 мин</p>
        </div>
    );
}

export default Film;