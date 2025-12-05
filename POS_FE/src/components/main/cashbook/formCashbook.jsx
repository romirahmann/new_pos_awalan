/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../../../services/axios.service";
import { useAlert } from "../../../store/AlertContext";
import { useSelector } from "react-redux";

export function FormCashbook({ mode, initialData, onClose }) {
  const [formData, setFormData] = useState({
    recordDate: dayjs().format("YYYY-MM-DD"),
    total_in: 0,
    total_out: 0,
    notes: "",
  });
  const user = useSelector((state) => state.auth.user);
  const { showAlert } = useAlert();

  // Load data saat Edit
  useEffect(() => {
    if (mode === "Edit" && initialData) {
      setFormData({
        recordDate: initialData.recordDate
          ? dayjs(initialData.recordDate).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        total_in: initialData.total_in ?? 0,
        total_out: initialData.total_out ?? 0,
        notes: initialData.notes ?? "",
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "Add") {
        await api.post("/master/cashbook", {
          ...formData,
          createdBy: user.userId,
        });
      } else {
        await api.put(`/master/cashbook/${initialData.id}`, {
          ...formData,
          createdBy: user.userId,
        });
      }

      showAlert("success", `${mode} Cashbook Successfully!`);
      onClose();
    } catch (error) {
      console.log(error);
      showAlert("error", `${mode} Cashbook Failed!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-lg text-gray-200"
    >
      {/* DATE */}
      <div>
        <label className="block mb-1">Record Date</label>
        <input
          type="date"
          name="recordDate"
          value={formData.recordDate}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* TOTAL IN */}
      <div>
        <label className="block mb-1">Total Income</label>
        <input
          type="number"
          name="total_in"
          value={formData.total_in}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* TOTAL OUT */}
      <div>
        <label className="block mb-1">Total Expense</label>
        <input
          type="number"
          name="total_out"
          value={formData.total_out}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="block mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-24"
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-green-700 rounded hover:bg-green-600"
        >
          {mode === "Add" ? "Submit" : "Save"}
        </button>
      </div>
    </form>
  );
}
