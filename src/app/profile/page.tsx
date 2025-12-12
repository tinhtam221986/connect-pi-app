"use client";
import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/PiSDKProvider";

export default function ProfilePage() {
  const { user: piUser } = usePi() || {}; 
  const [dbUser, setDbUser] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState("video"); 

  useEffect(() => {
    if (piUser) {
      fetch("/api/user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: piUser.username, user_uid: piUser.uid }) })
      .then(res => res.json()).then(data => { if (data.user) setDbUser(data.user); });
    }
  }, [piUser]);

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      <div style={{ height: "150px", background: "linear-gradient(45deg, #FF0099, #493240)" }}></div>
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", background: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{fontSize: "40px"}}>👤</span></div>
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0 }}>@{dbUser?.username || piUser?.username || "Khách"} <span style={{fontSize:'12px', background:'gold', color:'black'}}>LV.{dbUser?.level || 1}</span></h1>
          <div style={{ marginTop: "5px", fontSize: "16px", fontWeight: "bold", color: "#00f2ea" }}>Ví Connect: {dbUser?.balance || 0} π</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
