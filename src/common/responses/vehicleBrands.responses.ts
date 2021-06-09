export const vehicleBrandsResponses = {
    list: {
        noPermission: {
            code:	23030,
            status: false,
            message: 'The Vehicle Brand(s) could not be listed, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	23039,
            status: false,
            message: 'The Vehicle Brand(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	23130,
            status: true,
            message: 'The Vehicle Brand(s) has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	23040,
            status: false,
            message: 'The Vehicle Brand could not be disabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	23049,
            status: false,
            message: 'The Vehicle Brand could not be disabled, an error has occurred.' 
        },
        success: {
            code:	23140,
            status: true,
            message: 'The Vehicle Brand has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	23050,
            status: false,
            message: 'The Vehicle Brand could not be enabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	23059,
            status: false,
            message: 'The Vehicle Brand could not be enabled, an error has occurred.' 
        },
        success: {
            code:	230150,
            status: true,
            message: 'The Vehicle Brand has been successfully enabled.' 
        }
    },
    create: {
        noPermission: {
            code:	23010,
            status: false,
            message: 'The Vehicle Brand could not be created, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code: 23019,
            status: false,
            message: 'The Vehicle Brand could not be created, an error has occurred.' 
        },
        nameBeUnique: {
            code:	23011,
            status: false,
            message: 'A Vehicle Brand with that name already exist' 
        },
        success: {
            code:	23110,
            status: true,
            message: 'The Vehicle Brand has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	23020,
            status: false,
            message: 'The Vehicle Brand could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	23029,
            status: false,
            message: 'The Vehicle Brand could not be modified, an error has occurred.' 
        },
        nameBeUnique: {
            code:	23021,
            status: false,
            message: 'A Vehicle Brand with that name already exist' 
        },
        success: {
            code:	23120,
            status: true,
            message: 'The Vehicle Brand has been successfully updated.' 
        }
    }
};
