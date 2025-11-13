
import {
PaymentProviderInterface } from "../../interfaces/payment-provider_interface"; import {
PaymentProviderStore } from "../index"; /** * find action * * @param
PaymentProviderStore} store - The Pinia store instance * @param

id:
PaymentProviderInterface["id"] }} payload - ID to find * @returns
PaymentProviderInterface | undefined} */ export function find(store:
PaymentProviderStore, { id }: { id:
PaymentProviderInterface["id"] }) { return store.elements.find((e) => e.id === id); }