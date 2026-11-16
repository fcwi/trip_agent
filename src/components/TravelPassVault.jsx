import React, { useEffect, useRef, useState } from "react";
import { QrCode, Plus, Trash2, X, Maximize2 } from "lucide-react";
import {
  deleteTravelPass,
  listTravelPasses,
  readPassImageFile,
  saveTravelPass,
} from "../utils/travelPassDB.js";

const PRESET_LABELS = [
  "Visit Japan Web",
  "去程登機證",
  "回程登機證",
  "住宿憑證",
];

export default function TravelPassVault({ isDarkMode }) {
  const [passes, setPasses] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(PRESET_LABELS[0]);
  const [customLabel, setCustomLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewPass, setPreviewPass] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    let active = true;
    listTravelPasses()
      .then((items) => {
        if (active) setPasses(items);
      })
      .catch(() => {
        if (active) setPasses([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (previewPass) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [previewPass]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setErrorMsg("");
    try {
      const imageData = await readPassImageFile(file);
      const label =
        selectedLabel === "__custom__"
          ? customLabel.trim() || "旅遊憑證"
          : selectedLabel;
      const saved = await saveTravelPass({ label, imageData });
      setPasses((prev) => [saved, ...prev]);
      setShowAddForm(false);
      setCustomLabel("");
    } catch (error) {
      setErrorMsg(error?.message || "無法儲存圖片，請重試");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTravelPass(id);
      setPasses((prev) => prev.filter((item) => item.id !== id));
      if (previewPass?.id === id) setPreviewPass(null);
    } catch {
      setErrorMsg("刪除失敗，請稍後再試");
    }
  };

  return (
    <div className="journal-pass-vault">
      <div className="journal-pass-vault__header">
        <div className="journal-pass-vault__title">
          <QrCode aria-hidden="true" className="h-4 w-4" />
          <span>登機證・入境 QR Code</span>
          <small className="travel-muted">僅存於本機</small>
        </div>
        <button
          type="button"
          className="journal-view-toggle"
          aria-expanded={showAddForm}
          onClick={() => {
            setErrorMsg("");
            setShowAddForm((prev) => !prev);
          }}
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          {showAddForm ? "取消" : "新增"}
        </button>
      </div>

      {!passes.length && !showAddForm && (
        <p className="journal-pass-vault__hint">
          把 Visit Japan Web 入境／海關 QR Code 截圖或登機證存在這裡，過海關與登機時點開就能亮白高對比出示。
        </p>
      )}

      {showAddForm && (
        <div className="journal-pass-vault__form">
          <div className="journal-pass-vault__presets" role="group" aria-label="選擇憑證類型">
            {PRESET_LABELS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`journal-pass-chip ${selectedLabel === preset ? "is-active" : ""}`}
                onClick={() => setSelectedLabel(preset)}
              >
                {preset}
              </button>
            ))}
            <button
              type="button"
              className={`journal-pass-chip ${selectedLabel === "__custom__" ? "is-active" : ""}`}
              onClick={() => setSelectedLabel("__custom__")}
            >
              自訂名稱
            </button>
          </div>
          {selectedLabel === "__custom__" && (
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="例如：新幹線 QR Code"
              className={`journal-pass-vault__input ${
                isDarkMode ? "bg-neutral-900/60 text-neutral-100" : "bg-white text-stone-900"
              }`}
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="travel-primary-button"
            onClick={() => fileInputRef.current?.click()}
          >
            選擇截圖或拍照上傳
          </button>
        </div>
      )}

      {errorMsg && (
        <p role="alert" className="text-xs text-red-500 mt-1">
          {errorMsg}
        </p>
      )}

      {passes.length > 0 && (
        <ul className="journal-pass-vault__list">
          {passes.map((pass) => (
            <li key={pass.id} className="journal-pass-card">
              <button
                type="button"
                className="journal-pass-card__preview"
                onClick={() => setPreviewPass(pass)}
                aria-label={`放大出示 ${pass.label}`}
              >
                <img src={pass.imageData} alt={pass.label} />
                <span className="journal-pass-card__meta">
                  <strong>{pass.label}</strong>
                  <small>
                    <Maximize2 aria-hidden="true" className="h-3 w-3" />
                    點開掃碼
                  </small>
                </span>
              </button>
              <button
                type="button"
                className="journal-pass-card__delete"
                aria-label={`刪除 ${pass.label}`}
                onClick={() => handleDelete(pass.id)}
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className="journal-pass-lightbox"
        aria-labelledby="pass-lightbox-title"
        onCancel={(event) => {
          event.preventDefault();
          setPreviewPass(null);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) setPreviewPass(null);
        }}
      >
        {previewPass && (
          <div className="journal-pass-lightbox__sheet">
            <div className="journal-pass-lightbox__bar">
              <h3 id="pass-lightbox-title">{previewPass.label}</h3>
              <button
                type="button"
                className="travel-icon-button"
                aria-label="關閉掃碼預覽"
                onClick={() => setPreviewPass(null)}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="journal-pass-lightbox__image-wrap">
              <img src={previewPass.imageData} alt={previewPass.label} />
            </div>
            <p className="journal-pass-lightbox__tip">
              白底高對比顯示，方便機場與海關掃描條碼。
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
