/**
 * Converts hardcoded YearlyConfig (with LucideIcon components) to AdminYearConfig (with string icon names)
 * and vice versa.
 */

import type { YearlyConfig } from "./types";
import type { AdminYearConfig } from "./admin";
import { ICON_MAP, getIcon } from "@/lib/icon-map";
import type { LucideIcon } from "lucide-react";

/**
 * Find the string name of a LucideIcon component
 */
function iconToName(icon: LucideIcon): string {
  for (const [name, comp] of Object.entries(ICON_MAP)) {
    if (comp === icon) return name;
  }
  return "HelpCircle";
}

/**
 * Convert hardcoded YearlyConfig to serializable AdminYearConfig
 */
export function hardcodedConfigToAdmin(config: YearlyConfig): AdminYearConfig {
  return {
    theme: { primaryColor: config.theme.primaryColor },
    backgroundImage: config.backgroundImage || undefined,
    backgroundImageSize: config.backgroundImageSize || undefined,
    spreadsheetId: config.spreadsheetId,
    logo: config.logo,
    sheetNames: { ...config.sheetNames },
    columns: { ...config.columns },
    anonymousDonorNames: [...config.anonymousDonorNames],
    anonymousDonorDisplay: config.anonymousDonorDisplay,
    headerText: { ...config.headerText },
    initiators: config.initiators.map((i) => ({ ...i })),
    initiatorLogos: { ...config.initiatorLogos },
    publishers: config.publishers?.map((p) => ({ ...p })),
    helpers: [...config.helpers],
    links: config.links.map((l) => ({
      icon: iconToName(l.icon),
      title: l.title,
      subtitle: l.subtitle,
      href: l.href,
      action: l.action,
    })),
    niatDonasi: { ...config.niatDonasi },
    qrisConfig: { ...config.qrisConfig },
    bankAccounts: config.bankAccounts.map((b) => ({ ...b })),
    donationStatus: { ...config.donationStatus },
    socialMediaLinks: config.socialMediaLinks.map((s) => ({
      name: s.name,
      icon: iconToName(s.icon),
      url: s.url,
      color: s.color,
      bgColor: s.bgColor,
    })),
    faq: config.faq.map((f) => ({ ...f })),
    howToDonate: {
      title: config.howToDonate.title,
      description: config.howToDonate.description,
      steps: config.howToDonate.steps.map((s) => ({ ...s })),
    },
    donationProducts: config.donationProducts.map((p) => ({
      title: p.title,
      image: p.image,
      description: p.description,
      advantages: [...p.advantages],
      reasons: [...p.reasons],
    })),
  };
}

/**
 * Convert AdminYearConfig to YearlyConfig (with actual LucideIcon components)
 */
export function adminConfigToYearly(admin: AdminYearConfig): YearlyConfig {
  return {
    theme: { primaryColor: admin.theme.primaryColor },
    backgroundImage: admin.backgroundImage,
    backgroundImageSize: admin.backgroundImageSize,
    spreadsheetId: admin.spreadsheetId,
    logo: admin.logo,
    sheetNames: { ...admin.sheetNames },
    columns: { ...admin.columns },
    anonymousDonorNames: [...admin.anonymousDonorNames],
    anonymousDonorDisplay: admin.anonymousDonorDisplay,
    headerText: { ...admin.headerText },
    initiators: admin.initiators.map((i) => ({ ...i })),
    initiatorLogos: { ...admin.initiatorLogos },
    publishers: admin.publishers?.map((p) => ({ ...p })),
    helpers: [...admin.helpers],
    links: admin.links.map((l) => ({
      icon: getIcon(l.icon),
      title: l.title,
      subtitle: l.subtitle,
      href: l.href,
      action: l.action,
    })),
    niatDonasi: { ...admin.niatDonasi },
    qrisConfig: { ...admin.qrisConfig },
    bankAccounts: admin.bankAccounts.map((b) => ({ ...b })),
    donationStatus: { ...admin.donationStatus },
    socialMediaLinks: admin.socialMediaLinks.map((s) => ({
      name: s.name,
      icon: getIcon(s.icon),
      url: s.url,
      color: s.color,
      bgColor: s.bgColor,
    })),
    faq: admin.faq.map((f) => ({ ...f })),
    howToDonate: {
      title: admin.howToDonate.title,
      description: admin.howToDonate.description,
      steps: admin.howToDonate.steps.map((s) => ({ ...s })),
    },
    donationProducts: admin.donationProducts.map((p) => ({
      title: p.title,
      image: p.image,
      description: p.description,
      advantages: [...p.advantages],
      reasons: [...p.reasons],
    })),
  };
}
