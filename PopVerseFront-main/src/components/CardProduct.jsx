import React, { useState, useEffect, useContext } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { Offcanvas } from "bootstrap";
import "react-toastify/dist/ReactToastify.css";

import "../assets/css/CardProduct.css";


export default function CardProduct({ product, darkMode, removeFromFavorites }) {
    const [isFav, setIsFav] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { addToCart } = useCart();
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (!token) return;

            try {
                const response = await api.get("/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const favorites = response.data.favorites || [];
                const isFavorite = favorites.some((fav) => fav.id === product.id);
                setIsFav(isFavorite);
            } catch (error) {
                console.error("Error al verificar favoritos:", error);
            }
        };

        checkIfFavorite();
    }, [token, product.id]);

    const handleWishlistClick = async (id) => {
        if (!token) {
            toast.warn("Por favor inicia sesión para gestionar tu lista de deseos.");
            return;
        }

        try {
            if (isFav) {
                // Eliminar de favoritos
                await api.delete(`/favorites/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Producto agregado a tu lista de deseos.");
                removeFromFavorites(id);
            } else {
                // Agregar a favoritos
                await api.post(
                    "/favorites",
                    { product_id: id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("Producto agregado a tu lista de deseos.");
            }

            // Alternar el estado de favorito
            setIsFav(!isFav);
        } catch (error) {
            console.error("Error al gestionar el producto en favoritos:", error);
            toast.error("Hubo un error al gestionar el producto en tu lista de deseos.");
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price * (1 - discount / 100);
    };

    const handleNavigateToDetails = () => {
        navigate(`/product/${product.id}`);
    }

    const handleAddToCart = (product) => {
        addToCart(product);
        const cartOffcanvasEl = document.getElementById("cartOffcanvas");
        if (cartOffcanvasEl) {
            const bsOffcanvas = new Offcanvas(cartOffcanvasEl);
            bsOffcanvas.show()
        }
    };

    return (
        <div
            className={`card custom-card border-0 rounded-4 p-3 d-flex flex-column ${
                darkMode ? "bg-dark text-white card-shadow-light" : "bg-white text-dark"
            }`}
            style={{
                width: "250px",
                height: isMobile ? "370px" : "420px",
            }}
        >

            {/* Wishlist Heart */}
            <div
                onClick={() => handleWishlistClick(product.id)}
                style={{ cursor: "pointer" }}
                className="position-absolute top-0 end-0 m-2 fs-5"
            >
                {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-secondary" />}
            </div>

            {/* Badge de descuento */}
            {product.discount > 0 && (
                <div className="position-absolute top-0 start-0 m-2">
                    <span
                        className={`badge ${
                            darkMode ? "bg-danger text-white" : "bg-warning text-dark"
                        } fs-6 fw-bold`}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        -{product.discount}%
                    </span>
                </div>
            )}

            {/* Imagen */}
            <div className="text-center mb-3" style={{ height: "180px", cursor: "pointer" }} onClick={handleNavigateToDetails}>
                <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    className="rounded-3"
                />
            </div>

            {/* Contenido con botón abajo */}
            <div className="d-flex flex-column justify-content-between flex-grow-1">
                <div className="text-center">
                    <h6 className="text-uppercase fw-light fs-6 text-truncate">{product.category}</h6>
                    <h5
                        className="fw-bold fs-6"
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "3rem",
                        }}
                    >
                        {product.name}
                    </h5>

                    {/* Precios */}
                    <div className="mb-3">
                        {product.discount > 0 ? (
                            <>
                                {/* Precio original tachado */}
                                <p
                                    className={`fs-6 fw-bold mb-1 ${
                                        darkMode ? "text-light" : "text-muted"
                                    }`}
                                    style={{ textDecoration: "line-through" }}
                                >
                                    {new Intl.NumberFormat(navigator.language, {
                                        style: "currency",
                                        currency: "CLP",
                                    }).format(product.price)}
                                </p>

                                {/* Precio con descuento */}
                                <p
                                    className={`fs-5 fw-bold ${
                                        darkMode ? "text-warning" : "text-danger"
                                    }`}
                                >
                                    {new Intl.NumberFormat(navigator.language, {
                                        style: "currency",
                                        currency: "CLP",
                                    }).format(calculateDiscountedPrice(product.price, product.discount))}
                                </p>
                            </>
                        ) : (
                            <p className="fs-5 fw-bold">
                                {new Intl.NumberFormat(navigator.language, {
                                    style: "currency",
                                    currency: "CLP",
                                }).format(product.price)}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => handleAddToCart(product)}
                    className="btn fw-bold w-100 btn-primary text-white"
                    style={{ height: "42px" }}
                >
                    Añadir al Carro
                </button>
            </div>
        </div>
    );
}