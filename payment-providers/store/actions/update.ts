
import {
PaymentProviderStore } from "../index"; import {
PaymentProviderInterface } from "../../interfaces/payment_provider_interface"; /** *
update action * * @param
PaymentProviderStore} store - The Pinia store instance * @param

id:
PaymentProviderInterface["id"], data:
PaymentProviderInterface }} payload - Data to update * @returns {void} */ export function
update(store:
PaymentProviderStore, { id, data }: { id:
PaymentProviderInterface["id"], data:
PaymentProviderInterface }) { const index = store.elements.findIndex((e) => e.id === id); if
(index !== -1) { store.elements[index] = { ...store.elements[index], ...data }; } }