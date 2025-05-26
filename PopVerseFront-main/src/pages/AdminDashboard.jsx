import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsResponse, usersResponse] = await Promise.all([
                    api.get("/products"), // Endpoint para obtener productos
                    api.get("/users"), // Endpoint para obtener usuarios
                ]);
                setProducts(productsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((product) => product.id !== id));
            alert("Producto eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            alert("Usuario eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="container mt-4">
            <h1>Panel de Administración</h1>

            <section className="mt-5">
                <h2>Gestión de Productos</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-5">
                <h2>Gestión de Usuarios</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;