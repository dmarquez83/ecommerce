export const shippingCompaniesResponses = {
    list: {
        noPermission: {
            code:	12030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	12039,
            status: false,
            message: 'The Shipping Company could not be listed, an error has occurred.' 
        },
        success: {
            code:	12130,
            status: true,
            message: 'The Shipping Company has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	12040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	12049,
            status: false,
            message: 'The Shipping Company could not be disabled, an error has occurred.' 
        },
        success: {
            code:	12140,
            status: true,
            message: 'The Shipping Company has been successfully disabled.' 
        }
    },
    create: {
        noPermission: {
            code:	12010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	12019,
            status: false,
            message: 'The Shipping Company could not be created, an error has occurred.' 
        },
        nameExist: {
            code:	12012,
            status: false,
            message: 'The Shipping Company could not be created, the name already exist.' 
        },
        success: {
            code:	12110,
            status: true,
            message: 'The Shipping Company has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	12021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	12029,
            status: false,
            message: 'The Shipping Company could not be updated, an error has occurred.' 
        },
        attrMustExist: {
            code:	12022,
            status: false,
            message: 'The Shipping Company could not be updated, please verify the data entered.' 
        },
        nameExist: {
            code:	12023,
            status: false,
            message: 'The Shipping Company could not be updated, the name already exist.' 
        },
        success: {
            code:	12120,
            status: true,
            message: 'The Shipping Company has been successfully updated.' 
        }
    },
    enable: {
        noPermission: {
            code:	12050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	12059,
            status: false,
            message: 'The Shipping Company could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	12051,
            status: false,
            message: 'The Shipping Company was not found, please verify the data entered.' 
        },
        success: {
            code:	12150,
            status: true,
            message: 'The Shipping Company has been successfully enabled.' 
        }
    }
};
