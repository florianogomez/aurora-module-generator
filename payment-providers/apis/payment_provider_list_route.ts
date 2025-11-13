import ApiHttpMethod from "@/api/enums/api_http_method_enum"; import ApiError from
"@/api/errors/ApiError"; import {
PaymentProviderInterface } from "../interfaces/payment-provider_interface"; import {
PaymentProviderModel } from "../models/payment-provider_model"; import {
PaymentProviderRoute } from "./_payment-provider_route"; import {
PaymentProviderStore } from "../store"; import {
PaymentProviderListFilterInterface } from "../interfaces/payment-provider_list_filter_interface";
/** * Route de liste
PaymentProvider
*/ export class
PaymentProviderListRoute extends
PaymentProviderRoute { constructor(private filters:
PaymentProviderListFilterInterface = {}) { super(`/PaymentProviderRoute.name}`,
ApiHttpMethod.GET, filters); } async request() { if (this.isMock) { return this.mock(); } const
response = await super.request(); if (response instanceof ApiError) return response; return
(response as
PaymentProviderInterface[]).map((data) => new
PaymentProviderModel(data)); } async mock() { const store:
PaymentProviderStore = await this.store; const results = store.elements.map((e) => new
PaymentProviderModel(e)); return results; } }