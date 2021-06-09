export const productResponses = {
    creation: {
        noPermission: {
            code:	4010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        noPermissionLocation: {
            code: '',
            status: false,
            message: 'You do not have the necessary permissions in the location to perform this action.' 
        },
        alReadyExistName: {
            code:	4012,
            status: false,
            message: 'There is already a product with this name for this business.' 
        },
        attrMustExist: {
            code:	4011,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        error: {
            code:	4019,
            status: false,
            message: 'The Product could not be created, an error has occurred.' 
        },
        errorProductPropVariation: {
            code:	4019,
            status: false,
            message: 'An error has ocurred saving the product property variation.' 
        },
        errorProductVariation: {
            code:	4019,
            status: false,
            message: 'An error has ocurred saving the product variation.' 
        },
        errorProperty: {
            code:	4019,
            status: false,
            message: 'An error has ocurred saving the new property.' 
        },
        errorProductStock: {
            code:	4019,
            status: false,
            message: 'An error has ocurred saving the product variation location when is variant.' 
        },
        errorProductStockNoVariant: {
            code:	4019,
            status: false,
            message: 'An error has ocurred saving the product variation location.' 
        },
        success: {
            code:	4110,
            status: true,
            message: 'The Product has been successfully created.' 
        }
    },
    modification: {
        noPermission: {
            code:	4020,
            status: false,
            message: 'The Product could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        nameBeUnique: {
            code:	4022,
            status: false,
            message: 'The Product could not be updated, because the supplied name is currently in use.' 
        },
        notFound: {
            code:	4039,
            status: false,
            message: 'The Product was not found.' 
        },
        error: {
            code:	4029,
            status: false,
            message: 'The Product could not be updated, an error has occurred.' 
        },
        errorProductPropVariation: {
            code:	4029,
            status: false,
            message: 'An error has ocurred saving the product property variation.' 
        },
        errorProductVariation: {
            code:	4029,
            status: false,
            message: 'An error has ocurred saving the product variation.' 
        },
        errorProductStock: {
            code:	4029,
            status: false,
            message: 'An error has ocurred saving the product variation location when is variant.' 
        },
        errorUpdatedProductStock: {
            code:	4029,
            status: false,
            message: 'An error has ocurred updating the product variation location when is variant.' 
        },
        errorUpdatedProductStockNoVariant: {
            code:	4029,
            status: false,
            message: 'An error has ocurred updating the product variation location when is not variant.' 
        },
        errorProductStockNoVariant: {
            code:	4029,
            status: false,
            message: 'An error has ocurred saving the product variation location.' 
        },
        success: {
            code:	4120,
            status: true,
            message: 'The Product has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	4030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	4039,
            status: false,
            message: 'The Product(s) could not be listed, an error has occurred.' 
        },
        success: {
            code: 4130,
            status: true,
            message: 'The Products(s) has been successfully listed.' 
        },
        byId: {
            code: 4130,
            status: true,
            message: 'Detail of the successful product.' 
        },
        byCategory: {
            code: 4130,
            status: true,
            message: 'Product List by Category.' 
        },
        byBusiness: {
            code: 4130,
            status: true,
            message: 'Product List by Business.' 
        },
        bylocation: {
            code: 4130,
            status: true,
            message: 'Product List by location.' 
        }
    },
    disable : {
        noPermission: {
            code:	4040,
            status: false,
            message: 'The Product could not be disabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	4049,
            status: false,
            message: 'The Product could not be disabled, an error has occurred.' 
        },
        success: {
            code: 4140,
            status: true,
            message: 'The product has been deleted succesfully', 
        }

    },
    activate : {
        noPermission: {
            code:	2050,
            status: false,
            message: 'The Business could not be activated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	2059,
            status: false,
            message: 'The Business could not be activated, an error has occurred.' 
        },
        success: {
            code:	2150,
            status: true,
            message: 'The Business has been successfully activated.' 
        }

    }
};
