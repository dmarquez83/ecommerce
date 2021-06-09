import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ = require('lodash');
import { LocationsService } from '../../modules/locations/locations.service';

@ValidatorConstraint({ name: 'LocationValidator', async: true })
@Injectable()
export class LocationValidator implements ValidatorConstraintInterface {

    private customMessage: string;

    constructor(protected readonly locationsService: LocationsService) {}

    async validate(value: any, args: ValidationArguments) {

        // Validate if there are locations repeated
        const validated = this.validateRepeatedAndGetLocations(value, args);
        const locations = validated.locations;

        // if the validation is not successful is because there ir at least 
        // one location repeated
        if (!validated.valid) {
            this.customMessage = 'There is at least one location repeated';
            return false;
        }

        // Format array to get only the id numbers
        const locationIds = locations.map((value) => value.id);

        // The id's are consulted, and there must be the same quantity, 
        // if not, the user passed an id that does not exist
        const isLocationRepeated = locationIds.length === (await this.locationsService.getByIdArray(locationIds)).length;

        if (!isLocationRepeated) {
            this.customMessage = 'There is a location id that does not exist';
        }

        return isLocationRepeated;
    }

    /**
     * Validate if there are repeated locations
     * 
     * @param value value sended for the user, can be location or variation
     * @param args all inputs sended through
     */
    validateRepeatedAndGetLocations(value: any, args: ValidationArguments) {

        let locations = [];
        let hasRepeated = false;

        if (args.object['isVariant']) {
            const propertiesVariations = value.propertiesVariations;

            hasRepeated = propertiesVariations.some((propVariation) => {
                const nonRepeatedLocations = _.uniqBy(propVariation.locations, 'id');

                // Obtain different ids
                locations = _.unionBy(locations, nonRepeatedLocations, 'id');

                return nonRepeatedLocations.length !== propVariation.locations.length;
            });

            // If there is a repeated location, return error
            if (hasRepeated) { return {valid: false, locations: []}; }

        } else {
            locations = _.uniqBy([...value], 'id');

            // If there is a repeated location, return error
            if (locations.length !== value.length) { return {valid: false, locations: []}; }
        }

        return {valid: true, locations};
    }

    defaultMessage(args: ValidationArguments) {
        return this.customMessage;
    }
}
