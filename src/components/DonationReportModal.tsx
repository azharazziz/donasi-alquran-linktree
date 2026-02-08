import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDonasiMasuk,
  useRealisasi,
  usePenyaluran,
  type DonasiMasukRow,
  type RealisasiRow,
  type PenyaluranRow,
} from "@/hooks/useGoogleSheets";
import DonasiMasukDetail from "./DonasiMasukDetail";
import RealisasiDetail from "./RealisasiDetail";
import PenyaluranDetail from "./PenyaluranDetail";

interface DonationReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonationReportModal = ({ open, onOpenChange }: DonationReportModalProps) => {
  const [activeTab, setActiveTab] = useState("donasi");

  const donasi = useDonasiMasuk(open);
  const realisasi = useRealisasi(open);
  const penyaluran = usePenyaluran(open);

  // Detail modal state
  const [selectedDonasi, setSelectedDonasi] = useState<DonasiMasukRow | null>(null);
  const [selectedRealisasi, setSelectedRealisasi] = useState<RealisasiRow | null>(null);
  const [selectedPenyaluran, setSelectedPenyaluran] = useState<PenyaluranRow | null>(null);

  const handleRefresh = () => {
    if (activeTab === "donasi") donasi.refetch();
    if (activeTab === "realisasi") realisasi.refetch();
    if (activeTab === "penyaluran") penyaluran.refetch();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-serif text-primary">
                  Laporan Donasi
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Data laporan dari Google Sheets
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-3 h-9">
                <TabsTrigger value="donasi" className="text-xs">
                  Donasi Masuk
                </TabsTrigger>
                <TabsTrigger value="realisasi" className="text-xs">
                  Realisasi
                </TabsTrigger>
                <TabsTrigger value="penyaluran" className="text-xs">
                  Penyaluran
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3 min-h-0">
              <TabsContent value="donasi" className="mt-0">
                <SheetTable
                  loading={donasi.loading}
                  error={donasi.error}
                  data={donasi.data}
                  columns={["Tanggal", "Donatur", "Nominal"]}
                  renderRow={(row: DonasiMasukRow) => [row.tanggal, row.donatur, row.nominal]}
                  onRowClick={(row) => setSelectedDonasi(row)}
                />
              </TabsContent>

              <TabsContent value="realisasi" className="mt-0">
                <SheetTable
                  loading={realisasi.loading}
                  error={realisasi.error}
                  data={realisasi.data}
                  columns={["Tanggal", "Keperluan", "Nominal"]}
                  renderRow={(row: RealisasiRow) => [row.tanggal, row.keperluan, row.nominal]}
                  onRowClick={(row) => setSelectedRealisasi(row)}
                />
              </TabsContent>

              <TabsContent value="penyaluran" className="mt-0">
                <SheetTable
                  loading={penyaluran.loading}
                  error={penyaluran.error}
                  data={penyaluran.data}
                  columns={["Tanggal", "Tempat", "Qty Quran"]}
                  renderRow={(row: PenyaluranRow) => [row.tanggal, row.tempat, row.qtyAlQuran]}
                  onRowClick={(row) => setSelectedPenyaluran(row)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Detail modals */}
      <DonasiMasukDetail
        open={!!selectedDonasi}
        onOpenChange={(v) => !v && setSelectedDonasi(null)}
        data={selectedDonasi}
      />
      <RealisasiDetail
        open={!!selectedRealisasi}
        onOpenChange={(v) => !v && setSelectedRealisasi(null)}
        data={selectedRealisasi}
      />
      <PenyaluranDetail
        open={!!selectedPenyaluran}
        onOpenChange={(v) => !v && setSelectedPenyaluran(null)}
        data={selectedPenyaluran}
      />
    </>
  );
};

// Generic table renderer
function SheetTable<T>({
  loading,
  error,
  data,
  columns,
  renderRow,
  onRowClick,
}: {
  loading: boolean;
  error: string | null;
  data: T[];
  columns: string[];
  renderRow: (row: T) => string[];
  onRowClick: (row: T) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="animate-spin text-primary" size={24} />
        <p className="text-sm text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <AlertCircle className="text-destructive" size={24} />
        <p className="text-sm text-muted-foreground text-center">
          Gagal memuat data: {error}
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <p className="text-sm text-muted-foreground">Belum ada data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Column headers */}
      <div className="grid gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 28px` }}
      >
        {columns.map((col) => (
          <span key={col}>{col}</span>
        ))}
        <span />
      </div>

      {/* Rows */}
      {data.map((row, i) => {
        const cells = renderRow(row);
        return (
          <button
            key={i}
            onClick={() => onRowClick(row)}
            className="grid gap-2 px-3 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 text-left group cursor-pointer"
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) 28px` }}
          >
            {cells.map((cell, j) => (
              <span
                key={j}
                className="text-xs text-foreground truncate"
                title={cell}
              >
                {cell || "-"}
              </span>
            ))}
            <Eye
              size={14}
              className="text-muted-foreground group-hover:text-primary transition-colors self-center"
            />
          </button>
        );
      })}
    </div>
  );
}

export default DonationReportModal;
