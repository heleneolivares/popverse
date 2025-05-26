import React, { useState, useEffect, useContext } from "react";
import Order from "../components/Order"; // Import the Order component
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import SidebarAccount from "../components/SidebarAccount";
import { api } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = ({ darkMode })  => {
    const { token } = useContext(UserContext)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get("/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error obteniendo ordenes:", error);
                toast.error("Error obteniendo ordenes");
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4 d-flex">
            <SidebarAccount activePage="orderHistory" darkMode={darkMode} />
            <div className="col-md-9 p-3">
                <h1>Historial de compras</h1>
                {loading && (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                )}

                {!loading && error && <p className="text-danger">{error}</p>}

                {!loading && !error && orders.length > 0 && (
                    <div className="d-flex flex-column gap-3">
                        {orders.map((order) => (
                            <Order key={order.id} order={order} darkMode={darkMode} />
                        ))}
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <p>No hay compras realizadas.</p>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
