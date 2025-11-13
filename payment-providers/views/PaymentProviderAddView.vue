<script setup lang="ts">
import BaseBlock from "@/components/BaseBlock.vue";
import { ApiError } from "@/api/errors/index";
import { usePaymentProviderActions } from "../composables/use_payment_provider_actions";
import PaymentProviderForm from "../components/PaymentProviderForm.vue";
import { PaymentProviderCreateInterface } from "../interfaces/payment_provider_create_interface";
import { PaymentProviderUpdateInterface } from "../interfaces/payment_provider_update_interface";

const logger = createLogger("paymentProviderAddView");

const { processing: loading, createPaymentProvider: create } = usePaymentProviderActions();

const handleSave = async (data: PaymentProviderCreateInterface | PaymentProviderUpdateInterface) => {
	const createData = data as PaymentProviderCreateInterface;
	logger.info("Création unpaymentprovider", createData);
	const result = await create(createData);

	if (result instanceof ApiError) {
		logger.error("Erreur lors de la création unpaymentprovider", result);
		toast.error(result.message || "Erreur lors de la création unpaymentprovider");
		return;
	}

	logger.info("PaymentProvider créé avec succès", result);
	toast.success("PaymentProvider créé avec succès !");
	router.push("/payment-providers");
};

const handleCancel = () => {
	router.push("/payment-providers");
};
</script>

<template>
	<BaseBlock
		title="Ajouter unpaymentprovider"
		class="block-mode-loading-oneui"
		:class="{ 'block-mode-loading': loading }"
	>
		<div class="pb-8">
			<PaymentProviderForm :loading="loading" @save="handleSave" @cancel="handleCancel" />
		</div>
	</BaseBlock>
</template>
