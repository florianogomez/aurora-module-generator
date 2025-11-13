
import {
PaymentProviderStore } from "../index"; import {
PaymentProviderInterface } from "../../interfaces/payment_provider_interface"; /** *
remove action * * @param
PaymentProviderStore} store - The Pinia store instance * @param

id:
PaymentProviderInterface["id"] }} payload - ID to remove * @returns {void} */ export
function remove(store:
PaymentProviderStore, { id }: { id:
PaymentProviderInterface["id"] }) { store.elements = store.elements.filter((e) => e.id !==
id); }