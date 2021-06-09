export const currenciesResponses = {
    list: {
        noPermission: {
            code:	18030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	18039,
            status: false,
            message: 'The Currency could not be listed, an error has occurred.' 
        },
        attrMustExist: {
            code:	18031,
            status: false,
            message: 'The Currency was not found' 
        },
        success: {
            code:	18130,
            status: true,
            message: 'The Currency has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	18040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	18049,
            status: false,
            message: 'The Currency could not be disabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	18041,
            status: false,
            message: 'The Currency was not found' 
        },
        success: {
            code:	18140,
            status: true,
            message: 'The Currency has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	18050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	18059,
            status: false,
            message: 'The Currency could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	18051,
            status: false,
            message: 'The Currency was not found' 
        },
        success: {
            code:	18150,
            status: true,
            message: 'The Currency has been successfully enabled.' 
        }
    },
    create: {
        noPermission: {
            code:	18010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:   18019,
            status: false,
            message: 'The Currency could not be created, an error has occurred.' 
        },
        nameBeUnique: {
            code:	18011,
            status: false,
            message: 'A Currency with that name already exist' 
        },
        codeBeUnique: {
            code:	18012,
            status: false,
            message: 'A Currency with that code already exist' 
        },
        success: {
            code:	18110,
            status: true,
            message: 'The Currency has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	18020,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	18029,
            status: false,
            message: 'The Currency could not be modified, an error has occurred.' 
        },
        nameBeUnique: {
            code:	18021,
            status: false,
            message: 'A Currency with that name already exist' 
        },
        codeBeUnique: {
            code:	18022,
            status: false,
            message: 'A Currency with that code already exist' 
        },
        attrMustExist: {
            code:	18023,
            status: false,
            message: 'The Currency was not found' 
        },
        success: {
            code:	18120,
            status: true,
            message: 'The Currency has been successfully updated.' 
        }
    }
};
