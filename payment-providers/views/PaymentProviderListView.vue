<script setup lang="ts">
	import { useSelectableList } from "@/composables/useSelectableList"; import {
	PaymentProviderModel } from "../models/payment_provider_model"; import { usePaymentProviderActions } from "../composables/use_payment_provider_actions"; import { useBootstrapToast }
	from "@/composables/useBootstrapToast"; import SanlamAllianzTable from
	"@/components/SanlamAllianzTable.vue"; import { useSanlamAllianzTable } from
	"@/composables/useSanlamAllianzTable"; import { usePaymentProviderFilters } from
	"../composables/use_payment_provider_filters"; import { ApiError } from "@/api/errors";
	const emit = defineEmits<{ "row-click": [item:
	PaymentProviderModel]; }>(); const { processing: loading,
	paymentProviders, getPaymentProviders, createPaymentProvider, updatePaymentProvider, deletePaymentProvider, } = usePaymentProviderActions(); // Utilisation du composable de filtres centralisés const { filters, activeFilters,
	hasActiveFilters, filtersApplied, setSearch, resetFilters, applyFilters, removeFilter, } = usePaymentProviderFilters(); const { selected, selectedCount, allSelected, someSelected, isSelected, toggleSelect,
	toggleSelectAll, clearSelection, } = useSelectableList<PaymentProviderModel>(() =>
	paymentProviders.value); const { show: notify } = useBootstrapToast(); //
	Configuration de la table SanlamAllianz const { tableClasses, getStatusBadge, getStatusText,
	commonHeaders } = useSanlamAllianzTable(); const tableHeaders = commonHeaders.paymentProvider(); // État du dialog de filtres const showFilterDialog = ref(false); // État du dialog de
	détails const showDetailDialog = ref(false); const selectedPaymentProvider
	= ref<PaymentProviderModel | null>(null); // État du dialog de formulaire
	(création/édition) const showFormDialog = ref(false); const
	paymentProviderToEdit = ref<PaymentProviderModel | null>(null); const formLoading =
	ref(false); // État du dialog de confirmation réutilisable const showConfirmDialog = ref(false);
	const confirmDialogTitle = ref(""); const confirmDialogMessage = ref(""); const
	confirmDialogAction = ref<() => any>(async () => {}); const openConfirmDialog = (title: string,
	message: string, action: () => any) => { confirmDialogTitle.value = title;
	confirmDialogMessage.value = message; confirmDialogAction.value = action; showConfirmDialog.value
	= true; }; const executeConfirmAction = async () => { await confirmDialogAction.value();
	showConfirmDialog.value = false; }; const openFilterDialog = () => { showFilterDialog.value =
	true; }; const onRowClick = (item:
	PaymentProviderModel) => { selectedPaymentProvider.value = item;
	showDetailDialog.value = true; emit("row-click", item); }; const onEditPaymentProvider
	= (item:
	PaymentProviderModel) => {
	paymentProviderToEdit.value = item; showFormDialog.value = true; }; const onAddPaymentProvider
	= () => {
	paymentProviderToEdit.value = null; showFormDialog.value = true; }; const handleSavePaymentProvider
	= async (data: any) => { formLoading.value = true; try { if (paymentProviderToEdit.value) {
	// Mode édition const result = await updatePaymentProvider(paymentProviderToEdit.value.id, data); if (!(result instanceof ApiError)) { showFormDialog.value = false; await
	getPaymentProviders(filters.value); } } else { // Mode création const result =
	await createPaymentProvider(data); if (!(result instanceof ApiError)) {
	showFormDialog.value = false; await getPaymentProviders(filters.value); } } }
	finally { formLoading.value = false; } }; const deleteSelected = async () => { if
	(selected.value.length === 0) return; if (selected.value.length > 20) { notify.error("Vous ne
	pouvez pas supprimer plus de 20 éléments à la fois."); return; } openConfirmDialog( "Supprimer les
	éléments sélectionnés", `Êtes-vous sûr de vouloir supprimer ${selectedCount.value} élément(s)
	sélectionné(s) ?`, async () => { for (const element of selected.value) { await deletePaymentProvider(element.interface); } clearSelection(); // Recharger les données après suppression await getPaymentProviders(filters.value); } ); }; const onDeletePaymentProvider
	= async (item:
	PaymentProviderModel) => { openConfirmDialog( "Supprimer
	le
	paymentprovider", `Êtes-vous sûr de vouloir supprimer cet élément ?`, () => deletePaymentProvider(item.interface) ); }; const refreshPaymentProviders
	= async () => { await getPaymentProviders(filters.value); }; onMounted(async ()
	=> { await getPaymentProviders(filters.value); });
</script>

<template>
	<BaseBlock
		class="block-mode-loading-oneui"
		:class="{
			'block-mode-loading': loading,
		}"
	>
		<template #title>
			<div class="flex items-center gap-2">
				<VBtn
					prepend-icon="ri-refresh-line"
					:loading="loading"
					:disabled="loading"
					type="button"
					@click="refreshPaymentProviders"
					class="btn-block-option"
					size="small"
					variant="tonal"
				>
					Actualiser
				</VBtn>
			</div>
		</template>

		<template #options>
			<VBtn
				prepend-icon="ri-add-line"
				@click="onAddPaymentProvider"
				variant="elevated"
				color="primary"
				size="small"
			>
				Ajouter
			</VBtn>
		</template>

		<template #content>
			<!-- Barre de recherche et filtres -->
			<div class="mb-4">
				<div class="flex gap-2 items-center">
					<VTextField
						v-model="search"
						@update:model-value="setSearch"
						density="compact"
						prepend-inner-icon="ri-search-line"
						placeholder="Rechercher..."
						clearable
						hide-details
						class="flex-1"
					/>
					<VBtn
						prepend-icon="ri-filter-line"
						@click="openFilterDialog"
						variant="tonal"
						size="small"
					>
						Filtres
						<VBadge
							v-if="hasActiveFilters"
							:content="activeFilters.length"
							color="primary"
							inline
						/>
					</VBtn>
				</div>

				<!-- Filtres actifs -->
				<div v-if="hasActiveFilters" class="mt-3 flex gap-2 flex-wrap">
					<VChip
						v-for="filter in activeFilters"
						:key="filter.key"
						closable
						@click:close="removeFilter(filter.key)"
						size="small"
					>
						<VIcon :icon="filter.icon" start />
						:
						
					</VChip>
					<VBtn variant="text" size="small" @click="resetFilters" prepend-icon="ri-close-line">
						Tout effacer
					</VBtn>
				</div>
			</div>

			<!-- Actions groupées -->
			<div v-if="selectedCount > 0" class="mb-3 flex gap-2 items-center">
				<span class="text-sm text-gray-600">
					
					élément(s) sélectionné(s)
				</span>
				<VBtn
					prepend-icon="ri-delete-bin-line"
					@click="deleteSelected"
					variant="tonal"
					color="error"
					size="small"
				>
					Supprimer
				</VBtn>
				<VBtn prepend-icon="ri-close-line" @click="clearSelection" variant="text" size="small">
					Désélectionner
				</VBtn>
			</div>

			<!-- Table -->
			<SanlamAllianzTable
				:headers="tableHeaders"
				:items="paymentProviders"
				:loading="loading"
				:selected="selected"
				:all-selected="allSelected"
				:some-selected="someSelected"
				@row-click="onRowClick"
				@toggle-select="toggleSelect"
				@toggle-select-all="toggleSelectAll"
			>
				<!-- Slot personnalisé pour les actions -->
				<template #item-actions="{ item }">
					<div class="flex gap-1">
						<VTooltip text="Éditer">
							<template #activator="{ props }">
								<VBtn
									v-bind="props"
									@click.stop="onEditPaymentProvider(item)"
									icon="ri-edit-line"
									size="x-small"
									variant="text"
								/>
							</template>
						</VTooltip>
						<VTooltip text="Supprimer">
							<template #activator="{ props }">
								<VBtn
									v-bind="props"
									@click.stop="onDeletePaymentProvider(item)"
									icon="ri-delete-bin-line"
									size="x-small"
									variant="text"
									color="error"
								/>
							</template>
						</VTooltip>
					</div>
				</template>
			</SanlamAllianzTable>
		</template>
	</BaseBlock>

	<!-- Dialog de confirmation -->
	<VDialog v-model="showConfirmDialog" max-width="500">
		<VCard>
			<VCardTitle></VCardTitle>
			<VCardText v-html="confirmDialogMessage" />
			<VCardActions>
				<VSpacer />
				<VBtn @click="showConfirmDialog = false" variant="text">
					Annuler
				</VBtn>
				<VBtn @click="executeConfirmAction" color="primary" variant="elevated">
					Confirmer
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>

	<!-- TODO: Dialogs de filtres, détails et formulaire -->
	<!-- Ces dialogs nécessitent des composants personnalisés par ressource -->
</template>

<style scoped>
	/* Styles spécifiques si nécessaire */
</style>