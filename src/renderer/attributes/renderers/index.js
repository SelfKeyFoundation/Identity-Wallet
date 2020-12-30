import PhysicalAddressRendererFull from './physical-address-renderer-full';
import { DefaultFullRenderer } from './default-renderer-full';
import CountryOfResidencyRendererFull from './country-of-residency-renderer-full';
import EmailFullRenderer from './email-renderer-full';
export { FullAttributeRenderer } from './full-attribute-renderer';

export const fullRenderers = {
	'http://platform.selfkey.org/schema/attribute/physical-address.json': PhysicalAddressRendererFull,
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json': CountryOfResidencyRendererFull,
	'http://platform.selfkey.org/schema/attribute/email.json': EmailFullRenderer,
	default: DefaultFullRenderer
};
