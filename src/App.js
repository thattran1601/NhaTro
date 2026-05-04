import React, { useState } from "react";

function App() {
  // state (biến trạng thái)
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1>Xin chào React 👋</h1>

      <p>Bạn đã click: {count} lần</p>

      <button onClick={() => setCount(count + 1)} style={styles.button}>
        Click tôi
      </button>

      <button onClick={() => setCount(0)} style={styles.reset}>
        Reset
      </button>
    </div>
  );
}

// CSS viết trong JS
const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial"
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  reset: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default App;