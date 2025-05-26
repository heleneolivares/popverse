import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function CardProductCart({ item, darkMode }) {
    const { addToCart, removeFromCart, removeOneFromCart } = useCart();
    const discountedPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
    const subtotal = discountedPrice * item.quantity;

    return (
        <div
            className={`d-flex gap-3 align-items-start rounded-3 p-2 mb-3 ${
                darkMode ? "bg-secondary text-white" : "bg-light text-dark"
            }`}
        >
            <img
                src={item.image_url}
                alt={item.name}
                style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                borderRadius: "8px",
                }}
            />

            <div className="flex-grow-1">
                <p className="mb-1 fw-semibold small"
                    style={{
                        display: "-webkit-box",
                        WebKitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: "0",
                    }}
                >
                    {item.name}
                </p>

                <p className="mb-1 small">
                    {item.quantity} x{" "}
                    {item.discount > 0 ? (
                        <>
                            <span
                                className={`text-muted ${
                                    darkMode ? "text-light" : "text-muted"
                                }`}
                                style={{ textDecoration: "line-through" }}
                            >
                                {new Intl.NumberFormat("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                }).format(item.price)}
                            </span>{" "}
                            <span
                                className={`fw-bold ${
                                    darkMode ? "text-warning" : "text-danger"
                                }`}
                            >
                                {new Intl.NumberFormat("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                }).format(discountedPrice)}
                            </span>
                        </>
                    ) : (
                        <span className="fw-bold">
                            {new Intl.NumberFormat("es-CL", {
                                style: "currency",
                                currency: "CLP",
                            }).format(item.price)}
                        </span>
                    )}
                </p>

                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => removeOneFromCart(item.id)}
                    >
                        <FaMinus className={darkMode ? "text-white" : "text-dark"} />

                    </button>
                    <span className="fw-bold">{item.quantity}</span>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => addToCart(item)}
                    >
                        <FaPlus className={darkMode ? "text-white" : "text-dark"}/>
                    </button>
                </div>
            </div>

            {/* Subtotal y eliminar */}
            <div className="text-end">
                <p className="mb-2 fw-semibold small">
                {new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                }).format(subtotal)}
                </p>
                <button
                className="btn btn-sm btn-danger"
                onClick={() => removeFromCart(item.id)}
                >
                <FaTrash className="text-white" />
                </button>
            </div>
        </div>
    );
}