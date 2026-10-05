import type { Deal, InsolvencyLot } from "../domain/types";

/**
 * Schnittstelle zu allen Datenquellen. Die Demo-Quelle liefert modellierte Daten; echte Quellen
 * (Händler-Feeds, eBay Browse API, Amazon SP-API, Auktionsplattformen, Insolvenzbekanntmachungen)
 * implementieren dieselbe Schnittstelle und werden in `getDataSource` ausgetauscht.
 */
export interface DataSource {
  readonly name: string;
  readonly isDemo: boolean;
  listDeals(): Promise<Deal[]>;
  listLots(): Promise<InsolvencyLot[]>;
}
