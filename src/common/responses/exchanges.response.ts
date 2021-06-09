export const exchangeResponses = {
    list: {
        noPermission: {
            code:	8030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	8039,
            status: false,
            message: 'The Exchange could not be listed, n error has ocurred' 
        },
        success: {
            code:	8130,
            status: true,
            message: 'The Exchange has been successfully listed.' 
        }
    },
    create: {
        noPermission: {
            code:	8010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	8011,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        nameBeUnique: {
            code:	8012,
            status: false,
            message: 'The exchange already exist with the same name.' 
        },
        error: {
            code:	8019,
            status: false,
            message: 'An error has ocurred creating the exchange' 
        },
        success: {
            code:	8110,
            status: true,
            message: 'Exchange created succesfully' 
        }
    },
    modification: {
        noPermission: {
            code:	8021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	8022,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        nameBeUnique: {
            code:	8023,
            status: false,
            message: 'The exchange already exist with the same name.' 
        },
        error: {
            code:	8029,
            status: false,
            message: 'An error has ocurred updating the exchange' 
        },
        success: {
            code:	8120,
            status: true,
            message: 'Exchange updated succesfully' 
        }
    },
    disable: {
        noPermission: {
            code:	8040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	8049,
            status: false,
            message: 'The exchange could not be disabled, an error has occurred.' 
        },
        success: {
            code:	8140,
            status: true,
            message: 'The exchange has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	8050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	8059,
            status: false,
            message: 'The exchange could not be disabled, an error has occurred.' 
        },
        success: {
            code:	8150,
            status: true,
            message: 'The exchange has been successfully enabled.' 
        }
    }
};
