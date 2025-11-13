import { PaymentProviderInterface } from "./payment_provider_interface";

/**
 * Type pour la création d'un PaymentProvider
 * Exclut les champs ApiResourceInterface qui sont générés automatiquement
 */
export type PaymentProviderCreateInterface = Omit<PaymentProviderInterface, keyof ApiResourceInterface>;
