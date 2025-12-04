import { listFrequencies } from "./list/index.js";

export class FrequenciesService {
  private static instance: FrequenciesService;

  private constructor() {}

  static getInstance(): FrequenciesService {
    if (!FrequenciesService.instance) {
      FrequenciesService.instance = new FrequenciesService();
    }
    return FrequenciesService.instance;
  }

  async list() {
    return listFrequencies();
  }
}
