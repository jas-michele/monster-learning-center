import { useState } from "react";
import { loginUser, registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import "./Register.css";

type AuthMode = "register" | "login";

const Register = () => {
    const [authMode, setAuthMode] = useState<AuthMode>("register");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isLogin = authMode === "login";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = isLogin
                ? await loginUser({
                    email: formData.email,
                    password: formData.password,
                })
                : await registerUser(formData);

            console.log("API Response:", data);

            localStorage.setItem("token", data.token);

            console.log("Stored token:", localStorage.getItem("token"));

            navigate("/home");

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || `${isLogin ? "Login" : "Registration"} failed.`);
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setAuthMode(isLogin ? "register" : "login");
        setError("");
    };


    return (
        <div className="register-page">
            <div className="register-scene-frame">
                <div className="register-scene" />

                <main className={`register-card ${isLogin ? "login-card" : ""}`} aria-label={isLogin ? "Login" : "Create an account"}>
                    <form onSubmit={handleSubmit} className="register-form">
                        {!isLogin && (
                            <>
                                <label className="register-field">
                                    <FaUser aria-hidden="true" />
                                    <input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="register-field">
                                    <FaUser aria-hidden="true" />
                                    <input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </label>
                            </>
                        )}

                        <label className="register-field">
                            <FaEnvelope aria-hidden="true" />
                            <input
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="register-field">
                            <FaLock aria-hidden="true" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </label>

                        <button type="submit" className="register-submit" disabled={loading}>
                            {loading ? (isLogin ? "Logging In..." : "Creating Account...") : (isLogin ? "Login" : "Register")}
                        </button>

                        <p className="auth-mode-prompt">
                            {isLogin ? "Need an account?" : "Already have an account?"}
                            <button type="button" onClick={toggleAuthMode}>
                                {isLogin ? "Create account" : "Login"}
                            </button>
                        </p>
                    </form>

                    {error && <p className="register-error">{error}</p>}
                </main>
            </div>
        </div>
    );
};

export default Register;
