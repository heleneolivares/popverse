import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import CardProduct from "../components/CardProduct"; // Import your CardProduct component
import { api } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = ({ darkMode }) => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState("price");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                toast.error("Error al cargar productos")
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(
            (product) =>
                product.category.toLowerCase() === categoryName.toLowerCase() &&
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [products, categoryName, searchTerm]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        if (sortBy === "price") {
            return sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === "alphabetical") {
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        return sorted;
    }, [filteredProducts, sortBy]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <div className={`container ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
            <h1 className="text-center my-4">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h1>

            {/* Search bar */}
            <div className="mb-4">
                <input
                type="text"
                className="form-control"
                placeholder="Filtrar productos..."
                value={searchTerm}
                onChange={handleSearch}
                />
            </div>

            {/* Sorting options */}
            <div className="mb-4">
                <select className="form-select" value={sortBy} onChange={handleSortChange}>
                    <option value="price">Ordenar por Precio</option>
                    <option value="alphabetical">Ordenar Alfabeticamente</option>
                </select>
            </div>

            {/* Product grid */}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <CardProduct product={product} darkMode={darkMode} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No se encontraron productos en esta categoria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Category;
