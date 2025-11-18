import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      // CREATE USER IN FIREBASE AUTH
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // CREATE USER PROFILE IN FIRESTORE
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        businessType,
        plan: "trial",
        subscribed: false,
        trialStart: Date.now(),
        trialEnd: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
      });

      // REDIRECT TO LOGIN PAGE
      navigate("/login");

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Business Type (e.g., Restaurant, Boutique, POS)"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Register
        </button>
      </form>

      <p className="link" onClick={() => navigate("/login")}>
        Back to Login
      </p>
    </div>
  );
}
