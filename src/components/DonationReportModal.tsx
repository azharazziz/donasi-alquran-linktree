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
  useGoogleSheetDynamic,
  type SheetName,
} from "@/hooks/useGoogleSheets";
import DynamicDetailModal from "./DynamicDetailModal";

interface DonationReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TAB_CONFIG: { key: string; label: string; sheet: SheetName }[] = [
  { key: "donasi", label: "Donasi Masuk", sheet: "Donasi Masuk" },
  { key: "realisasi", label: "Realisasi", sheet: "Realisasi" },
  { key: "penyaluran", label: "Penyaluran", sheet: "Penyaluran Donasi" },
];

function stripHideMarker(header: string): string {
  return header.replace(/\s*\[hide\]\s*/gi, "").trim();
}

function isHiddenColumn(header: string): boolean {
  return /\[hide\]/i.test(header);
}

const DonationReportModal = ({ open, onOpenChange }: DonationReportModalProps) => {
  const [activeTab, setActiveTab] = useState("donasi");

  const donasi = useGoogleSheetDynamic("Donasi Masuk", open);
  const realisasi = useGoogleSheetDynamic("Realisasi", open);
  const penyaluran = useGoogleSheetDynamic("Penyaluran Donasi", open);

  const sheetDataMap: Record<string, typeof donasi> = {
    donasi,
    realisasi,
    penyaluran,
  };

  // Detail modal state
  const [selectedRow, setSelectedRow] = useState<Record<string, string> | null>(null);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [detailTitle, setDetailTitle] = useState("Detail");

  const handleRefresh = () => {
    sheetDataMap[activeTab]?.refetch();
  };

  const handleRowClick = (row: Record<string, string>, headers: string[], tabLabel: string) => {
    setSelectedRow(row);
    setSelectedHeaders(headers);
    setDetailTitle(`Detail ${tabLabel}`);
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
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3 min-h-0">
              {TAB_CONFIG.map((tab) => {
                const data = sheetDataMap[tab.key];
                return (
                  <TabsContent key={tab.key} value={tab.key} className="mt-0">
                    <DynamicSheetTable
                      loading={data.loading}
                      error={data.error}
                      headers={data.headers}
                      rows={data.rows}
                      onRowClick={(row) => handleRowClick(row, data.headers, tab.label)}
                    />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Unified detail modal */}
      <DynamicDetailModal
        open={!!selectedRow}
        onOpenChange={(v) => !v && setSelectedRow(null)}
        row={selectedRow}
        headers={selectedHeaders}
        title={detailTitle}
      />
    </>
  );
};

// Dynamic table renderer
function DynamicSheetTable({
  loading,
  error,
  headers,
  rows,
  onRowClick,
}: {
  loading: boolean;
  error: string | null;
  headers: string[];
  rows: Record<string, string>[];
  onRowClick: (row: Record<string, string>) => void;
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

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <p className="text-sm text-muted-foreground">Belum ada data</p>
      </div>
    );
  }

  // Filter out hidden columns for table view
  const visibleHeaders = headers.filter((h) => !isHiddenColumn(h));

  if (visibleHeaders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <p className="text-sm text-muted-foreground">Tidak ada kolom untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Column headers */}
      <div
        className="grid gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
        style={{ gridTemplateColumns: `repeat(${visibleHeaders.length}, 1fr) 28px` }}
      >
        {visibleHeaders.map((header) => (
          <span key={header}>{stripHideMarker(header)}</span>
        ))}
        <span />
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <button
          key={i}
          onClick={() => onRowClick(row)}
          className="grid gap-2 px-3 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 text-left group cursor-pointer"
          style={{ gridTemplateColumns: `repeat(${visibleHeaders.length}, 1fr) 28px` }}
        >
          {visibleHeaders.map((header) => (
            <span
              key={header}
              className="text-xs text-foreground truncate"
              title={row[header] || ""}
            >
              {row[header] || "-"}
            </span>
          ))}
          <Eye
            size={14}
            className="text-muted-foreground group-hover:text-primary transition-colors self-center"
          />
        </button>
      ))}
    </div>
  );
}

export default DonationReportModal;
