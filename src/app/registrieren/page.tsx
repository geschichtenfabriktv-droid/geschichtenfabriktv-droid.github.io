import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Konto erstellen",
  description: "Erstelle dein Arbitrage-Radar-Konto und starte mit Gewinnwahrscheinlichkeiten, Autopilot und Insolvenz-Finder.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
