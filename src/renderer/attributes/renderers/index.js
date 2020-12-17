import PhysicalAddressRendererFull from './physical-address-renderer-full';
import { DefaultRenderer } from './default-renderer';
import CountryOfResidencyRendererFull from './country-of-residency-renderer-full';
export { FullAttributeRenderer } from './full-attribute-renderer';

export const fullRenderers = {
	'http://platform.selfkey.org/schema/attribute/physical-address.json': PhysicalAddressRendererFull,
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json': CountryOfResidencyRendererFull,
	default: DefaultRenderer
};
