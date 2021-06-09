import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { MeasurementUnit } from '../../models';
import { TranslationsService } from '../translations/translations.service';

@Injectable()
export class MeasurementUnitsService extends BasicService<MeasurementUnit> {

    constructor(
        @InjectRepository(MeasurementUnit)
        private readonly measurementUnitRepository: Repository<MeasurementUnit>,
        private readonly translationService: TranslationsService
        ) {
            super(measurementUnitRepository);
    }

    /**
     * Find measurement units by type
     * 
     * @param type measurement unit type, wich is going to be listed for
     */
    async findByType(type: string, lang: string) {
        const measurements = await this.measurementUnitRepository.find({where: [{type}]});
        return await this.translateEntityArray(measurements, lang);
    }

    /**
     * Translate specific measurement unit
     * 
     * @param MeasurementUnit specific measurement to be translated
     * @param translations translation array, to search
     */
    translateEntity(measurementUnit: MeasurementUnit, translations: any[]): MeasurementUnit {

        const texTranslated = translations.find((text) => {
            return text.enText.toLowerCase() === measurementUnit.name.toLowerCase();
        });

        if (texTranslated) {
            measurementUnit['name'] = texTranslated.langText;
        }

        return measurementUnit;
    }

    /**
     * Translate Measurement Units
     * 
     * @param measurementUnits measurements to be translated
     * @param lang language to get translation
     */
    async translateEntityArray(measurementUnits: MeasurementUnit[], lang: string): Promise<MeasurementUnit[]> {
        if (!lang || lang === 'en') {
            return measurementUnits;
        }

        const sentences = measurementUnits.map((element) => element.name);
        const translated = await this.translationService.getTranslations(sentences, lang);

        const translatedMeasurementUnit = measurementUnits.map(element => {
            return this.translateEntity(element, translated);
        });

        return translatedMeasurementUnit;
    }
}
