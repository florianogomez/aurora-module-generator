<script setup lang="ts">
import { PaymentProviderModel } from "../models/payment_provider_model";

interface Props {
	modelValue: boolean;
	paymentProvider: PaymentProviderModel | null;
}

interface Emits {
	(e: "update:modelValue", value: boolean): void;
	(e: "edit", paymentProvider: PaymentProviderModel): void;
	(e: "delete", paymentProvider: PaymentProviderModel): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDialog = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const closeDialog = () => {
	showDialog.value = false;
};
</script>

<template>
	<VDialog v-model="showDialog" max-width="700px" scrollable>
		<VCard v-if="paymentProvider">
			<!-- Header avec gradient -->
			<VCardTitle
				class="d-flex align-center pa-6"
				style="background: linear-gradient(135deg, #005aa7 0%, #009ddc 100%); color: white"
			>
				<VIcon icon="ri-file-list-3-line" size="48" class="me-4" />
				<div class="flex-grow-1">
					<div class="text-h5 font-weight-bold mb-1">Détails unpaymentprovider</div>
					<div class="text-caption opacity-90">Informations complètes</div>
				</div>
				<VBtn icon="ri-close-line" variant="text" @click="closeDialog" color="white" />
			</VCardTitle>

			<VCardText class="pa-6">
				<VContainer fluid>
					<!-- Informations générales -->
					<div class="mb-6">
						<div class="text-h6 mb-4 d-flex align-center">
							<VIcon icon="ri-information-line" class="me-2" color="primary" />
							Informations générales
						</div>
						<VRow>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Nom du fournisseur de paiement</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.name || "N/A" }}</span>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Type de fournisseur (ex. MOBILE_MONEY, CARD, BANK_TRANSFER)</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.type || "N/A" }}</span>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Statut d&#x27;activation du fournisseur</div>
									<div class="d-flex align-center">
										<VIcon
											:icon="paymentProvider.is_active ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'"
											size="20"
											class="me-2"
											:color="paymentProvider.is_active ? 'success' : 'error'"
										/>
										<VChip
											size="small"
											:color="paymentProvider.is_active ? 'success' : 'error'"
											variant="tonal"
										>
											{{ paymentProvider.is_active ? "Oui" : "Non" }}
										</VChip>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Logo du fournisseur encodé en base64</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.logo_base64 || "N/A" }}</span>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Couleur principale du fournisseur (format hexadécimal)</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.primary_color || "N/A" }}</span>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Couleur secondaire du fournisseur (format hexadécimal)</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.secondary_color || "N/A" }}</span>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item mb-4">
									<div class="text-caption text-medium-emphasis mb-1">Clé secrète pour l&#x27;authentification avec le fournisseur</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-text" size="20" class="me-2" color="primary" />
										<span class="text-body-1">{{ paymentProvider.secret_key || "N/A" }}</span>
									</div>
								</div>
							</VCol>
						</VRow>
					</div>

					<VDivider class="my-4" />

					<!-- Informations système -->
					<div class="mb-4">
						<div class="text-h6 mb-4 d-flex align-center">
							<VIcon icon="ri-settings-line" class="me-2" color="primary" />
							Informations système
						</div>
						<VRow>
							<VCol cols="12" md="6">
								<div class="info-item">
									<div class="text-caption text-medium-emphasis mb-1">ID</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-hashtag" size="20" class="me-2" color="primary" />
										<code class="text-body-2">{{ paymentProvider.id }}</code>
									</div>
								</div>
							</VCol>
							<VCol cols="12" md="6">
								<div class="info-item">
									<div class="text-caption text-medium-emphasis mb-1">Date de création</div>
									<div class="d-flex align-center">
										<VIcon icon="ri-time-line" size="20" class="me-2" color="primary" />
										<span class="text-body-2">
											{{ paymentProvider.created_at ? new Date(paymentProvider.created_at).toLocaleString() : "N/A" }}
										</span>
									</div>
								</div>
							</VCol>
						</VRow>
					</div>
				</VContainer>
			</VCardText>

			<VCardActions class="pa-4 pt-0">
				<VSpacer />
				<VBtn
					color="primary"
					variant="text"
					prepend-icon="ri-pencil-line"
					@click="emit('edit', paymentProvider)"
				>
					Modifier
				</VBtn>
				<VBtn
					color="error"
					variant="text"
					prepend-icon="ri-delete-bin-line"
					@click="emit('delete', paymentProvider)"
				>
					Supprimer
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>
</template>

<style scoped>
.opacity-90 {
	opacity: 0.9;
}

.info-item {
	padding: 8px 0;
}

code {
	background-color: rgba(0, 0, 0, 0.05);
	padding: 2px 8px;
	border-radius: 4px;
}
</style>
