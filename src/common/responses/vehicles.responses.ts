export const vehiclesResponses = {
    list: {
        noPermission: {
            code:	24030,
            status: false,
            message: 'The Vehicle could not be listed, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	24039,
            status: false,
            message: 'The Vehicle(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	24130,
            status: true,
            message: 'The Vehicle(s) has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	24040,
            status: false,
            message: 'The Vehicle could not be disabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	24049,
            status: false,
            message: 'The Vehicle could not be disabled, an error has occurred.' 
        },
        success: {
            code:	24140,
            status: true,
            message: 'The Vehicle has been successfully disabled.' 
        }
    },
    delete: {
        noPermission: {
            code:	24060,
            status: false,
            message: 'The Vehicle could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	24069,
            status: false,
            message: 'The Vehicle could not be deleted, an error has occurred.' 
        },
        success: {
            code:	24160,
            status: true,
            message: 'The Vehicle has been successfully deleted.' 
        }
    },
    enable: {
        noPermission: {
            code:	24050,
            status: false,
            message: 'The Vehicle could not be enabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	24059,
            status: false,
            message: 'The Vehicle could not be enabled, an error has occurred.' 
        },
        success: {
            code:	24150,
            status: true,
            message: 'The Vehicle has been successfully enabled.' 
        }
    },
    create: {
        noPermission: {
            code:	24010,
            status: false,
            message: 'The Vehicle could not be created, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code: 24019,
            status: false,
            message: 'The Vehicle could not be created, an error has occurred.' 
        },
        plateBeUnique: {
            code:	24011,
            status: false,
            message: 'A Vehicle with that plate already exist' 
        },
        success: {
            code:	24110,
            status: true,
            message: 'The Vehicle has been successfully created.' 
        },
        cantSaveImages: {
            code: 24012,
            status: false,
            message: 'Could not save vehicle images.' 
        },
    },
    update: {
        noPermission: {
            code:	24020,
            status: false,
            message: 'The Vehicle could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	24029,
            status: false,
            message: 'The Vehicle could not be modified, an error has occurred.' 
        },
        plateBeUnique: {
            code:	24021,
            status: false,
            message: 'A Vehicle with that plate already exist' 
        },
        success: {
            code:	24120,
            status: true,
            message: 'The Vehicle has been successfully updated.' 
        },
        cantSaveImages: {
            code: 24022,
            status: false,
            message: 'Could not save vehicle images.' 
        },
        cantDeleteImages: {
            code: 24023,
            status: false,
            message: 'Could not delete vehicle images.' 
        },
    }
};
