import { useState } from "react";
import moment from "moment";
import sneakers from "./sneakers";

const colorSet = new Set();
const genderSet = new Set();
sneakers.forEach((sneaker) => {
  colorSet.add(sneaker.color.toLowerCase());

  if (Array.isArray(sneaker.gender)) {
    sneaker.gender.forEach((gender) => genderSet.add(gender));
  }
});
const colors = [...colorSet];
const colorMap = {
  cream: "#FFFDD0",
  "multi-color": "transparent",
};
const genders = [...genderSet];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [sort, setSort] = useState("a-z");
  window.moment = moment;
  const handleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
  };

  const filteredSneakers = sneakers.filter((sneaker) => {
    const nameOrNicknameMatches =
      sneaker.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      sneaker.nickname.toLowerCase().includes(query.trim().toLowerCase());

    const colorMatches =
      selectedColors.length > 0
        ? selectedColors.includes(sneaker.color.toLowerCase())
        : true;

    return nameOrNicknameMatches && colorMatches;
  });

  return (
    <>
      <h1>Nike </h1>
      <div className="content">
        {isSidebarOpen && (
          <aside>
            <div>
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleSearch}
              />
            </div>
            <div className="colors">
              {colors.map((color) => {
                return (
                  <button
                    className="color"
                    style={{
                      backgroundColor: colorMap[color]
                        ? colorMap[color]
                        : color,
                      borderWidth: selectedColors.includes(color) ? 2 : 1,
                    }}
                    key={color}
                    onClick={() => {
                      setSelectedColors((prevColors) => {
                        if (prevColors.includes(color)) {
                          // already exists
                          return prevColors.filter((c) => c !== color);
                        } else {
                          return [...prevColors, color];
                        }
                      });
                    }}
                  ></button>
                );
              })}
            </div>

            <div className="genders">
              {genders.map((gender) => {
                return <button key={gender}>{gender}</button>;
              })}
            </div>
          </aside>
        )}
        <main>
          <div className="options">
            <button onClick={handleSidebar}>
              {isSidebarOpen ? "Hide" : "Show"} Filter
            </button>
            <select onChange={handleSort} value={sort}>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-desc">Price High - Low</option>
              <option value="price-asc">Price Low - High</option>
            </select>
          </div>
          <div className="shoes-gallery">
            {filteredSneakers.length > 0 ? (
              filteredSneakers
                .sort((a, b) => {
                  switch (sort) {
                    case "a-z":
                      return a.name < b.name ? -1 : 1;
                    case "z-a":
                      return a.name > b.name ? -1 : 1;
                    case "oldest":
                      return a.release_date_unix - b.release_date_unix;
                    case "newest":
                      return b.release_date_unix - a.release_date_unix;
                    case "price-desc":
                      return a.retail_price_cents - b.retail_price_cents;
                    case "price-asc":
                      return b.retail_price_cents - a.retail_price_cents;
                  }
                })
                .map((sneaker) => {
                  return (
                    <div className="shoes-gallery-item" key={sneaker.id}>
                      <img src={sneaker.grid_picture_url} alt={sneaker.name} />
                      <p>
                        <strong>{sneaker.name}</strong>
                      </p>
                      <p>
                        {sneaker.release_date &&
                          moment(sneaker.release_date).format("MM/DD/YY")}
                      </p>
                      <p>
                        {sneaker.retail_price_cents &&
                          `$${sneaker.retail_price_cents / 100}`}
                      </p>
                    </div>
                  );
                })
            ) : (
              <p>There are no results.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

/*
id
brand_name
color
gender
grid_picture_url
name
nickname
release_date
release_year
retail_price_cents
shoe_condition
silhouette
size_range
story_html
*/
