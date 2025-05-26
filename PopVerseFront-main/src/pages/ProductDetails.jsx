import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { api } from "../services/api";

export const ProductDetails = ({ darkMode }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [extraImage, setExtraImage] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductAndImages = async () => {
            try {
                // Fetch del producto
                const productResponse = await api.get(`/products/${id}`);
                const productData = productResponse.data;
                setProduct(productData);
                setSelectedImage(productData.image_url); // Imagen principal por defecto

                // Fetch de imágenes adicionales
                const extraResponse = await api.get(`/products/extra/${id}`);
                const extraImages = Array.isArray(extraResponse.data.image_url)
                    ? extraResponse.data.image_url
                    : [extraResponse.data.image_url];

                // Combina la imagen principal con las imágenes adicionales
                const allImages = [productData.image_url, ...extraImages];
                setExtraImage([...new Set(allImages)]); // Elimina duplicados
            } catch (error) {
                console.error("Error al cargar los detalles del producto o las imágenes:", error);
            }
        };

        fetchProductAndImages();
    }, [id]);

    if (!product) {
        return <p>Cargando detalles del producto...</p>;
    }

    const calculateDiscountedPrice = (price, discount) => {
        return price * (1 - discount / 100);
    };

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
            className={`d-flex min-vh-100 ${
                darkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}
        >
            <div className="container">
                <Title text={product.name} size="lg" align="center" darkMode={darkMode} />
                <div className="row mt-5">
                    {/* Imagen principal */}
                    <div className="col-md-6 d-flex flex-column align-items-center">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            style={{ maxWidth: "80%", height: "80%" }}
                            className="mb-4"
                        />

                        {/* Miniaturas */}
                        <div className="d-flex justify-content-center gap-2">
                            {extraImage.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Extra ${index + 1}`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        border: selectedImage === image ? "2px solid #007bff" : "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                    onMouseEnter={() => setSelectedImage(image)} // Cambia la imagen principal al pasar el mouse
                                />
                            ))}
                        </div>
                    </div>
                    {/* Descripción y precio */}
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <p className="mt-3">{product.description}</p>
                        {product.discount > 0 ? (
                            <>
                                {/* Precio original tachado */}
                                <p
                                    className={`fs-5 fw-bold ${
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
                                    className={`fs-4 fw-bold ${
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
                            <p className="fs-4 fw-bold">
                                {new Intl.NumberFormat(navigator.language, {
                                    style: "currency",
                                    currency: "CLP",
                                }).format(product.price)}
                            </p>
                        )}
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="btn fw-bold w-100 btn-primary text-white"
                            style={{ height: "42px" }}
                        >
                            Añadir al Carro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};