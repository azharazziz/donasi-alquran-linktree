/**
 * Icon Name to LucideIcon Component Mapping
 * Used to convert string icon names from admin config to actual components
 */

import {
  Landmark, QrCode, Globe, MessageCircle, HelpCircle, FileText,
  Instagram, BarChart3, Facebook, Twitter, Youtube, Linkedin, Mail,
  MapPinCheck, BookOpen, Gift, Heart, Star, Users, Calendar,
  Phone, Send, ExternalLink, Info, AlertCircle, CheckCircle,
  Clock, Download, Upload, Share2, Bookmark, Tag, Shield,
  Award, Zap, TrendingUp, DollarSign, CreditCard, Banknote,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Landmark, QrCode, Globe, MessageCircle, HelpCircle, FileText,
  Instagram, BarChart3, Facebook, Twitter, Youtube, Linkedin, Mail,
  MapPinCheck, BookOpen, Gift, Heart, Star, Users, Calendar,
  Phone, Send, ExternalLink, Info, AlertCircle, CheckCircle,
  Clock, Download, Upload, Share2, Bookmark, Tag, Shield,
  Award, Zap, TrendingUp, DollarSign, CreditCard, Banknote,
};

export const ICON_NAMES = Object.keys(ICON_MAP).sort();

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || HelpCircle;
}
