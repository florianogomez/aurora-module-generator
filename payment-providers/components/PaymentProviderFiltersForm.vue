<script setup lang="ts">
import { PaymentProviderListFilterInterface } from "../interfaces/payment_provider_list_filter_interface";

interface Props {
	modelValue: boolean;
	filters: PaymentProviderListFilterInterface;
	loading?: boolean;
}

interface Emits {
	(e: "update:modelValue", value: boolean): void;
	(e: "update:search", value: string): void;
	(e: "update:type", value: any): void;
	(e: "update:isActive", value: any): void;
	(e: "apply"): void;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits<Emits>();

const showDialog = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const closeDialog = () => {
	showDialog.value = false;
};

const handleApplyFilters = () => {
	emit("apply");
	showDialog.value = false;
};
</script>

<template>
	<VDialog v-model="showDialog" max-width="600px">
		<VCard>
			<VCardTitle class="d-flex align-center">
				<VIcon icon="ri-filter-line" class="me-2" />
				Filtrer les paymentproviders
			</VCardTitle>
			<VCardText>
				<VContainer>
					<VRow>
						<VCol cols="12">
							<VTextField
								:model-value="props.filters.search"
								label="Rechercher"
								placeholder="Rechercher..."
								density="compact"
								clearable
								prepend-inner-icon="ri-search-line"
								@update:model-value="emit('update:search', $event)"
							/>
						</VCol>
					</VRow>
					<VRow>
						<VCol cols="12">
							<!-- TODO: Remplacer par un sélecteur approprié si nécessaire (ex: TypeSelector) -->
							<VTextField
								:model-value="props.filters.type"
								label="Type de fournisseur"
								placeholder="Filtrer par type de fournisseur"
								density="compact"
								clearable
								prepend-inner-icon="ri-bank-line"
								@update:model-value="emit('update:type', $event)"
							/>
						</VCol>
					</VRow>
					<VRow>
						<VCol cols="12">
							<VSelect
								:model-value="props.filters.is_active"
								label="Statut"
								placeholder="Tous"
								density="compact"
								clearable
								prepend-inner-icon="ri-checkbox-circle-line"
								:items="[
									{ title: 'Actif', value: true },
									{ title: 'Inactif', value: false }
								]"
								@update:model-value="emit('update:isActive', $event)"
							/>
						</VCol>
					</VRow>
				</VContainer>
			</VCardText>
			<VCardActions>
				<VSpacer />
				<VBtn color="grey" variant="text" @click="closeDialog">
					Annuler
				</VBtn>
				<VBtn color="primary" variant="flat" @click="handleApplyFilters" :loading="loading">
					Appliquer
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>
</template>
