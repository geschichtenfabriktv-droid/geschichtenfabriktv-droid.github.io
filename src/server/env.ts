import "server-only";

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
    return (optional("APP_URL") ?? (optional("VERCEL_PROJECT_PRODUCTION_URL") ? `https://${optional("VERCEL_PROJECT_PRODUCTION_URL")}` : "http://localhost:3000")).replace(/\/$/, "");
  },
  get databaseUrl() {
    return optional("DATABASE_URL");
  },
  get authSecret() {
    return required("AUTH_SECRET", "dev-only-secret-dev-only-secret-dev-only-secret");
  },
  get encryptionKey() {
    return required("ENCRYPTION_KEY", "ZGV2LW9ubHkta2V5LWRldi1vbmx5LWtleS0xMjM0NTY=");
  },
  get mollieApiKey() {
    return optional("MOLLIE_API_KEY");
  },
  get resendApiKey() {
    return optional("RESEND_API_KEY");
  },
  get mailFrom() {
    return optional("MAIL_FROM") ?? "Arbitrage Radar <noreply@example.com>";
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
