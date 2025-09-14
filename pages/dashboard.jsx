import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import SalesTable from "../components/SalesTable";
import RevenueBarChart from "../components/RevenueBarChart";
import RevenuePieChart from "../components/RevenuePieChart";
import RevenueLineChart from "../components/RevenueLineChart";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [msalInstance, setMsalInstance] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const msal = await import("@azure/msal-browser");
      const { msalConfig } = await import("../src/msalconfig");
      const instance = new msal.PublicClientApplication(msalConfig);
      await instance.initialize();
      setMsalInstance(instance);

      try {
        const response = await instance.handleRedirectPromise();
        if (response) setUser(response.account);
        else {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) setUser(accounts[0]);
        }
      } catch (err) {
        console.error("MSAL redirect error:", err);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    if (!msalInstance) return;
    await msalInstance.logoutRedirect();
    setUser(null);
  };

  const [data, setData] = useState([]);
  const [form, setForm] = useState({ salesperson: "", product: "", quantity: "", revenue: "", region: "", date: "" });
  const [editingId, setEditingId] = useState(null);
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a78bfa", "#f97316"];

  useEffect(() => { const saved = localStorage.getItem("salesData");
   if (saved) setData(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("salesData", JSON.stringify(data)); }, [data]);

  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
  const resetForm = () => setForm({ salesperson: "", product: "", quantity: "", revenue: "", region: "", date: "" });
  const parseNumber = (v) => { const n = Number(String(v).replace(/,/g, ""));
   return Number.isFinite(n)?n:0; };

  const handleFormChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleAddEntry = () => {
    if (!form.salesperson || !form.product || !form.quantity || !form.revenue || !form.region || !form.date) {
      alert("Please fill all fields."); return;
    }
    const newRow = { id: uid(), salesperson: form.salesperson, product: form.product, quantity: Number(form.quantity), revenue: parseNumber(form.revenue), region: form.region, date: form.date };
    setData((d) => [...d, newRow]); resetForm();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const cleaned = json.map((row) => {
        const out = { id: uid(), salesperson: "", product: "", quantity: 0, revenue: 0, region: "", date: "" };
        Object.keys(row).forEach((col) => {
          const lower = String(col).toLowerCase();
          if (lower.includes("sales")) out.salesperson = String(row[col]);
          else if (lower.includes("product")) out.product = String(row[col]);
          else if (lower.includes("qty") || lower.includes("quantity")) out.quantity = Number(row[col] || 0);
          else if (lower.includes("revenue") || lower.includes("amount")) out.revenue = parseNumber(row[col]);
          else if (lower.includes("region")) out.region = String(row[col]);
          else if (lower.includes("date")) { const d=new Date(row[col]); out.date=!isNaN(d)?d.toISOString().slice(0,10):String(row[col]); }
        }); return out;
      });
      setData((prev) => [...prev, ...cleaned]);
      e.target.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const handleDelete = (id) => { if (!confirm("Delete this row?")) return; setData((d)=>d.filter(r=>r.id!==id)); };
  const startEdit = (id) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const handleSaveEdit = (id, updatedFields) => { setData((d)=>d.map(r=>r.id===id?{...r,...updatedFields,revenue:parseNumber(updatedFields.revenue),quantity:Number(updatedFields.quantity)}:r)); setEditingId(null); };

  const handleDownloadExcel = () => {
    if (data.length===0){alert("No data to export!");return;}
    const worksheet = XLSX.utils.json_to_sheet(data.map(({id,...rest})=>rest));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesData");
    XLSX.writeFile(workbook, "SalesData.xlsx");
  };

  const revenueByProduct = useMemo(() => { const map={}; data.forEach(r=>{map[r.product]=(map[r.product]||0)+Number(r.revenue||0)}); return Object.entries(map).map(([product,revenue])=>({product,revenue})); }, [data]);
  const revenueByRegion = useMemo(() => { const map={}; data.forEach(r=>{map[r.region]=(map[r.region]||0)+Number(r.revenue||0)}); return Object.entries(map).map(([region,revenue])=>({region,revenue})); }, [data]);
  const revenueTrend = useMemo(() => { const map={}; data.forEach(r=>{map[r.date]=(map[r.date]||0)+Number(r.revenue||0)}); return Object.entries(map).sort((a,b)=>new Date(a[0])-new Date(b[0])).map(([date,revenue])=>({date,revenue})); }, [data]);

  if (!user) return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Loading user...</div>;

  return (
    <div className="min-h-screen bg-indigo-200 flex flex-col">
  <Navbar user={user} handleLogout={handleLogout} handleDownloadExcel={handleDownloadExcel} />

  <div className="flex-1 p-6 space-y-6">

    {/* Manual Entry + Upload */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-indigo-100 bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-2xl transition duration-300">
        <h3 className="font-bold text-lg text-indigo-700 mb-4">➕ Manual Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["salesperson","product","quantity","revenue","region","date"].map((field)=>(
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleFormChange}
              type={field==="date"?"date":(field==="quantity"||field==="revenue"?"number":"text")}
              placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
            />
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddEntry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >Add Entry</button>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-200 transition"
          >Reset</button>
        </div>
      </div>

 <div className="bg-indigo-100 bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-2xl transition duration-300 flex flex-col items-center justify-center">
  <h3 className="font-bold text-lg text-indigo-700 mb-4">📂 Upload Excel</h3>

  {/* Custom Upload Area */}
  <label
    htmlFor="file-upload"
    className="w-full cursor-pointer border-2 border-dashed border-indigo-400 rounded-xl p-8 text-center hover:border-indigo-600 transition flex flex-col items-center justify-center"
  >
    <svg
      className="mx-auto h-10 w-10 text-indigo-500 mb-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4M4 8l8-8 8 8"
      />
    </svg>
    <p className="text-indigo-700 font-medium">Drag & drop your file here</p>
    <p className="text-sm text-indigo-600 mt-1">or click to browse</p>
  </label>

  {/* Hidden Input */}
  <input
    id="file-upload"
    type="file"
    accept=".xlsx,.xls,.csv"
    onChange={handleFileUpload}
    className="hidden"
  />

  <p className="text-sm text-gray-600 mt-4 text-center">
    Columns: salesperson, product, quantity, revenue, region, date
  </p>
</div>
</div>

    {/* Sales Table */}
    <SalesTable data={data} setData={setData} />

    {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-2xl transition duration-300">
        <h4 className="font-semibold text-indigo-700 mb-2">Revenue by Product</h4>
        <RevenueBarChart data={revenueByProduct} colors={COLORS} />
      </div>
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-2xl transition duration-300">
        <h4 className="font-semibold text-indigo-700 mb-2">Revenue by Region</h4>
        <RevenuePieChart data={revenueByRegion} colors={COLORS} />
      </div>
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-2xl transition duration-300">
        <h4 className="font-semibold text-indigo-700 mb-2">Revenue Trend</h4>
        <RevenueLineChart data={revenueTrend} />
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
}
