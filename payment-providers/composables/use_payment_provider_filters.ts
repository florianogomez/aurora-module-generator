import { computed, readonly, ref } from "vue";
import { PaymentProviderListFilterInterface } from "../interfaces/payment_provider_list_filter_interface";

export const usePaymentProviderFilters = () => {
	const appliedFilters = ref<Partial<PaymentProviderListFilterInterface>>({});
	const draftFilters = ref<Partial<PaymentProviderListFilterInterface>>({});
	const filtersApplied = ref(false);

	type FilterInfo = {
		key: keyof PaymentProviderListFilterInterface;
		label: string;
		icon: string;
	};

	// Configuration des métadonnées pour chaque filtre connu
	const filterInfoConfig = computed(() => {
		const config: Record<keyof PaymentProviderListFilterInterface, FilterInfo> = {
			page: {
				key: "page",
				label: "Page",
				icon: "ri-pages-fill",
			},
			search: {
				key: "search",
				label: "Recherche",
				icon: "ri-search-line",
			},
			type: {
				key: "type",
				label: "Type de fournisseur",
				icon: "ri-bank-line",
			},
			is_active: {
				key: "is_active",
				label: "Statut",
				icon: "ri-checkbox-circle-line",
			},
		};

		return config as Record<keyof PaymentProviderListFilterInterface, FilterInfo>;
	});

	const getFilterInfo = (filter: keyof PaymentProviderListFilterInterface): FilterInfo | undefined => {
		return filterInfoConfig.value[filter];
	};

	const getFilterLabel = (filter: keyof PaymentProviderListFilterInterface): string => {
		const info = getFilterInfo(filter);
		return info ? info.label : String(filter);
	};

	type ActiveFilter = {
		key: keyof PaymentProviderListFilterInterface;
		label: string;
		icon: string;
		value: unknown;
	};

	// Renvoie les filtres actuellement actifs sous une forme lisible (info + valeur)
	const activeFilters = computed<ActiveFilter[]>(() => {
		const result: ActiveFilter[] = [];

		const current = appliedFilters.value as PaymentProviderListFilterInterface;

		Object.keys(current).forEach((k) => {
			// TS: on s'assure que k est bien une clé de l'interface
			const key = k as keyof PaymentProviderListFilterInterface;
			const val = current[key];

			// Ignorer valeurs null/undefined/chaînes vides
			if (val === undefined || val === null) return;
			if (typeof val === "string" && val.trim() === "") return;

			// Exclure les filtres internes comme la page
			if (key === "page") return;

			const info = getFilterInfo(key);

			// Formatter les valeurs spéciales
			let displayValue = val;

			if (key === "is_active" && typeof val === "boolean") {
				displayValue = val ? "Actif" : "Inactif";
			}

			result.push({
				key,
				label: info ? info.label : String(key),
				icon: info ? info.icon : "",
				value: displayValue,
			});
		});

		return result;
	});

	const setFilters = (customFilters: Partial<PaymentProviderListFilterInterface>) => {
		const nextDraft: Partial<PaymentProviderListFilterInterface> = { ...draftFilters.value };

		const assignFilterValue = <K extends keyof PaymentProviderListFilterInterface>(
			key: K,
			value: PaymentProviderListFilterInterface[K] | undefined
		) => {
			if (value === undefined || value === null) {
				delete nextDraft[key];
				return;
			}

			if (typeof value === "string" && value.trim() === "") {
				delete nextDraft[key];
				return;
			}

			nextDraft[key] = value;
		};

		(Object.keys(customFilters) as (keyof PaymentProviderListFilterInterface)[]).forEach((key) => {
			assignFilterValue(key, customFilters[key]);
		});

		draftFilters.value = nextDraft;
	};

	const resetFilters = () => {
		appliedFilters.value = {};
		draftFilters.value = {};
		filtersApplied.value = false;
	};

	// Initialise les filtres draft avec les filtres appliqués (pour ouvrir le dialog)
	const initDraftFilters = () => {
		draftFilters.value = { ...appliedFilters.value };
	};

	// Méthodes spécifiques
	const setSearch = (search: string) => {
		setFilters({ search: search || undefined });
	};

	const setPage = (page: number) => {
		setFilters({ page });
	};

	const setType = (type: string) => {
		setFilters({ type: type });
	};

	const setIsActive = (isActive: boolean) => {
		setFilters({ is_active: isActive });
	};

	const removeFilter = (filterKey: keyof PaymentProviderListFilterInterface) => {
		const updatedApplied = { ...appliedFilters.value };
		delete updatedApplied[filterKey];
		appliedFilters.value = updatedApplied;

		const updatedDraft = { ...draftFilters.value };
		delete updatedDraft[filterKey];
		draftFilters.value = updatedDraft;
	};

	const hasActiveFilters = computed(() => activeFilters.value.length > 0);

	const applyFilters = () => {
		appliedFilters.value = { ...draftFilters.value };
		filtersApplied.value = true;
	};

	return {
		filters: readonly(appliedFilters),
		draftFilters: readonly(draftFilters),
		filterInfoConfig,
		activeFilters,
		getFilterInfo,
		getFilterLabel,
		setFilters,
		resetFilters,
		initDraftFilters,
		removeFilter,
		// Méthodes spécifiques
		setSearch,
		setPage,
		setType,
		setIsActive,
		// État d'application des filtres
		filtersApplied: readonly(filtersApplied),
		applyFilters,
		hasActiveFilters,
	};
};
