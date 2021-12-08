import './SearchBar.css';

function SearchBar() {
    return (
        <form className="search">
            <input type="text" placeholder="Търси филми..." />
            <i className="fas fa-search"></i>
        </form>
    );
}

export default SearchBar;