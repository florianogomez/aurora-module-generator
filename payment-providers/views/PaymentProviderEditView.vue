<script setup lang="ts">
import BaseBlock from "@/components/BaseBlock.vue";
import { ref, onMounted } from "vue";
import { ApiError } from "@/api/errors/index";
import { usePaymentProviderActions } from "../composables/use_payment_provider_actions";
import { PaymentProviderModel } from "../models/payment_provider_model";
import { PaymentProviderStore } from "../store/payment_provider_store";
import PaymentProviderForm from "../components/PaymentProviderForm.vue";
import { PaymentProviderCreateInterface } from "../interfaces/payment_provider_create_interface";
import { PaymentProviderUpdateInterface } from "../interfaces/payment_provider_update_interface";

const logger = createLogger("paymentProviderEditView");

const route = useRoute();
const paymentProviderId = computed(() => (route.params as { id?: string }).id);

const paymentProviderStore = ref<PaymentProviderStore | null>(null);
const currentPaymentProvider = ref<PaymentProviderModel | null>(null);

const { processing: loading } = usePaymentProviderActions();

const fetchPaymentProvider = async () => {
	if (!paymentProviderStore.value) {
		paymentProviderStore.value = await useInitializedPaymentProviderStore();
	}

	const id = paymentProviderId.value;
	if (!id) {
		logger.error("ID paymentprovider manquant");
		toast.error("ID paymentprovider manquant");
		router.push("/payment-providers");
		return;
	}

	await paymentProviderStore.value.getPaymentProviders();
	const result = await paymentProviderStore.value.findPaymentProvider(id);

	if (result instanceof ApiError) {
		logger.error("Erreur lors de la récupération unpaymentprovider", result);
		toast.error(result.message || "Erreur lors de la récupération unpaymentprovider");
		router.push("/payment-providers");
		return;
	}

	currentPaymentProvider.value = new PaymentProviderModel(result.interface);
};

const handleSave = async (data: PaymentProviderCreateInterface | PaymentProviderUpdateInterface) => {
	if (!paymentProviderStore.value || !paymentProviderId.value) {
		logger.error("Le store paymentprovider n'est pas initialisé ou ID manquant");
		return;
	}

	const updateData = data as PaymentProviderUpdateInterface;
	logger.info("Mise à jour unpaymentprovider", updateData);

	const result = await paymentProviderStore.value.updatePaymentProvider(paymentProviderId.value, updateData);

	if (result instanceof ApiError) {
		logger.error("Erreur lors de la mise à jour unpaymentprovider", result);
		toast.error(result.message || "Erreur lors de la mise à jour unpaymentprovider");
		return;
	}

	logger.info("PaymentProvider mis à jour avec succès", result);
	toast.success("PaymentProvider modifié avec succès !");
	router.push("/payment-providers");
};

const handleCancel = () => {
	router.push("/payment-providers");
};

onMounted(async () => {
	await fetchPaymentProvider();
});
</script>

<template>
	<BaseBlock
		title="Modifier lepaymentprovider"
		class="block-mode-loading-oneui"
		:class="{ 'block-mode-loading': loading }"
	>
		<div class="pb-8">
			<PaymentProviderForm
				:paymentProvider="currentPaymentProvider"
				:loading="loading"
				@save="handleSave"
				@cancel="handleCancel"
			/>
		</div>
	</BaseBlock>
</template>
