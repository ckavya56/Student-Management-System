import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
    return (
        <div className="search">

            <input
                className="text"
                type="text"
                placeholder="Search Student"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

        </div>
    );
}

export default SearchBar;