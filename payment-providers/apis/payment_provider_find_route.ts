import ApiHttpMethod from "@/api/enums/api_http_method_enum"; import ApiError from
"@/api/errors/ApiError"; import {
PaymentProviderInterface } from "../interfaces/payment-provider_interface"; import {
PaymentProviderModel } from "../models/payment-provider_model"; import {
PaymentProviderRoute } from "./_payment-provider_route"; import {
PaymentProviderStore } from "../store"; import { NotFoundApiError } from "@/api/errors"; /**
* Route de recherche
PaymentProvider
*/ export class
PaymentProviderFindRoute extends
PaymentProviderRoute { constructor(private elementId:
PaymentProviderInterface["id"]) { super(`/PaymentProviderRoute.name}/${elementId}`,
ApiHttpMethod.GET, { id: elementId }); } async request() { if (this.isMock) { return this.mock(); }
const response = await super.request(); if (response instanceof ApiError) return response; return
new
PaymentProviderModel(response as
PaymentProviderInterface); } async mock() { const store:
PaymentProviderStore = await this.store; const found = store.find(this.elementId); if
(!found) { return new NotFoundApiError({ message: `PaymentProvider
avec l'ID ${this.elementId} non trouvé`, }); } return new
PaymentProviderModel(found); } }