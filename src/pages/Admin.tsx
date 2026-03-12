import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getAdminConfigs, deleteAdminConfig, type AdminYearConfig } from "@/config/admin";
import { CONFIG_BY_YEAR } from "@/config/index";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";
import YearConfigForm from "@/components/admin/YearConfigForm";
import { hardcodedConfigToAdmin } from "@/config/config-converter";

type ViewMode = "list" | "edit" | "create";

const Admin = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("list");
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editingConfig, setEditingConfig] = useState<AdminYearConfig | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Merge hardcoded + localStorage configs
  const adminConfigs = getAdminConfigs();
  const hardcodedYears = Object.keys(CONFIG_BY_YEAR).map(Number);
  const adminYears = Object.keys(adminConfigs).map(Number);
  const allYears = [...new Set([...hardcodedYears, ...adminYears])].sort((a, b) => b - a);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = (year: number) => {
    // If admin config exists, use it; otherwise convert hardcoded
    const adminConfig = adminConfigs[String(year)];
    if (adminConfig) {
      setEditingConfig(adminConfig);
    } else if (CONFIG_BY_YEAR[year as keyof typeof CONFIG_BY_YEAR]) {
      setEditingConfig(hardcodedConfigToAdmin(CONFIG_BY_YEAR[year as keyof typeof CONFIG_BY_YEAR]));
    }
    setEditingYear(year);
    setView("edit");
  };

  const handleCreate = () => {
    const nextYear = allYears.length > 0 ? allYears[0] + 1 : new Date().getFullYear();
    setEditingYear(nextYear);
    setEditingConfig(getDefaultAdminConfig(nextYear));
    setView("create");
  };

  const handleDelete = (year: number) => {
    if (confirm(`Hapus konfigurasi tahun ${year}? Ini hanya menghapus perubahan admin, konfigurasi hardcoded tetap ada.`)) {
      deleteAdminConfig(year);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleSaved = () => {
    setView("list");
    setEditingYear(null);
    setEditingConfig(null);
    setRefreshKey((k) => k + 1);
  };

  if (view === "edit" || view === "create") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => setView("list")} className="mb-4 text-slate-600">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <YearConfigForm
            year={editingYear!}
            config={editingConfig!}
            isNew={view === "create"}
            onSaved={handleSaved}
            onCancel={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Kelola konfigurasi tahunan</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")} className="text-slate-600 border-slate-300">
              Lihat Situs
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        {/* Add Year */}
        <Button onClick={handleCreate} className="mb-6 bg-slate-900 hover:bg-slate-800 text-white">
          <Plus className="w-4 h-4 mr-1" /> Tambah Tahun Baru
        </Button>

        {/* Year List */}
        <div className="space-y-3">
          {allYears.map((year) => {
            const isHardcoded = hardcodedYears.includes(year);
            const hasAdminOverride = adminYears.includes(year);
            const isAdminOnly = !isHardcoded && hasAdminOverride;

            return (
              <div
                key={year}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">Tahun {year}</h3>
                    {isHardcoded && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Hardcoded</span>
                    )}
                    {hasAdminOverride && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Custom Override</span>
                    )}
                    {isAdminOnly && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Admin Only</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Primary: {hasAdminOverride ? adminConfigs[String(year)]?.theme?.primaryColor : (CONFIG_BY_YEAR[year as keyof typeof CONFIG_BY_YEAR] as any)?.theme?.primaryColor || "N/A"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(year)} className="text-slate-600 border-slate-300">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  {hasAdminOverride && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(year)} className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus Override
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {allYears.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Belum ada konfigurasi. Klik "Tambah Tahun Baru" untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
};

function getDefaultAdminConfig(year: number): AdminYearConfig {
  return {
    theme: { primaryColor: "#082e6e" },
    spreadsheetId: "",
    logo: "",
    sheetNames: { donasiMasuk: "Donasi Masuk", realisasi: "Realisasi", penyaluran: "Penyaluran Donasi" },
    columns: {
      tanggal: "Tanggal", donatur: "Donatur", nominal: "Nominal", saldo: "Saldo",
      keperluan: "Keperluan", quranQty: "Quran Qty", iqroQty: "Iqro Qty",
      tempat: "Tempat", qtyIqro: "Qty Iqro", qtyAlQuran: "Qty Al Quran", bukti: "Bukti",
    },
    anonymousDonorNames: ["nn", "anonim", "anonymous", ""],
    anonymousDonorDisplay: "Hamba Allah",
    headerText: {
      title: `Donasi Al-Qur'an ${year}`,
      tagline: "",
      description: "",
    },
    initiators: [],
    initiatorLogos: {},
    publishers: [],
    helpers: [],
    links: [],
    niatDonasi: {
      label: "Niat Donasi",
      text: "Saya niat berdonasi Al-Qur'an karena Allah Ta'ala, semoga menjadi amal jariyah yang terus mengalir pahalanya.",
    },
    qrisConfig: {
      title: "Donasi via QRIS", description: "", image: "", nmid: "",
      merchantName: "", scanInfo: "", downloadText: "Simpan Gambar QRIS", downloadFilename: "qris-code.png",
    },
    bankAccounts: [],
    donationStatus: { isOpen: true, closedMessage: "" },
    socialMediaLinks: [],
    faq: [],
    howToDonate: {
      title: "CARA BERDONASI", description: "", steps: [],
    },
    donationProducts: [],
  };
}

export default Admin;
