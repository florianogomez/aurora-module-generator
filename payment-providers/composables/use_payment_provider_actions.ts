import { ApiError } from "@/api/errors";
import { PaymentProviderInterface } from "../interfaces";
import { PaymentProviderListFilterInterface } from "../interfaces/payment_provider_list_filter_interface";
import { PaymentProviderCreateInterface } from "../interfaces/payment_provider_create_interface";
import { PaymentProviderUpdateInterface } from "../interfaces/payment_provider_update_interface";
import { PaymentProviderModel } from "../models/payment_provider_model";
import { usePaymentProviderStore } from "../stores/paymentProvider_store";

const logger = createLogger("usePaymentProviderActions");

export const usePaymentProviderActions = () => {
	const globalStore = useGlobalStore();
	const paymentProviderStore = ref<PaymentProviderStore | null>(null);
	const paymentProviders = ref<PaymentProviderModel[]>([]);
	const processing = computed(() => (paymentProviderStore.value ? paymentProviderStore.value.loading : true));

	const getPaymentProviders = async (args?: PaymentProviderListFilterInterface) => {
		if (!paymentProviderStore.value) {
			paymentProviderStore.value = await useInitializedPaymentProviderStore();
		}

		const result = await paymentProviderStore.value.getPaymentProviders(args);

		if (result instanceof ApiError) {
			logger.error("Error fetching paymentproviders:", { result });
			globalStore.showSnackbarErrorAction(result.errorMessage);

			return [];
		}

		paymentProviders.value = [...result];
	};

	const findPaymentProvider = async (id: PaymentProviderInterface["id"]) => {
		if (!paymentProviderStore.value) {
			paymentProviderStore.value = await useInitializedPaymentProviderStore();
		}

		const result = await paymentProviderStore.value.findPaymentProvider(id);
		if (result instanceof ApiError) {
			logger.error("Error finding paymentprovider:", result);
			globalStore.showSnackbarErrorAction(result.errorMessage);
			return null;
		}

		return new PaymentProviderModel(result.interface);
	};

	const createPaymentProvider = async (data: PaymentProviderCreateInterface) => {
		if (!paymentProviderStore.value) {
			paymentProviderStore.value = await useInitializedPaymentProviderStore();
		}

		const result = await paymentProviderStore.value.createPaymentProvider(data);
		if (result instanceof ApiError) {
			logger.error("Error creating paymentprovider:", result);

			globalStore.showSnackbarErrorAction(
				`Erreur lors de la création du paymentprovider: ${result.errorMessage}`
			);

			return result;
		}

		globalStore.showSnackbarSuccessAction(`PaymentProvider créé avec succès.`);

		return new PaymentProviderModel(result.interface);
	};

	const updatePaymentProvider = async (elementId: PaymentProviderInterface["id"], data: PaymentProviderUpdateInterface) => {
		if (!paymentProviderStore.value) {
			paymentProviderStore.value = await useInitializedPaymentProviderStore();
		}

		const result = await paymentProviderStore.value.updatePaymentProvider(elementId, data);
		if (result instanceof ApiError) {
			logger.error("Error updating paymentprovider:", result);
			globalStore.showSnackbarErrorAction(
				`Erreur lors de la mise à jour du paymentprovider: ${result.errorMessage}`
			);
			return result;
		}

		globalStore.showSnackbarSuccessAction(`PaymentProvider mis à jour avec succès.`);

		return new PaymentProviderModel(result.interface);
	};

	const deletePaymentProvider = async (element: PaymentProviderInterface) => {
		if (!paymentProviderStore.value) {
			paymentProviderStore.value = await useInitializedPaymentProviderStore();
		}

		const result = await paymentProviderStore.value.deletePaymentProvider(element.id);
		if (result instanceof ApiError) {
			logger.error("Error deleting paymentprovider:", result);

			globalStore.showSnackbarErrorAction(
				`Erreur lors de la suppression du paymentprovider: ${result.errorMessage}`
			);
			return false;
		}

		globalStore.showSnackbarSuccessAction(
			`PaymentProvider supprimé avec succès.`
		);
		getPaymentProviders();

		return true;
	};

	onMounted(async () => {
		paymentProviderStore.value = await useInitializedPaymentProviderStore();
		paymentProviders.value = paymentProviderStore.value.elements.map((paymentProvider) => new PaymentProviderModel(paymentProvider));
	});

	return {
		processing,
		paymentProviders,
		getPaymentProviders,
		findPaymentProvider,
		createPaymentProvider,
		updatePaymentProvider,
		deletePaymentProvider,
	};
};
