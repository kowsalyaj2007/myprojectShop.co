import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import "./template.css";

export default function Productwebsitetemplate() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const [page, setPage] = useState("shop");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 16;

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          rating: p.rating,
          category: p.category,
          image: p.thumbnail,
          size: ["XXS", "XS", "S", "M", "L", "XL"][p.id % 6],
          color: ["red", "blue", "green", "black", "white", "yellow"][p.id % 6],
          style: ["Casual", "Formal", "Party", "Gym"][p.id % 4],
        }));
        setProducts(mapped);
      });
  }, []);

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedColor, selectedSize, selectedStyle, selectedCategory, priceRange]);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedColor ? p.color === selectedColor : true) &&
      (selectedSize ? p.size === selectedSize : true) &&
      (selectedStyle ? p.style === selectedStyle : true) &&
      (selectedCategory ? p.category === selectedCategory : true) &&
      p.price <= priceRange
    );
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // EMPTY CARDS TO KEEP GRID SIZE
  const emptySlots = PRODUCTS_PER_PAGE - paginatedProducts.length;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // RENDER PLACEHOLDER GRID FOR OTHER PAGES
  const renderPlaceholderGrid = () => {
    return [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
      <div key={i} className="card placeholder">
        {i === 0 && (
          <h2 className="center-text" style={{ width: "100%" }}>
            {page.toUpperCase()} PAGE
          </h2>
        )}
      </div>
    ));
  };

  return (
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3>Filters</h3>

        {/* CATEGORY */}
        <div className="filter-section">
          <h4>Category</h4>
          {["smartphones", "laptops", "fragrances", "skincare"].map((cat) => (
            <p
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={selectedCategory === cat ? "active-text" : ""}
            >
              {cat}
            </p>
          ))}
        </div>

        {/* PRICE */}
        <div className="filter-section">
          <h4>Price</h4>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
          />
          <p>$0 - ${priceRange}</p>
        </div>

        {/* COLORS */}
        <div className="filter-section">
          <h4>Colors</h4>
          <div className="colors">
            {["red", "blue", "green", "black", "white", "yellow"].map((c) => (
              <span
                key={c}
                className={`color ${selectedColor === c ? "active" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
              />
            ))}
          </div>
        </div>

        {/* SIZE */}
        <div className="filter-section">
          <h4>Size</h4>
          <div className="sizes">
            {["XXS", "XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* STYLE */}
        <div className="filter-section">
          <h4>Style</h4>
          {["Casual", "Formal", "Party", "Gym"].map((style) => (
            <p
              key={style}
              onClick={() => setSelectedStyle(selectedStyle === style ? "" : style)}
              className={selectedStyle === style ? "active-text" : ""}
            >
              {style}
            </p>
          ))}
        </div>

        {/* CLEAR FILTERS */}
        <button
          className="apply-btn"
          onClick={() => {
            setSelectedColor("");
            setSelectedSize("");
            setSelectedStyle("");
            setSelectedCategory("");
            setPriceRange(1000);
          }}
        >
          Clear Filters
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <h1>SHOP.CO</h1>

          <div className="nav-links">
            <span onClick={() => setPage("shop")}>Shop</span>
            <span onClick={() => setPage("sale")}>On Sale</span>
            <span onClick={() => setPage("new")}>New Arrivals</span>
            <span onClick={() => setPage("brands")}>Brands</span>
          </div>

          <input
            className="search-bar"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* GRID CONTENT */}
        <div className="content">
          <div className="grid">
            {page === "shop" ? (
              <>
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <Rating value={product.rating} readOnly precision={0.5} />
                    <p className="price">${product.price}</p>
                  </div>
                ))}
                {[...Array(emptySlots)].map((_, i) => (
                  <div key={"empty-" + i} className="card empty"></div>
                ))}
              </>
            ) : (
              renderPlaceholderGrid()
            )}
          </div>

          {/* PAGINATION ONLY FOR SHOP PAGE */}
          {page === "shop" && (
            <div className="pagination">
              <button onClick={handlePrev}>Prev</button>
              <span>
                Page {currentPage} / {totalPages || 1}
              </span>
              <button onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
