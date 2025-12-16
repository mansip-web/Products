import React, { useState, useEffect } from "react";
import "./Settings.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    siteTitle: "ShopHub",
    supportEmail: "support@shophub.com",
    darkMode: false,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-section settings-container">
      <h2>Advanced Settings</h2>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-group">
          <h3>General Settings</h3>
          <div className="form-group">
            <label>Site Title</label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-group">
          <h3>Preferences</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <span>Dark Mode (Mock)</span>
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              <span className="toggle-switch"></span>
            </label>
          </div>

          <div className="toggle-group">
            <label className="toggle-label">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              <span className="toggle-switch"></span>
            </label>
          </div>
        </div>

        <div className="settings-group danger-zone">
          <h3>Danger Zone</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
              <span className="toggle-switch"></span>
            </label>
            <p className="help-text">
              Prevent users from accessing the store while you make changes.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            Save Changes
          </button>
          {saved && <span className="save-success">Settings Saved! ✅</span>}
        </div>
      </form>
    </div>
  );
}
