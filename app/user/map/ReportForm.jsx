"use client";

import { useEffect, useState } from "react";

const severities = ["low", "medium", "high"];

export default function ReportForm({ position, onClose }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(severities[1]);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

  useEffect(() => {
    let active = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/user/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (!active) return;
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      } catch (err) {
        if (active) {
          setStatus({ type: "error", message: "Could not load categories." });
        }
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const payload = {
      categoryId: Number(categoryId),
      title,
      description,
      severity,
      lat: position.lat,
      lng: position.lng,
    };

    try {
      const res = await fetch("/api/user/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit");
      }
      setStatus({ type: "success", message: "Report submitted successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Submission failed." });
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#E5D0AC] bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#6D2323]">Location</p>
          <p className="text-sm text-[#880D1E]">
            lat {position.lat.toFixed(5)}, lng {position.lng.toFixed(5)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-sm text-[#A31D1D] hover:bg-[#CBEEF3]"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-1 flex-col gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="font-medium text-[#6D2323]">Category</span>
          <select
            className="rounded border border-[#E5D0AC] px-2 py-1 focus:border-[#A31D1D] focus:outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ""}{cat.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-[#6D2323]">Title</span>
          <input
            className="rounded border border-[#E5D0AC] px-2 py-1 focus:border-[#A31D1D] focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short headline"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-[#6D2323]">Description</span>
          <textarea
            className="min-h-[120px] rounded border border-[#E5D0AC] px-2 py-1 focus:border-[#A31D1D] focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-[#6D2323]">Severity</span>
          <select
            className="rounded border border-[#E5D0AC] px-2 py-1 focus:border-[#A31D1D] focus:outline-none"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            {severities.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-auto flex gap-2">
          <button
            type="submit"
            className="rounded bg-[#A31D1D] px-4 py-2 text-white shadow hover:bg-[#880D1E]"
          >
            Submit report
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#E5D0AC] px-4 py-2 text-[#A31D1D] hover:bg-[#CBEEF3]"
          >
            Cancel
          </button>
        </div>

        {status ? (
          <div
            className={`rounded px-3 py-2 text-sm ${
              status.type === "success"
                ? "bg-[#CBEEF3] text-[#0f5132]"
                : "bg-[#F26A8D]/20 text-[#A31D1D]"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
