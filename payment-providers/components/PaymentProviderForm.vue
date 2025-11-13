<script setup lang="ts">
import { PaymentProviderModel } from "../models/payment_provider_model";
import { PaymentProviderCreateInterface } from "../interfaces/payment_provider_create_interface";
import { PaymentProviderUpdateInterface } from "../interfaces/payment_provider_update_interface";

interface Props {
	paymentProvider?: PaymentProviderModel | null;
	loading?: boolean;
}

interface Emits {
	(e: "save", data: PaymentProviderCreateInterface | PaymentProviderUpdateInterface): void;
	(e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
	paymentProvider: null,
	loading: false,
});

const emit = defineEmits<Emits>();

const isEditMode = computed(() => !!props.paymentProvider);

// Form data
const formData = ref<Partial<PaymentProviderCreateInterface>>({
	name: undefined,
	type: undefined,
	is_active: true,
	logo_base64: undefined,
	primary_color: &quot;#1976D2&quot;,
	secondary_color: &quot;#424242&quot;,
	secret_key: undefined,
});

// Validation rules
const rules = {
	name: [(v: any) => !!v || "Nom du fournisseur de paiement est requis"],
	type: [(v: any) => !!v || "Type de fournisseur (ex. MOBILE_MONEY, CARD, BANK_TRANSFER) est requis"],
	is_active: [(v: any) => !!v || "Statut d&#x27;activation du fournisseur est requis"],
	secret_key: [(v: any) => !!v || "Clé secrète pour l&#x27;authentification avec le fournisseur est requis"],
};

// Form ref
const formRef = ref<any>(null);

// Methods
const resetForm = () => {
	formData.value = {
		name: undefined,
		type: undefined,
		is_active: true,
		logo_base64: undefined,
		primary_color: &quot;#1976D2&quot;,
		secondary_color: &quot;#424242&quot;,
		secret_key: undefined,
	};
	formRef.value?.resetValidation();
};

const handleCancel = () => {
	resetForm();
	emit("cancel");
};

const handleSave = async () => {
	const { valid } = await formRef.value.validate();

	if (!valid) {
		return;
	}

	if (isEditMode.value) {
		// Mode édition
		const updateData: PaymentProviderUpdateInterface = {
			...formData.value,
		} as PaymentProviderUpdateInterface;
		emit("save", updateData);
	} else {
		// Mode création
		const createData: PaymentProviderCreateInterface = {
			...formData.value,
		} as PaymentProviderCreateInterface;
		emit("save", createData);
	}
};

// Watchers
watch(
	() => props.paymentProvider,
	(newPaymentProvider) => {
		if (newPaymentProvider) {
			// Mode édition - charger les données
			formData.value = {
				name: newPaymentProvider.name,
				type: newPaymentProvider.type,
				is_active: newPaymentProvider.is_active,
				logo_base64: newPaymentProvider.logo_base64,
				primary_color: newPaymentProvider.primary_color,
				secondary_color: newPaymentProvider.secondary_color,
				secret_key: newPaymentProvider.secret_key,
			};
		} else {
			// Mode création - réinitialiser
			resetForm();
		}
	},
	{ immediate: true }
);

// Expose resetForm pour l'utilisation externe
defineExpose({
	resetForm,
});
</script>

<template>
	<VForm ref="formRef" @submit.prevent="handleSave">
		<VContainer>
			<!-- 
				TODO: Ajouter les champs spécifiques du formulaire ici
				
				Exemple pour chaque champ défini dans le YAML:
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.name"
							label="Nom du fournisseur de paiement"
							:rules="rules.name"
							density="compact"
							:disabled="loading"
							
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.type"
							label="Type de fournisseur (ex. MOBILE_MONEY, CARD, BANK_TRANSFER)"
							:rules="rules.type"
							density="compact"
							:disabled="loading"
							
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VCheckbox
							v-model="formData.is_active"
							label="Statut d&#x27;activation du fournisseur"
							density="compact"
							:disabled="loading"
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.logo_base64"
							label="Logo du fournisseur encodé en base64"
							
							density="compact"
							:disabled="loading"
							clearable
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.primary_color"
							label="Couleur principale du fournisseur (format hexadécimal)"
							
							density="compact"
							:disabled="loading"
							clearable
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.secondary_color"
							label="Couleur secondaire du fournisseur (format hexadécimal)"
							
							density="compact"
							:disabled="loading"
							clearable
						/>
					</VCol>
				</VRow>
				
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="formData.secret_key"
							label="Clé secrète pour l&#x27;authentification avec le fournisseur"
							:rules="rules.secret_key"
							density="compact"
							:disabled="loading"
							
						/>
					</VCol>
				</VRow>
			-->

			<!-- Actions -->
			<VRow class="mt-4">
				<VCol cols="12" class="d-flex justify-end gap-2">
					<VBtn
						color="grey"
						variant="text"
						@click="handleCancel"
						:disabled="loading"
					>
						Annuler
					</VBtn>
					<VBtn
						color="primary"
						variant="flat"
						type="submit"
						:loading="loading"
					>
						{{ isEditMode ? "Modifier" : "Créer" }}
					</VBtn>
				</VCol>
			</VRow>
		</VContainer>
	</VForm>
</template>
