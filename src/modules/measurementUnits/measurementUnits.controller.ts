import { Controller, Get, Headers, Param } from '@nestjs/common';
import { MeasurementUnitsService } from './measurementUnits.service';

@Controller('measurementUnits')
export class MeasurementUnitsController {
    constructor(private readonly measurementUnitService: MeasurementUnitsService) {}

    /**
     * Find measurement units by type
     * 
     * @param type measurement unit type, which is going to be listed for
     */
    @Get('type/:type')
    findByType(@Param('type') type: string, @Headers('language') lang: string) {
        return this.measurementUnitService.findByType(type, lang);
    }
}
