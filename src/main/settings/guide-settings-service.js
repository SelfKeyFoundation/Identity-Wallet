import { GuideSetting } from './guide-setting';

export class GuideSettingsService {
	async getSettings() {
		const settings = await GuideSetting.findAll();
		return settings[0];
	}

	async setSettings(settings) {
		const newSettings = await GuideSetting.updateById(settings.id, settings);
		return newSettings[0];
	}
}

export default GuideSettingsService;
