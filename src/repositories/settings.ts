import { Settings } from "../entities/Settings";
import { AppDataSource } from "../ormconfig";

export const SettingsRepository = AppDataSource.getRepository(Settings);