import { useState } from "react";
import { saveAdminConfig, type AdminYearConfig } from "@/config/admin";
import { ICON_NAMES } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Plus, Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

interface YearConfigFormProps {
  year: number;
  config: AdminYearConfig;
  isNew: boolean;
  onSaved: () => void;
  onCancel: () => void;
}

const YearConfigForm = ({ year: initialYear, config: initialConfig, isNew, onSaved, onCancel }: YearConfigFormProps) => {
  const [year, setYear] = useState(initialYear);
  const [config, setConfig] = useState<AdminYearConfig>(JSON.parse(JSON.stringify(initialConfig)));
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof AdminYearConfig>(key: K, value: AdminYearConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveAdminConfig(year, config);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSaved();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {isNew ? "Tambah Konfigurasi Baru" : `Edit Konfigurasi ${year}`}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="text-slate-600 border-slate-300">Batal</Button>
          <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Save className="w-4 h-4 mr-1" /> {saved ? "Tersimpan ✓" : "Simpan"}
          </Button>
        </div>
      </div>

      {isNew && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <Label className="text-slate-700">Tahun</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || 0)}
            className="mt-1 max-w-[150px] border-slate-300"
          />
        </div>
      )}

      <Accordion type="multiple" defaultValue={["theme", "header"]} className="space-y-3">
        {/* Theme */}
        <AccordionItem value="theme" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🎨 Tema</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-slate-700">Primary Color (Hex)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={config.theme.primaryColor}
                    onChange={(e) => update("theme", { primaryColor: e.target.value })}
                    className="max-w-[180px] border-slate-300"
                    placeholder="#082e6e"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border border-slate-300 shrink-0"
                    style={{ backgroundColor: config.theme.primaryColor }}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-slate-700">Background Image URL (opsional)</Label>
              <Input
                value={config.backgroundImage || ""}
                onChange={(e) => update("backgroundImage", e.target.value || undefined)}
                className="mt-1 border-slate-300"
                placeholder="URL gambar pattern"
              />
            </div>
            <div>
              <Label className="text-slate-700">Background Image Size</Label>
              <Input
                value={config.backgroundImageSize || ""}
                onChange={(e) => update("backgroundImageSize", e.target.value || undefined)}
                className="mt-1 max-w-[150px] border-slate-300"
                placeholder="200px"
              />
            </div>
            <div>
              <Label className="text-slate-700">Logo URL</Label>
              <Input
                value={config.logo}
                onChange={(e) => update("logo", e.target.value)}
                className="mt-1 border-slate-300"
                placeholder="URL logo utama"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Header Text */}
        <AccordionItem value="header" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📝 Header & Teks</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div>
              <Label className="text-slate-700">Judul</Label>
              <Input
                value={config.headerText.title}
                onChange={(e) => update("headerText", { ...config.headerText, title: e.target.value })}
                className="mt-1 border-slate-300"
              />
            </div>
            <div>
              <Label className="text-slate-700">Tagline</Label>
              <Input
                value={config.headerText.tagline}
                onChange={(e) => update("headerText", { ...config.headerText, tagline: e.target.value })}
                className="mt-1 border-slate-300"
              />
            </div>
            <div>
              <Label className="text-slate-700">Deskripsi</Label>
              <Textarea
                value={config.headerText.description}
                onChange={(e) => update("headerText", { ...config.headerText, description: e.target.value })}
                className="mt-1 border-slate-300"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-slate-700">Niat Donasi Label</Label>
              <Input
                value={config.niatDonasi.label}
                onChange={(e) => update("niatDonasi", { ...config.niatDonasi, label: e.target.value })}
                className="mt-1 border-slate-300"
              />
            </div>
            <div>
              <Label className="text-slate-700">Niat Donasi Teks</Label>
              <Textarea
                value={config.niatDonasi.text}
                onChange={(e) => update("niatDonasi", { ...config.niatDonasi, text: e.target.value })}
                className="mt-1 border-slate-300"
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Google Sheets */}
        <AccordionItem value="sheets" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📊 Google Sheets</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div>
              <Label className="text-slate-700">Spreadsheet ID</Label>
              <Input
                value={config.spreadsheetId}
                onChange={(e) => update("spreadsheetId", e.target.value)}
                className="mt-1 border-slate-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(config.sheetNames) as Array<keyof typeof config.sheetNames>).map((key) => (
                <div key={key}>
                  <Label className="text-slate-700 text-xs">{key}</Label>
                  <Input
                    value={config.sheetNames[key]}
                    onChange={(e) => update("sheetNames", { ...config.sheetNames, [key]: e.target.value })}
                    className="mt-1 border-slate-300 text-sm"
                  />
                </div>
              ))}
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Nama Kolom</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {(Object.keys(config.columns) as Array<keyof typeof config.columns>).map((key) => (
                  <div key={key}>
                    <Label className="text-slate-500 text-xs">{key}</Label>
                    <Input
                      value={config.columns[key]}
                      onChange={(e) => update("columns", { ...config.columns, [key]: e.target.value })}
                      className="mt-1 border-slate-300 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Donation Status */}
        <AccordionItem value="donation-status" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🔓 Status Donasi</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div className="flex items-center gap-3">
              <Switch
                checked={config.donationStatus.isOpen}
                onCheckedChange={(checked) => update("donationStatus", { ...config.donationStatus, isOpen: checked })}
              />
              <Label className="text-slate-700">{config.donationStatus.isOpen ? "Donasi Terbuka" : "Donasi Ditutup"}</Label>
            </div>
            <div>
              <Label className="text-slate-700">Pesan saat ditutup</Label>
              <Textarea
                value={config.donationStatus.closedMessage}
                onChange={(e) => update("donationStatus", { ...config.donationStatus, closedMessage: e.target.value })}
                className="mt-1 border-slate-300"
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Anonymous Donor */}
        <AccordionItem value="anonymous" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">👤 Donor Anonim</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div>
              <Label className="text-slate-700">Nama tampilan donor anonim</Label>
              <Input
                value={config.anonymousDonorDisplay}
                onChange={(e) => update("anonymousDonorDisplay", e.target.value)}
                className="mt-1 border-slate-300"
              />
            </div>
            <div>
              <Label className="text-slate-700">Nama yang dianggap anonim (pisahkan koma)</Label>
              <Input
                value={config.anonymousDonorNames.join(", ")}
                onChange={(e) => update("anonymousDonorNames", e.target.value.split(",").map((s) => s.trim()))}
                className="mt-1 border-slate-300"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Initiators */}
        <AccordionItem value="initiators" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🏢 Inisiator</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.initiators.map((init, i) => (
              <div key={i} className="flex items-end gap-2 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-slate-500 text-xs">Nama</Label>
                  <Input
                    value={init.name}
                    onChange={(e) => {
                      const arr = [...config.initiators];
                      arr[i] = { ...arr[i], name: e.target.value };
                      update("initiators", arr);
                    }}
                    className="mt-1 border-slate-300 text-sm"
                  />
                </div>
                <div className="w-24">
                  <Label className="text-slate-500 text-xs">Inisial</Label>
                  <Input
                    value={init.initials}
                    onChange={(e) => {
                      const arr = [...config.initiators];
                      arr[i] = { ...arr[i], initials: e.target.value };
                      update("initiators", arr);
                    }}
                    className="mt-1 border-slate-300 text-sm"
                  />
                </div>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => update("initiators", config.initiators.filter((_, j) => j !== i))}
                  className="text-red-500 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("initiators", [...config.initiators, { name: "", initials: "" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Inisiator
            </Button>
            <div>
              <Label className="text-slate-700">Helper (pisahkan koma)</Label>
              <Input
                value={config.helpers.join(", ")}
                onChange={(e) => update("helpers", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="mt-1 border-slate-300"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bank Accounts */}
        <AccordionItem value="bank" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🏦 Rekening Bank</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.bankAccounts.map((bank, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">Rekening #{i + 1}</Label>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => update("bankAccounts", config.bankAccounts.filter((_, j) => j !== i))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={bank.bankName}
                  onChange={(e) => {
                    const arr = [...config.bankAccounts];
                    arr[i] = { ...arr[i], bankName: e.target.value };
                    update("bankAccounts", arr);
                  }}
                  placeholder="Nama Bank"
                  className="border-slate-300 text-sm"
                />
                <Input
                  value={bank.accountNumber}
                  onChange={(e) => {
                    const arr = [...config.bankAccounts];
                    arr[i] = { ...arr[i], accountNumber: e.target.value };
                    update("bankAccounts", arr);
                  }}
                  placeholder="Nomor Rekening"
                  className="border-slate-300 text-sm"
                />
                <Input
                  value={bank.accountHolder}
                  onChange={(e) => {
                    const arr = [...config.bankAccounts];
                    arr[i] = { ...arr[i], accountHolder: e.target.value };
                    update("bankAccounts", arr);
                  }}
                  placeholder="Nama Pemegang"
                  className="border-slate-300 text-sm"
                />
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("bankAccounts", [...config.bankAccounts, { bankName: "", accountNumber: "", accountHolder: "" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Rekening
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* QRIS Config */}
        <AccordionItem value="qris" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📱 QRIS</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {(["title", "description", "image", "nmid", "merchantName", "scanInfo", "downloadText", "downloadFilename"] as Array<keyof typeof config.qrisConfig>).map((key) => (
              <div key={key}>
                <Label className="text-slate-700 text-sm">{key}</Label>
                <Input
                  value={config.qrisConfig[key]}
                  onChange={(e) => update("qrisConfig", { ...config.qrisConfig, [key]: e.target.value })}
                  className="mt-1 border-slate-300 text-sm"
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Links */}
        <AccordionItem value="links" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🔗 Menu Link</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.links.map((link, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">Link #{i + 1}</Label>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => update("links", config.links.filter((_, j) => j !== i))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-500 text-xs">Icon</Label>
                    <Select
                      value={link.icon}
                      onValueChange={(val) => {
                        const arr = [...config.links];
                        arr[i] = { ...arr[i], icon: val };
                        update("links", arr);
                      }}
                    >
                      <SelectTrigger className="border-slate-300 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_NAMES.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Title</Label>
                    <Input
                      value={link.title}
                      onChange={(e) => {
                        const arr = [...config.links];
                        arr[i] = { ...arr[i], title: e.target.value };
                        update("links", arr);
                      }}
                      className="border-slate-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">Subtitle</Label>
                  <Input
                    value={link.subtitle || ""}
                    onChange={(e) => {
                      const arr = [...config.links];
                      arr[i] = { ...arr[i], subtitle: e.target.value };
                      update("links", arr);
                    }}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-500 text-xs">Href (URL)</Label>
                    <Input
                      value={link.href || ""}
                      onChange={(e) => {
                        const arr = [...config.links];
                        arr[i] = { ...arr[i], href: e.target.value || undefined };
                        update("links", arr);
                      }}
                      className="border-slate-300 text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Action</Label>
                    <Select
                      value={link.action || "__none__"}
                      onValueChange={(val) => {
                        const arr = [...config.links];
                        arr[i] = { ...arr[i], action: val === "__none__" ? undefined : val };
                        update("links", arr);
                      }}
                    >
                      <SelectTrigger className="border-slate-300 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Tidak ada</SelectItem>
                        <SelectItem value="donationProducts">donationProducts</SelectItem>
                        <SelectItem value="howToDonate">howToDonate</SelectItem>
                        <SelectItem value="transfer">transfer</SelectItem>
                        <SelectItem value="qris">qris</SelectItem>
                        <SelectItem value="report">report</SelectItem>
                        <SelectItem value="faq">faq</SelectItem>
                        <SelectItem value="social">social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("links", [...config.links, { icon: "HelpCircle", title: "", subtitle: "" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Link
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* FAQ */}
        <AccordionItem value="faq" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">❓ FAQ</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.faq.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">FAQ #{i + 1}</Label>
                  <Button variant="ghost" size="icon" onClick={() => update("faq", config.faq.filter((_, j) => j !== i))} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const arr = [...config.faq];
                    arr[i] = { ...arr[i], question: e.target.value };
                    update("faq", arr);
                  }}
                  placeholder="Pertanyaan"
                  className="border-slate-300 text-sm"
                />
                <Textarea
                  value={item.answer}
                  onChange={(e) => {
                    const arr = [...config.faq];
                    arr[i] = { ...arr[i], answer: e.target.value };
                    update("faq", arr);
                  }}
                  placeholder="Jawaban"
                  className="border-slate-300 text-sm"
                  rows={2}
                />
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("faq", [...config.faq, { question: "", answer: "" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah FAQ
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* How to Donate */}
        <AccordionItem value="howtodonate" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📋 Cara Berdonasi</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div>
              <Label className="text-slate-700">Judul</Label>
              <Input
                value={config.howToDonate.title}
                onChange={(e) => update("howToDonate", { ...config.howToDonate, title: e.target.value })}
                className="mt-1 border-slate-300"
              />
            </div>
            <div>
              <Label className="text-slate-700">Deskripsi</Label>
              <Textarea
                value={config.howToDonate.description}
                onChange={(e) => update("howToDonate", { ...config.howToDonate, description: e.target.value })}
                className="mt-1 border-slate-300"
                rows={2}
              />
            </div>
            {config.howToDonate.steps.map((step, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">Langkah {step.number}</Label>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => update("howToDonate", {
                      ...config.howToDonate,
                      steps: config.howToDonate.steps.filter((_, j) => j !== i),
                    })}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...config.howToDonate.steps];
                    steps[i] = { ...steps[i], title: e.target.value };
                    update("howToDonate", { ...config.howToDonate, steps });
                  }}
                  placeholder="Judul langkah"
                  className="border-slate-300 text-sm"
                />
                <Input
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...config.howToDonate.steps];
                    steps[i] = { ...steps[i], description: e.target.value };
                    update("howToDonate", { ...config.howToDonate, steps });
                  }}
                  placeholder="Deskripsi (opsional)"
                  className="border-slate-300 text-sm"
                />
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("howToDonate", {
                ...config.howToDonate,
                steps: [...config.howToDonate.steps, { number: config.howToDonate.steps.length + 1, title: "", description: "" }],
              })}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Langkah
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Social Media Links */}
        <AccordionItem value="social" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📱 Media Sosial</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.socialMediaLinks.map((social, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">{social.name || `Sosmed #${i + 1}`}</Label>
                  <Button variant="ghost" size="icon" onClick={() => update("socialMediaLinks", config.socialMediaLinks.filter((_, j) => j !== i))} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-500 text-xs">Nama</Label>
                    <Input
                      value={social.name}
                      onChange={(e) => {
                        const arr = [...config.socialMediaLinks];
                        arr[i] = { ...arr[i], name: e.target.value };
                        update("socialMediaLinks", arr);
                      }}
                      className="border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Icon</Label>
                    <Select
                      value={social.icon}
                      onValueChange={(val) => {
                        const arr = [...config.socialMediaLinks];
                        arr[i] = { ...arr[i], icon: val };
                        update("socialMediaLinks", arr);
                      }}
                    >
                      <SelectTrigger className="border-slate-300 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_NAMES.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">URL</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => {
                      const arr = [...config.socialMediaLinks];
                      arr[i] = { ...arr[i], url: e.target.value };
                      update("socialMediaLinks", arr);
                    }}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-500 text-xs">Color class</Label>
                    <Input
                      value={social.color}
                      onChange={(e) => {
                        const arr = [...config.socialMediaLinks];
                        arr[i] = { ...arr[i], color: e.target.value };
                        update("socialMediaLinks", arr);
                      }}
                      className="border-slate-300 text-sm"
                      placeholder="hover:text-pink-500"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Bg Color class</Label>
                    <Input
                      value={social.bgColor}
                      onChange={(e) => {
                        const arr = [...config.socialMediaLinks];
                        arr[i] = { ...arr[i], bgColor: e.target.value };
                        update("socialMediaLinks", arr);
                      }}
                      className="border-slate-300 text-sm"
                      placeholder="hover:bg-pink-50"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("socialMediaLinks", [...config.socialMediaLinks, { name: "", icon: "Instagram", url: "", color: "hover:text-pink-500", bgColor: "hover:bg-pink-50" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Sosmed
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Donation Products */}
        <AccordionItem value="products" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">🎁 Produk Donasi</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {config.donationProducts.map((product, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 font-medium">{product.title || `Produk #${i + 1}`}</Label>
                  <Button variant="ghost" size="icon" onClick={() => update("donationProducts", config.donationProducts.filter((_, j) => j !== i))} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={product.title}
                  onChange={(e) => {
                    const arr = [...config.donationProducts];
                    arr[i] = { ...arr[i], title: e.target.value };
                    update("donationProducts", arr);
                  }}
                  placeholder="Nama produk"
                  className="border-slate-300 text-sm"
                />
                <Input
                  value={product.image}
                  onChange={(e) => {
                    const arr = [...config.donationProducts];
                    arr[i] = { ...arr[i], image: e.target.value };
                    update("donationProducts", arr);
                  }}
                  placeholder="URL gambar"
                  className="border-slate-300 text-sm"
                />
                <Textarea
                  value={product.description}
                  onChange={(e) => {
                    const arr = [...config.donationProducts];
                    arr[i] = { ...arr[i], description: e.target.value };
                    update("donationProducts", arr);
                  }}
                  placeholder="Deskripsi"
                  className="border-slate-300 text-sm"
                  rows={2}
                />
                <div>
                  <Label className="text-slate-500 text-xs">Keunggulan (satu per baris)</Label>
                  <Textarea
                    value={product.advantages.join("\n")}
                    onChange={(e) => {
                      const arr = [...config.donationProducts];
                      arr[i] = { ...arr[i], advantages: e.target.value.split("\n").filter(Boolean) };
                      update("donationProducts", arr);
                    }}
                    className="border-slate-300 text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">Alasan (satu per baris)</Label>
                  <Textarea
                    value={product.reasons.join("\n")}
                    onChange={(e) => {
                      const arr = [...config.donationProducts];
                      arr[i] = { ...arr[i], reasons: e.target.value.split("\n").filter(Boolean) };
                      update("donationProducts", arr);
                    }}
                    className="border-slate-300 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("donationProducts", [...config.donationProducts, { title: "", image: "", description: "", advantages: [], reasons: [] }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Produk
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Publishers */}
        <AccordionItem value="publishers" className="bg-white rounded-xl border border-slate-200 px-5">
          <AccordionTrigger className="text-slate-900 font-semibold">📚 Penerbit</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {(config.publishers || []).map((pub, i) => (
              <div key={i} className="flex items-end gap-2 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-slate-500 text-xs">Nama</Label>
                  <Input
                    value={pub.name}
                    onChange={(e) => {
                      const arr = [...(config.publishers || [])];
                      arr[i] = { ...arr[i], name: e.target.value };
                      update("publishers", arr);
                    }}
                    className="mt-1 border-slate-300 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-slate-500 text-xs">Logo URL</Label>
                  <Input
                    value={pub.logo}
                    onChange={(e) => {
                      const arr = [...(config.publishers || [])];
                      arr[i] = { ...arr[i], logo: e.target.value };
                      update("publishers", arr);
                    }}
                    className="mt-1 border-slate-300 text-sm"
                  />
                </div>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => update("publishers", (config.publishers || []).filter((_, j) => j !== i))}
                  className="text-red-500 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              onClick={() => update("publishers", [...(config.publishers || []), { name: "", logo: "" }])}
              className="text-slate-600 border-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Penerbit
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default YearConfigForm;
