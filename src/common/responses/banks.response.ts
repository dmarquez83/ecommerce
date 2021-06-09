export const banksResponses = {
    create: {
        noPermission: {
            code:	15010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	15019,
            status: false,
            message: 'The Bank could not be created, an error has occurred.' 
        },
        nameExist: {
            code:	15011,
            status: false,
            message: 'The Bank could not be created, the name already exist' 
        },
        codeExist: {
            code:	15012,
            status: false,
            message: 'The Bank could not be created, the code already exist' 
        },
        success: {
            code:	15110,
            status: true,
            message: 'The Bank has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	15021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	15029,
            status: false,
            message: 'The Bank could not be updated, an error has occurred.' 
        },
        nameExist: {
            code:	15022,
            status: false,
            message: 'The Bank could not be updated, the name already exist' 
        },
        codeExist: {
            code:	15023,
            status: false,
            message: 'The Bank could not be updated, the code already exist' 
        },
        attrMustExist: {
            code:	15024,
            status: false,
            message: 'The Bank was not found' 
        },
        success: {
            code:	15120,
            status: true,
            message: 'The Bank has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	15030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	15039,
            status: false,
            message: 'The Bank could not be listed, an error has occurred.' 
        },
        attrMustExist: {
            code:	15031,
            status: false,
            message: 'The Bank was not found' 
        },
        success: {
            code:	15130,
            status: true,
            message: 'The Bank has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	15040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	15049,
            status: false,
            message: 'The Bank could not be disabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	15041,
            status: false,
            message: 'The Bank was not found' 
        },
        success: {
            code:	15140,
            status: true,
            message: 'The Bank has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	15050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	15059,
            status: false,
            message: 'The Bank could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	15051,
            status: false,
            message: 'The Bank was not found' 
        },
        success: {
            code:	15150,
            status: true,
            message: 'The Bank has been successfully enabled.' 
        }
    }
};
