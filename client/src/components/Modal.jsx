import React from "react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <section className="w-full max-w-xl rounded-lg bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        {children}
      </section>
    </div>
  );
}

