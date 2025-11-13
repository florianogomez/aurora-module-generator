import { paymentProviderStoreDefinition } from "./definition";
import { paymentProviderStoreGetters } from "./getters";
import { paymentProviderStoreActions } from "./actions";

const usePaymentProviderStore = defineStore(paymentProviderStoreDefinition.key, {
	state: (): PaymentProviderStoreInterface => structuredClone(paymentProviderStoreDefinition.service.defaults),
	getters: paymentProviderStoreGetters,
	actions: {
		add(element: PaymentProviderInterface) {
			return paymentProviderStoreActions.add(this, element);
		},
		find(id: PaymentProviderInterface["id"]) {
			return paymentProviderStoreActions.find(this, { id });
		},
		update(id: PaymentProviderInterface["id"], element: PaymentProviderInterface) {
			return paymentProviderStoreActions.update(this, { id, data: element });
		},
		remove(id: PaymentProviderInterface["id"]) {
			return paymentProviderStoreActions.remove(this, { id });
		},
		getPaymentProviders(args?: ListApiArgsInterface) {
			return paymentProviderStoreActions.getPaymentProviders(this, { args });
		},
		findPaymentProvider(id: PaymentProviderInterface["id"]) {
			return paymentProviderStoreActions.findPaymentProvider(this, { elementId: id });
		},
		createPaymentProvider(data: PaymentProviderCreateInterface) {
			return paymentProviderStoreActions.createPaymentProvider(this, { data });
		},
		updatePaymentProvider(elementId: PaymentProviderInterface["id"], data: PaymentProviderUpdateInterface) {
			return paymentProviderStoreActions.updatePaymentProvider(this, { elementId, data });
		},
		deletePaymentProvider(elementId: PaymentProviderInterface["id"]) {
			return paymentProviderStoreActions.deletePaymentProvider(this, { elementId });
		},
		initialize({ reset = false } = {}) {
			return paymentProviderStoreActions.initialize(this, { reset });
		},
		setLoading(loading: boolean) {
			return paymentProviderStoreActions.setLoading(this, loading);
		},
		setPaymentProviders(payload: object) {
			return paymentProviderStoreActions.setPaymentProviders(this, payload);
		},
	},
});

export async function useInitializedPaymentProviderStore(): Promise<ReturnType<typeof usePaymentProviderStore>> {
	const store = usePaymentProviderStore();
	if (!store.initialized) await store.initialize({ reset: false });
	return store;
}

export type PaymentProviderStore = ReturnType<typeof usePaymentProviderStore>;
