<script setup lang="ts">
import { PaymentProviderModel } from "../models/payment_provider_model";
import { PaymentProviderCreateInterface } from "../interfaces/payment_provider_create_interface";
import { PaymentProviderUpdateInterface } from "../interfaces/payment_provider_update_interface";
import PaymentProviderForm from "./PaymentProviderForm.vue";

interface Props {
	modelValue: boolean;
	paymentProvider?: PaymentProviderModel | null;
	loading?: boolean;
}

interface Emits {
	(e: "update:modelValue", value: boolean): void;
	(e: "save", data: PaymentProviderCreateInterface | PaymentProviderUpdateInterface): void;
}

const props = withDefaults(defineProps<Props>(), {
	paymentProvider: null,
	loading: false,
});

const emit = defineEmits<Emits>();

const showDialog = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const isEditMode = computed(() => !!props.paymentProvider);

const dialogTitle = computed(() =>
	isEditMode.value ? "Modifier lepaymentprovider" : "Ajouter unpaymentprovider"
);

// Form ref
const paymentProviderFormRef = ref<InstanceType<typeof PaymentProviderForm> | null>(null);

// Methods
const closeDialog = () => {
	paymentProviderFormRef.value?.resetForm();
	showDialog.value = false;
};

const handleSave = (data: PaymentProviderCreateInterface | PaymentProviderUpdateInterface) => {
	emit("save", data);
};

// Watchers
watch(
	() => props.modelValue,
	(isOpen) => {
		if (!isOpen) {
			paymentProviderFormRef.value?.resetForm();
		}
	}
);
</script>

<template>
	<VDialog v-model="showDialog" max-width="600px" persistent scrollable>
		<VCard>
			<!-- Header avec gradient -->
			<VCardTitle
				class="d-flex align-center pa-6"
				style="background: linear-gradient(135deg, #005aa7 0%, #009ddc 100%); color: white"
			>
				<VIcon :icon="isEditMode ? 'ri-pencil-fill' : 'ri-add-circle-fill'" size="32" class="me-3" />
				<div class="flex-grow-1">
					<div class="text-h5 font-weight-bold">{{ dialogTitle }}</div>
					<div class="text-caption mt-1 opacity-90">
						{{ isEditMode ? "Modifiez les informations unpaymentprovider" : "Créez unnouveau paymentprovider" }}
					</div>
				</div>
				<VBtn icon="ri-close-line" variant="text" @click="closeDialog" color="white" />
			</VCardTitle>

			<VCardText class="pa-6">
				<PaymentProviderForm
					ref="paymentProviderFormRef"
					:paymentProvider="paymentProvider"
					:loading="loading"
					@save="handleSave"
					@cancel="closeDialog"
				/>
			</VCardText>
		</VCard>
	</VDialog>
</template>

<style scoped>
.opacity-90 {
	opacity: 0.9;
}
</style>
