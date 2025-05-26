import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { jwtDecode } from "jwt-decode";
import { api } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
    const { token } = useContext(UserContext)
    const { cart, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchUserId = async (token) => {
        try{
            const response = await api.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.id;
        }
        catch (error){
            console.error("Error al decodificar el token:", error);
            toast.error("Error al decodificar el token");
            return null;
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        return discount ? price - (price * discount / 100) : price;
    }
    const handleCheckout = async () => {
        try{
            const userId = await fetchUserId(token);
            if (!userId) {
                toast.error("Error al obtener el ID del usuario");
                return;
            }

            const orderItems = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: calculateDiscountedPrice(item.price, item.discount),
                discount: item.discount || 0,
            }));

            const totalAmount = cart.reduce(
                (acc, item) =>
                    acc +
                    calculateDiscountedPrice(item.price, item.discount) * item.quantity,
                0
            );

            const orderData = {
                user_id: userId,
                product_ids: orderItems,
                total_price: totalAmount,
                status: "pending",
            };
            
            const response = await api.post("/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Compra realizada con exito");
            clearCart();
            navigate("/orderHistory");
        }
        catch(error){
            console.error("Error al realizar la compra:", error);
            toast.error("Error al realizar la compra");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">Checkout</h2>

            {cart.length === 0 ? (
                <div className="alert alert-warning text-center">Carro vacio</div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Descuento</th>
                                    <th>Precio Final</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => {
                                    const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>
                                                {new Intl.NumberFormat(navigator.language, {
                                                    style: "currency",
                                                    currency: "CLP",
                                                }).format(item.price)}
                                            </td>
                                            <td>{item.discount ? `${item.discount}%` : "Sin descuento"}</td>
                                            <td>
                                                {new Intl.NumberFormat(navigator.language, {
                                                    style: "currency",
                                                    currency: "CLP",
                                                }).format(discountedPrice)}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {new Intl.NumberFormat(navigator.language, {
                                                    style: "currency",
                                                    currency: "CLP",
                                                }).format(discountedPrice * item.quantity)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <h4>
                            Total:
                            <span className="fw-bold">
                                {new Intl.NumberFormat(navigator.language, {
                                    style: "currency",
                                    currency: "CLP",
                                }).format(
                                    cart.reduce(
                                        (acc, item) =>
                                            acc +
                                            calculateDiscountedPrice(item.price, item.discount) *
                                                item.quantity,
                                        0
                                    )
                                )}
                            </span>
                        </h4>
                        <button className="btn btn-success btn-lg" onClick={() => handleCheckout()}>Pagar ahora</button>
                    </div>
                </>
            )}
        </div>
    );
}