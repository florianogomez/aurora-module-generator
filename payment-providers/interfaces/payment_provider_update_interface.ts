import { PaymentProviderCreateInterface } from "./payment_provider_create_interface";

/**
 * Type pour la mise à jour d'un PaymentProvider
 * Tous les champs sont optionnels
 */
export type PaymentProviderUpdateInterface = Partial<PaymentProviderCreateInterface>;
