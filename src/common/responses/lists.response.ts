export const listsResponses = {
    list: {
        error: {
            code:	11039,
            status: false,
            message: 'The List(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	11130,
            status: true,
            message: 'The List(s) has been successfully listed.' 
        }
    },
    create: {
        error: {
            code:	11019,
            status: false,
            message: 'The List could not be created, an error has occurred.' 
        },
        nameBeUnique: {
            code:	11011,
            status: false,
            message: 'A List with that name already exist.' 
        },
        idMeasureUnitMustBeSent: {
            code:	11014,
            status: false,
            message: 'All idMeasurementUnit must be provided in options' 
        },
        idMeasureUnitMustExist: {
            code:	11013,
            status: false,
            message: 'Please check the idMeasurementUnits, all of them must be valid' 
        },     
        valuesBeUnique: {
            code:	11012,
            status: false,
            message: 'Each Value must be unique in options.' 
        },
        success: {
            code:	11110,
            status: true,
            message: 'The List has been successfully created.' 
        }
    },
    update: {
        error: {
            code:	11029,
            status: false,
            message: 'The List could not be modified, an error has occurred.' 
        },
        attrMustExist: {
            code:	11025,
            status: false,
            message: 'The List was not found' 
        },
        nameBeUnique: {
            code:	11021,
            status: false,
            message: 'A List with that name already exist.' 
        },
        idMeasureUnitMustBeSent: {
            code:	11024,
            status: false,
            message: 'All idMeasureUnit must be provided in options' 
        },
        idMeasureUnitMustExist: {
            code:	11023,
            status: false,
            message: 'Please check the idMeasurementUnits, all of them must be valid' 
        },      
        valuesBeUnique: {
            code:	11022,
            status: false,
            message: 'Each Value must be unique in options.' 
        },
        success: {
            code:	11120,
            status: true,
            message: 'The List has been successfully modified.' 
        },
        
    },
    enable: {
        error: {
            code:	11059,
            status: false,
            message: 'The List could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	11051,
            status: false,
            message: 'The List was not found' 
        },
        success: {
            code:	11150,
            status: true,
            message: 'The List has been successfully enabled.' 
        },
        
    },
    disable: {
        error: {
            code:	11049,
            status: false,
            message: 'The List could not be disbaled, an error has occurred.' 
        },
        attrMustExist: {
            code:	11041,
            status: false,
            message: 'The List was not found' 
        },
        success: {
            code:	11140,
            status: true,
            message: 'The List has been successfully disabled.' 
        },
        
    }
};
