import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { api } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = ({ order, darkMode }) => {
    const [items, setItems] = useState([]);
    const token = useContext(UserContext);

    useEffect(() => {
        const fetchOrderItems = async () => {
            try{
                const response = await api.get(`/orders/${order.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.token}`,
                        },
                    }
                );
                setItems(response.data);
            }
            catch (error) {
                console.error("Error al obtener los detalles de la orden:", error);
                toast.error("Error al obtener los detalles de la orden");
            }
        };
        fetchOrderItems();
    }, [order.id, token]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Intl.DateTimeFormat("es-ES", options).format(new Date(dateString));
    };

    return (
        <div className={`card mb-3 ${darkMode ? "bg-dark text-white border-light" : ""}`}>
            <div className="card-body">
                <h5 className="card-title">Orden #{order.id}</h5>
                <p><strong>Fecha de compra:</strong> {formatDate(order.created_at)}</p>
                <p>
                    <strong>Total:</strong>
                    {new Intl.NumberFormat(navigator.language, {
                            style: "currency",
                            currency: "CLP",
                    }).format(order.total)}
                </p>

                <h6>Items:</h6>
                {items.length > 0 ? (
                    <ul className={`list-group ${darkMode ? "bg-dark" : ""}`}>
                        {items.map((item) => {
                            const discountedPrice = item.discount
                                ? item.price * (1 - item.discount / 100)
                                : item.price;

                            return (
                                <li
                                    key={item.product_id}
                                    className={`list-group-item d-flex justify-content-between ${darkMode ? "bg-dark text-white border-light" : ""}`}
                                >
                                    <span>{item.name}</span>
                                    <span>
                                        {new Intl.NumberFormat(navigator.language, {
                                            style: "currency",
                                            currency: "CLP",
                                        }).format(discountedPrice)}
                                        x {item.quantity}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ): (
                    <p className="text-muted">Esta orden no tiene productos.</p>
                )}
            </div>
        </div>
    );
};

export default Order;
