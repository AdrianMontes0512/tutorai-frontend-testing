
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [page, setPage] = useState("login");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    setIdToken(idToken);
    console.log("Google ID Token:", idToken);

    const res = await fetch("http://localhost:8080/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();
    console.log("Respuesta del backend:", data);
    localStorage.setItem("jwt", data.token);
    setJwt(data.token);
    setPage("dashboard");
  };

  const handleError = () => {
    console.log("Error en el login de Google");
  };

  const handleLogout = () => {
    setIdToken(null);
    setJwt(null);
    localStorage.removeItem("jwt");
    setPage("login");
  };

  if (page === "dashboard") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
        <h2>Dashboard</h2>
        <p><strong>Google idToken:</strong></p>
        <textarea value={idToken || ""} readOnly rows={3} style={{ width: "400px" }} />
        <p><strong>Backend JWT:</strong></p>
        <textarea value={jwt || ""} readOnly rows={3} style={{ width: "400px" }} />
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default App;
