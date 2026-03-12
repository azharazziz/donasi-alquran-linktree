/**
 * Admin Configuration
 * Credentials and localStorage helpers for admin config management
 */

// Admin credentials - change these to secure your admin panel
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "donasiQuran2026!",
};

const AUTH_KEY = "admin-authenticated";
const CONFIG_STORAGE_KEY = "admin-year-configs";

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function login(username: string, password: string): boolean {
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

// --- Serializable Config Types ---
// These mirror YearlyConfig but with string icon names instead of LucideIcon components

export interface AdminYearConfig {
  theme: { primaryColor: string };
  backgroundImage?: string;
  backgroundImageSize?: string;
  spreadsheetId: string;
  logo: string;
  sheetNames: { donasiMasuk: string; realisasi: string; penyaluran: string };
  columns: {
    tanggal: string; donatur: string; nominal: string; saldo: string;
    keperluan: string; quranQty: string; iqroQty: string; tempat: string;
    qtyIqro: string; qtyAlQuran: string; bukti: string;
  };
  anonymousDonorNames: string[];
  anonymousDonorDisplay: string;
  headerText: { title: string; tagline: string; description: string };
  initiators: Array<{ name: string; initials: string }>;
  initiatorLogos: Record<string, string>;
  publishers?: Array<{ name: string; logo: string }>;
  helpers: string[];
  links: Array<{ icon: string; title: string; subtitle?: string; href?: string; action?: string }>;
  niatDonasi: { label: string; text: string };
  qrisConfig: {
    title: string; description: string; image: string; nmid: string;
    merchantName: string; scanInfo: string; downloadText: string; downloadFilename: string;
  };
  bankAccounts: Array<{ bankName: string; accountNumber: string; accountHolder: string }>;
  donationStatus: { isOpen: boolean; closedMessage: string };
  socialMediaLinks: Array<{ name: string; icon: string; url: string; color: string; bgColor: string }>;
  faq: Array<{ question: string; answer: string }>;
  howToDonate: {
    title: string; description: string;
    steps: Array<{ number: number; title: string; description: string }>;
  };
  donationProducts: Array<{
    title: string; image: string; description: string;
    advantages: string[]; reasons: string[];
  }>;
}

// --- localStorage CRUD ---

export function getAdminConfigs(): Record<string, AdminYearConfig> {
  try {
    const data = localStorage.getItem(CONFIG_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveAdminConfig(year: number, config: AdminYearConfig): void {
  const configs = getAdminConfigs();
  configs[String(year)] = config;
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
}

export function deleteAdminConfig(year: number): void {
  const configs = getAdminConfigs();
  delete configs[String(year)];
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
}

export function getAdminConfig(year: number): AdminYearConfig | null {
  const configs = getAdminConfigs();
  return configs[String(year)] || null;
}
