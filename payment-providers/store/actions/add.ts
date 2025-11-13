import {
PaymentProviderStore } from "../index"; /** * add action * * @param
PaymentProviderStore} store - The Pinia store instance * @param
PaymentProviderInterface} element - Element to add * @returns {void} */ export
function add(store:
PaymentProviderStore, element:
PaymentProviderInterface) { store.elements.push(element); }