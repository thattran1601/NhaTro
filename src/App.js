import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Đang kết nối...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("https://nhatro-backend-ka3b.onrender.com/api/message")
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setStatus("success");
      })
      .catch(err => {
        console.error(err);
        setMessage("❌ Không kết nối được backend");
        setStatus("error");
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1>Test kết nối Backend</h1>

      <p>
        Trạng thái:{" "}
        {status === "loading" && "⏳ Đang tải..."}
        {status === "success" && "✅ Kết nối thành công"}
        {status === "error" && "❌ Lỗi"}
      </p>

      <h2>{message}</h2>
    </div>
  );
}

export default App;

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial"
  }
};