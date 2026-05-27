"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLoginGate() {
  const router = useRouter();
  
  const [email, setEmail] = useState("admin@gaarlandz.com");
  const [password, setPassword] = useState("gaarlandz2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  // Floating particles seeding
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);
  
  useEffect(() => {
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 2 + Math.random() * 4
    }));
    setParticles(list);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setAuthenticating(true);

    // Dynamic timeout for real-time validation vibe
    setTimeout(() => {
      if (email === "admin@gaarlandz.com" && password === "gaarlandz2026") {
        setAuthenticating(false);
        // Save session state to let admin panel know we are logged in
        localStorage.setItem("gaarlandz_session_active", "true");
        router.push("/admin");
      } else {
        setAuthenticating(false);
        setErrorMsg("Invalid administrative credentials. Use demo credentials loaded below.");
      }
    }, 1200);
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "95vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      backgroundImage: "linear-gradient(rgba(30, 63, 46, 0.4), rgba(30, 63, 46, 0.7)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden"
    }}>
      
      {/* Drift Gold Leaf Particles */}
      <div className="gold-particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="gold-particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`
            }}
          />
        ))}
      </div>

      <div className="glass-panel fade-in-reveal" style={{
        maxWidth: "460px",
        width: "100%",
        borderRadius: "32px",
        padding: "40px",
        border: "2px solid var(--accent-gold-metallic)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
        zIndex: 10,
        position: "relative"
      }}>
        
        {/* Core Branding */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-green-dark)",
            border: "1px solid var(--accent-gold-bright)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "var(--shadow-gold)"
          }}>
            <ShieldCheck size={28} color="var(--accent-gold-bright)" />
          </div>
          <span className="floral-badge" style={{ marginBottom: "8px" }}>
            <Sparkles size={12} color="var(--accent-gold-metallic)" /> Administrative Gateway
          </span>
          <h3 style={{ fontSize: "1.8rem", color: "var(--primary-green-dark)", marginTop: "8px" }}>Venue Operating System</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
            Authenticating secured operations & client schedules.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Email */}
          <div>
            <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "var(--primary-green-dark)", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>OPERATOR EMAIL</label>
            <div style={{ position: "relative" }}>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: "14px",
                  border: "1px solid rgba(197, 160, 89, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-dark)",
                  outline: "none"
                }}
              />
              <Mail size={16} color="var(--accent-gold-metallic)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "var(--primary-green-dark)", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>CONSOLE PASSPHRASE</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 42px 12px 42px",
                  borderRadius: "14px",
                  border: "1px solid rgba(197, 160, 89, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-dark)",
                  outline: "none"
                }}
              />
              <Lock size={16} color="var(--accent-gold-metallic)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Extra Options */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-dark)" }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--primary-green-dark)" }}
              />
              Remember me
            </label>
            <span 
              onClick={() => alert("Administrative unlock is set to passcode: gaarlandz2026")}
              style={{ color: "var(--accent-gold-metallic)", fontWeight: "600", cursor: "pointer" }}
            >
              Forgot password?
            </span>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: "rgba(181, 84, 71, 0.1)",
              border: "1px solid var(--status-blocked)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "0.75rem",
              color: "var(--status-blocked)",
              fontWeight: "600"
            }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="luxury-btn" 
            style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", textTransform: "uppercase" }}
            disabled={authenticating}
          >
            {authenticating ? "Validating Session Keys..." : "Access Venue Console"}
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(197, 160, 89, 0.2)",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          textAlign: "center"
        }}>
          <strong>Demo Account:</strong> admin@gaarlandz.com | <strong>Passcode:</strong> gaarlandz2026
        </div>
      </div>
    </div>
  );
}
