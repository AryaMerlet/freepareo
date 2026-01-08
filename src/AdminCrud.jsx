// src/AdminCrud.jsx
import { useState } from "react";
import { LayoutDashboard, Users, ShoppingCart, Settings } from "lucide-react";

export default function AdminCrud({ crudComponent }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Utilisateurs", icon: <Users size={18} /> },
    { name: "Paramètres", icon: <Settings size={18} /> },
  ];

  const renderContent = () => {
    if (activeMenu === "Utilisateurs") {
      return crudComponent; 
    }
    return (
      <div
        style={{
          padding: 20,
          background: "white",
          borderRadius: 8,
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ margin: 0 }}>{activeMenu}</h3>
        <p style={{ marginTop: 10 }}>Page vide pour {activeMenu}</p>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "white",
          borderRight: "1px solid #e0e0e0",
          padding: 20,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 30 }}>
          Admin
        </h2>
        {menus.map((menu) => (
          <button
            key={menu.name}
            onClick={() => setActiveMenu(menu.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: 12,
              marginBottom: 5,
              border: "none",
              background: activeMenu === menu.name ? "#e5edff" : "none",
              color: activeMenu === menu.name ? "#2563eb" : "#000",
              fontWeight: activeMenu === menu.name ? 600 : 400,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {menu.icon} {menu.name}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24 }}>
        <header
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24,
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: 10,
          }}
        >
          {activeMenu}
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
