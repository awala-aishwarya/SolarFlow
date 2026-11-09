
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, UserPlus, Upload, FileText } from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function NewLead() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    ownership: "Owner",
    roof_type: "Concrete",
    roof_area: "",
    monthly_bill: "",
    pincode: "",
    avg_units: "",
  });

  const [billFile, setBillFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Create the lead
      const response = await fetch(`${API_URL}/leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  ...form,
  phone: form.phone.replace(/\D/g, ""),
  roof_area: Number(form.roof_area),
  monthly_bill: Number(form.monthly_bill),
  avg_units: form.avg_units ? Number(form.avg_units) : null,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ? JSON.stringify(data.detail) : "Unable to create lead."
        );
      }

      // 2. Upload electricity bill if provided
      if (billFile) {
        const uploadData = new FormData();
        uploadData.append("file", billFile);

        const uploadResponse = await fetch(
          `${API_URL}/leads/${data.lead_id}/bill`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            `Lead ${data.lead_id} was created, but bill upload failed: ${
              uploadResult.detail || "Unknown upload error"
            }`
          );
        }
      }

      // 3. Run deterministic lead scoring
      const scoreResponse = await fetch(
        `${API_URL}/leads/${data.lead_id}/score`,
        { method: "POST" }
      );

      if (!scoreResponse.ok) {
        throw new Error(
          `Lead ${data.lead_id} was created, but scoring failed.`
        );
      }

      setMessage(
        `Lead created successfully! Lead ID: ${data.lead_id}`
      );

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-green-600";

  return (
    <div className="min-h-screen bg-[#f7f9f7] p-5 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-600 mb-7"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="bg-green-100 text-green-700 p-3 rounded-xl">
              <Sun size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Lead</h1>
              <p className="text-sm text-slate-500">
                Register a rooftop solar customer enquiry
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="font-semibold text-lg mb-4">
                Customer Information
              </h2>

              <label className="text-sm font-medium">
                Customer Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter customer name"
                  required
                />
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">
                Phone Number *
                <input
  type="tel"
  name="phone"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
    })
  }
  className={inputClass}
  placeholder="Enter 10-digit phone number"
  maxLength={10}
  inputMode="numeric"
  pattern="[0-9]{10}"
  required
/>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <label className="text-sm font-medium">
                Property Ownership *
                <select
                  name="ownership"
                  value={form.ownership}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Owner</option>
                  <option>Tenant</option>
                </select>
              </label>

              <label className="text-sm font-medium">
                Roof Type *
                <select
                  name="roof_type"
                  value={form.roof_type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Concrete</option>
                  <option>Metal</option>
                  <option>Tile</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-4">
                Electricity and Roof Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <label className="text-sm font-medium">
                  Roof Area (sq. ft.) *
                  <input
                    type="number"
                    name="roof_area"
                    value={form.roof_area}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 300"
                    min="1"
                    required
                  />
                </label>

                <label className="text-sm font-medium">
                  Monthly Electricity Bill (₹) *
                  <input
                    type="number"
                    name="monthly_bill"
                    value={form.monthly_bill}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 3200"
                    min="1"
                    required
                  />
                </label>

                <label className="text-sm font-medium">
                  Average Monthly Units (optional)
                  <input
                    type="number"
                    name="avg_units"
                    value={form.avg_units}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 340"
                    min="1"
                  />
                </label>

                <label className="text-sm font-medium">
                  Pincode *
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 440001"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </label>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">
                Electricity Bill Upload
              </h2>

              <p className="text-sm text-slate-500 mb-3">
                Upload a clear electricity bill for further review.
                Accepted formats: PDF, JPG, JPEG and PNG. Maximum 5 MB.
              </p>

              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 hover:border-green-500">
                {billFile ? (
                  <>
                    <FileText size={30} className="text-green-700 mb-2" />
                    <span className="text-sm font-semibold text-green-800">
                      {billFile.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {(billFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={30} className="text-green-700 mb-2" />
                    <span className="text-sm font-semibold">
                      Click to upload electricity bill
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PDF, JPG or PNG
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;

                    if (
                      file &&
                      !["application/pdf", "image/jpeg", "image/png"].includes(
                        file.type
                      )
                    ) {
                      setMessage("Please select a PDF, JPG or PNG file.");
                      e.target.value = "";
                      return;
                    }

                    if (file && file.size > 5 * 1024 * 1024) {
                      setMessage("File size must be 5 MB or less.");
                      e.target.value = "";
                      return;
                    }

                    setMessage("");
                    setBillFile(file);
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => setBillFile(null)}
                className="text-xs text-red-600 mt-2"
              >
                Remove selected file
              </button>
            </div>

            {message && (
              <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-3 text-sm break-words">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2"
            >
              <UserPlus size={18} />
              {loading ? "Saving Lead..." : "Save Lead and Score"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewLead;
