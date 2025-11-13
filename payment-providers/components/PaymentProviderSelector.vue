<script setup lang="ts"></script>
import { ApiError } from "@/api/errors";
import { createLogger } from "@/applogger";
import { PaymentProviderModel } from "../models/payment_provider_model";
import { usePaymentProviderStore } from "../store/payment_provider_store";

const logger = createLogger("PaymentProviderSelector");

interface Props {
	modelValue?: string | null | string[];
	label?: string;
	placeholder?: string;
	errorMessages?: string[];
	rules?: Array<(value: any) => boolean | string>;
	disabled?: boolean;
	required?: boolean;
	clearable?: boolean;
	multiple?: boolean;
	chips?: boolean;
	closableChips?: boolean;
	density?: "default" | "comfortable" | "compact";
	variant?:
		| "outlined"
		| "filled"
		| "underlined"
		| "plain"
		| "solo"
		| "solo-inverted"
		| "solo-filled";
}

const props = withDefaults(defineProps<Props>(), {
	label: "PaymentProvider",
	placeholder: "Rechercher unpaymentprovider...",
	errorMessages: () => [],
	rules: () => [],
	disabled: false,
	required: false,
	clearable: true,
	multiple: false,
	chips: true,
	closableChips: true,
	density: "compact",
	variant: "outlined",
});

const emit = defineEmits<{
	"update:modelValue": [value: string | null | string[]];
	"update:selected": [selection: PaymentProviderModel | PaymentProviderModel[] | null];
}>();

// Stores
const paymentProviderStore = usePaymentProviderStore();

// Refs
const searchValue = ref("");
const internalValue = ref<string | null | string[]>(
	props.multiple
		? Array.isArray(props.modelValue)
			? props.modelValue
			: []
		: props.modelValue || null
);
const isLoading = ref(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);
const searchResults = ref<PaymentProviderModel[]>([]);

// Computed
const paymentProviders = computed(() => searchResults.value);

// Computed pour la valeur à passer au VAutocomplete
const autocompleteValue = computed(() => {
	if (props.multiple) {
		if (!Array.isArray(internalValue.value)) return [];
		return internalValue.value
			.map((id) => {
				const paymentProviderItem = paymentProviders.value.find((item) => item.id === id);
				return paymentProviderItem || null;
			})
			.filter((item) => item !== null);
	} else {
		if (!internalValue.value || Array.isArray(internalValue.value)) return null;
		return paymentProviders.value.find((item) => item.id === internalValue.value) || null;
	}
});

const displayValue = computed(() => {
	if (props.multiple) {
		const selected = autocompleteValue.value as any[];
		if (!Array.isArray(selected)) return "";
		return selected.map((item) => item?.name || "").join(", ");
	} else {
		const selected = autocompleteValue.value as any;
		return selected?.name || "";
	}
});

// Methods
const searchPaymentProviders = async (query: string) => {
	if (isLoading.value) return;

	try {
		isLoading.value = true;
		const result = await paymentProviderStore.getPaymentProviders({
			search: query,
			page: 1,
			// TODO: Ajouter d'autres paramètres de filtre si nécessaire
		});

		if (result instanceof ApiError) {
			logger.error("Erreur lors de la recherche unpaymentproviders:", result);
			searchResults.value = [];
		} else {
			searchResults.value = result;
		}
	} catch (error) {
		logger.error("Erreur lors de la recherche unpaymentproviders:", error);
		searchResults.value = [];
	} finally {
		isLoading.value = false;
	}
};

const handleSearchInput = (value: string) => {
	searchValue.value = value;

	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}

	if (!value.trim()) {
		return;
	}

	searchTimeout.value = setTimeout(() => {
		searchPaymentProviders(value.trim());
	}, 300);
};

const handleSelectionChange = (value: PaymentProviderModel | null | PaymentProviderModel[] | any) => {
	logger.debug("Selection changed:", value);
	emit("update:selected", value);
	let processedValue: string | null | string[];

	if (props.multiple) {
		if (Array.isArray(value)) {
			processedValue = value.map((item) => {
				if (typeof item === "object" && item && "id" in item) {
					return item.id;
				}
				return item;
			});
		} else if (value && typeof value === "object" && "id" in value) {
			processedValue = [value.id];
		} else {
			processedValue = [];
		}
	} else {
		if (value && typeof value === "object" && "id" in value) {
			processedValue = value.id;
		} else {
			processedValue = value;
		}
	}

	internalValue.value = processedValue;
	emit("update:modelValue", processedValue);
};

const clearSelection = () => {
	if (props.multiple) {
		handleSelectionChange([]);
	} else {
		handleSelectionChange(null);
	}
};

// Watchers
watch(
	() => props.modelValue,
	(newValue) => {
		logger.debug("Props modelValue changed:", newValue);
		if (props.multiple) {
			internalValue.value = Array.isArray(newValue) ? newValue : [];
		} else {
			internalValue.value = Array.isArray(newValue) ? null : newValue || null;
		}
		logger.debug("Internal value updated to:", internalValue.value);
	},
	{ immediate: true }
);

// Cleanup
onUnmounted(() => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
});
</script>

<template>
	<VAutocomplete
		:model-value="autocompleteValue"
		:label="label"
		:placeholder="placeholder"
		:error-messages="errorMessages"
		:rules="rules"
		:disabled="disabled"
		:required="required"
		:clearable="clearable"
		:density="density"
		:variant="variant"
		:loading="isLoading"
		:search="searchValue"
		:multiple="multiple"
		:chips="multiple && chips"
		:closable-chips="multiple && closableChips"
		:items="paymentProviders"
		item-value="id"
		item-title="name"
		return-object
		hide-selected
		@update:model-value="handleSelectionChange"
		@update:search="handleSearchInput"
		@click:clear="clearSelection"
	>
	<!-- Template pour les chips en mode multiple -->
	<template v-if="multiple" #chip="{ item, props: chipProps }">
		<VChip v-bind="chipProps" color="success">
			<VIcon start icon="ri-bank-line" class="ml-1" />
			{{ item.raw.name }}
		</VChip>
	</template>

	<template #item="{ item, props: itemProps }">
		<VListItem v-bind="itemProps">
			<template #prepend>
				<VAvatar size="small" color="success">
					<VIcon icon="ri-bank-line" />
				</VAvatar>
			</template>

			<VListItemSubtitle v-if="item.raw.type">
				<span class="text-caption">
					{{ item.raw.type.substring(0, 50) }}{{ item.raw.type.length > 50 ? "..." : "" }}
				</span>
			</VListItemSubtitle>
		</VListItem>
	</template>

	<template #selection="{ item }">
		<div v-if="!multiple" class="d-flex align-center">
			<VAvatar size="small" color="success" class="mr-2">
				<VIcon icon="ri-bank-line" />
			</VAvatar>

			<div>
				<div class="text-body-2">{{ item.raw.name }}</div>
				<div v-if="item.raw.type" class="text-caption text-medium-emphasis">
					{{ item.raw.type.substring(0, 30) }}{{ item.raw.type.length > 30 ? "..." : "" }}
				</div>
			</div>
		</div>
	</template>		<template #no-data>
			<VListItem>
				<VListItemTitle>
					{{ searchValue ? "Aucun paymentprovider trouvé" : "Saisissez du texte pour rechercher" }}
				</VListItemTitle>
			</VListItem>
		</template>

		<template #append-item>
			<VDivider v-if="paymentProviders.length > 0" />
			<VListItem v-if="isLoading" disabled>
				<VListItemTitle>Recherche en cours...</VListItemTitle>
			</VListItem>
		</template>
	</VAutocomplete>
</template>
