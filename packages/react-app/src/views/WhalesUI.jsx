import React, { useState, useMemo } from "react";

import { Input } from "antd";

const WhalesUI = ({ writeContracts }) => {
  const [q, setQ] = useState(null);
  const [f, setF] = useState(null);

  const mul = useMemo(() => {
    if (!q || !f) return 0;
    return (q * f).toFixed(2);
  }, [q, f]);

  return (
    <div style={{ maxWidth: 300, margin: "20px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Increasing floor</h2>
      <div style={{ display: "flex", alignItems: "center", maxWidth: 300, margin: "0 auto", marginBottom: "10px" }}>
        <label for="quantity" style={{ marginRight: 20, flexGrow: 1, flex: 1, textAlign: "left" }}>
          Quantity:
        </label>
        <Input
          type="number"
          placeholder="7"
          id="quantity"
          style={{ flex: 2 }}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", maxWidth: 300, margin: "0 auto" }}>
        <label for="price" style={{ marginRight: 20, whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
          Floor price:
        </label>
        <Input
          type="number"
          placeholder="1 WETH"
          id="price"
          style={{ flex: 2 }}
          value={f}
          onChange={e => setF(e.target.value)}
        />
      </div>
      {mul == 0 && <p style={{ textAlign: "left", marginTop: 15 }}>Price * Quantity = {mul} WETH</p>}
    </div>
  );
};

export default WhalesUI;
