import {
PaymentProviderInterface } from "./payment_provider_interface"; /** * Interface pour
le store
PaymentProvider
*/ export interface
PaymentProviderStoreInterface extends StoreInterface { elements:
PaymentProviderInterface[]; }