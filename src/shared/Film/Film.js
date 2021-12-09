import './Film.css';

function Film(props) {
    const background = `linear-gradient(180deg, rgba(0, 0, 0, 0) 66.15%, #000000 100%), url(${props.url})`;
    
    return (
        <div className="film">
            <div className="banner" style={{ background }}>
                <i className="far fa-star"></i>
                <i className="fas fa-play-circle"></i>
            </div>
            <p className="title">Movie Title</p>
            <p className="duration">2h 30min</p>
        </div>
    );
}

export default Film;