import "server-only";
import { PRIMARY_DOMAIN, PRIMARY_URL } from "@/lib/site";

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function required(name: string, devFallback?: string): string {
  const v = optional(name);
  if (v) return v;
  if (process.env.NODE_ENV !== "production" && devFallback !== undefined) return devFallback;
  throw new Error(`Umgebungsvariable ${name} fehlt. Siehe .env.example.`);
}

export const env = {
  get appUrl() {
    const explicit = optional("APP_URL");
    if (explicit) return explicit.replace(/\/$/, "");
    // Produktion läuft auf der Hauptdomain; Vorschau-Deployments auf ihrer eigenen Vercel-Adresse.
    if (optional("VERCEL_ENV") === "production") return PRIMARY_URL;
    if (optional("VERCEL_URL")) return `https://${optional("VERCEL_URL")}`;
    return "http://localhost:3000";
  },
  get databaseUrl() {
    return optional("DATABASE_URL");
  },
  get authSecret() {
    const v = required("AUTH_SECRET", "dev-only-secret-dev-only-secret-dev-only-secret");
    if (v.length < 32) throw new Error("AUTH_SECRET muss mindestens 32 Zeichen lang sein.");
    return v;
  },
  get encryptionKey() {
    const v = required("ENCRYPTION_KEY", "ZGV2LW9ubHkta2V5LWRldi1vbmx5LWtleS0xMjM0NTY=");
    if (Buffer.from(v, "base64").length < 32) throw new Error("ENCRYPTION_KEY muss 32 Byte (Base64) lang sein: openssl rand -base64 32");
    return v;
  },
  get mollieApiKey() {
    return optional("MOLLIE_API_KEY");
  },
  get resendApiKey() {
    return optional("RESEND_API_KEY");
  },
  get mailFrom() {
    return optional("MAIL_FROM") ?? `Arbitrage Radar <noreply@${PRIMARY_DOMAIN}>`;
  },
  ebay: {
    get clientId() {
      return optional("EBAY_CLIENT_ID");
    },
    get clientSecret() {
      return optional("EBAY_CLIENT_SECRET");
    },
    get ruName() {
      return optional("EBAY_RUNAME");
    },
    get sandbox() {
      return optional("EBAY_ENV") === "sandbox";
    },
  },
  amazon: {
    get appId() {
      return optional("AMAZON_SP_APP_ID");
    },
    get clientId() {
      return optional("AMAZON_LWA_CLIENT_ID");
    },
    get clientSecret() {
      return optional("AMAZON_LWA_CLIENT_SECRET");
    },
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
};
