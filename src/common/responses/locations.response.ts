export const locationResponses = {
    creation: {
        noPermission: {
            code:	3010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	3011,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        municipalityBeUnique: {
            code:	3012,
            status: false,
            message: 'The company already has a location in the same municipality.' 
        },
        error: {
            code:	3019,
            status: false,
            message: 'The Location could not be created, an error has occurred.' 
        },
        success: {
            code:	3110,
            status: true,
            message: 'The Location has been successfully created.' 
        }
    },
    modification: {
        noPermission: {
            code:	3020,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	3021,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        municipalityBeUnique: {
            code:	3022,
            status: false,
            message: 'The company already has a location in the same municipality.' 
        },
        locationDisable: {
            code:	3024,
            status: false,
            message: 'You cannot create the location, because the associated Business is not active.' 
        },
        error: {
            code:	3029,
            status: false,
            message: 'The Location could not be updated, an error has occurred.' 
        },
        success: {
            code:	3120,
            status: true,
            message: 'The Location has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	3030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	3039,
            status: false,
            message: 'The Location could not be listed, an error has occurred.' 
        },
        success: {
            code:	3130,
            status: true,
            message: 'The location has been successfully listed.' 
        }
    },
    disable : {
        noPermission: {
            code:	3040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        producStockError: {
            code:	3041,
            status: false,
            message: 'The stock associated to the location could not be disabled, an error has ocurred' 
        },
        error: {
            code:	3049,
            status: false,
            message: 'The Location could not be disabled, an error has occurred.' 
        },
        success: {
            code:	3140,
            status: true,
            message: 'The location has been successfully disabled.' 
        }
    },
    delete : {
        noPermission: {
            code:	3060,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        producStockError: {
            code:	3061,
            status: false,
            message: 'The stock associated to the location could not be deleted, an error has ocurred' 
        },
        error: {
            code:	3069,
            status: false,
            message: 'The Location could not be deleted, an error has occurred.' 
        },
        success: {
            code:	3160,
            status: true,
            message: 'The location has been successfully deleted.' 
        }
    },
    activate : {
        noPermission: {
            code:	3050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	3059,
            status: false,
            message: 'The Loation could not be activated, an error has occurred.' 
        },
        success: {
            code:	3150,
            status: true,
            message: 'The Location has been successfully activated.' 
        }
    }
};
