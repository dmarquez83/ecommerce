export const productResponses = {
    creation: {
        noPermission: {
            code:   4010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        nameBeUnique: {
            code:   4011,
            status: false,
            message: 'There is already a product with this name for this business.' 
        },
        errorProductPropCombo: {
            code:   4012,
            status: false,
            message: 'An error has ocurred saving the product property combo.' 
        },
        errorProductVariation: {
            code:   4013,
            status: false,
            message: 'An error has ocurred saving the product variation.' 
        },
        errorProperty: {
            code:   4014,
            status: false,
            message: 'An error has ocurred saving the new property.' 
        },
        errorProductStock: {
            code:   4015,
            status: false,
            message: 'An error has ocurred saving the stock of a variation' 
        },
        errorProductStockNoVariant: {
            code:   4016,
            status: false,
            message: 'An error has ocurred saving the stock of a product' 
        },
        error: {
            code:   4019,
            status: false,
            message: 'The Product could not be created, an error has occurred.' 
        },
        noPermissionLocation: {
            code: 3030,
            status: false,
            message: 'You do not have the necessary permissions in the location to perform this action.' 
        },
        success: {
            code:   4110,
            status: true,
            message: 'The Product has been successfully created.' 
        },
        cantSaveImages: {
            code: 4017,
            status: false,
            message: 'Could not save product images.' 
        },
        cantSaveImageProductVariation: {
            code: 4018,
            status: false,
            message: 'Could not save product image in the variation.' 
        },
    },
    modification: {
        noPermission: {
            code:   4020,
            status: false,
            message: 'The Product could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        nameBeUnique: {
            code:   4021,
            status: false,
            message: 'The Product could not be updated, because the supplied name is currently in use.' 
        },
        errorProductPropCombo: {
            code:   4022,
            status: false,
            message: 'An error has ocurred saving the product property combo.' 
        },
        errorProductVariation: {
            code:   4023,
            status: false,
            message: 'An error has ocurred saving the product variation.' 
        },
        errorProperty: {
            code:   4024,
            status: false,
            message: 'An error has ocurred saving the new property.' 
        },
        errorProductStock: {
            code:   4025,
            status: false,
            message: 'An error has ocurred saving the stock of a variation' 
        },
        errorProductStockNoVariant: {
            code:   4026,
            status: false,
            message: 'An error has ocurred saving the stock of a product' 
        },
        error: {
            code:   4029,
            status: false,
            message: 'The Product could not be updated, an error has occurred.' 
        },
        noPermissionLocation: {
            code: 3030,
            status: false,
            message: 'You do not have the necessary permissions in the location to perform this action.' 
        },
        success: {
            code:   4120,
            status: true,
            message: 'The Product has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:   4030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:   4039,
            status: false,
            message: 'The Product(s) could not be listed, an error has occurred.' 
        },
        success: {
            code: 4130,
            status: true,
            message: 'The Products(s) has been successfully listed.' 
        }
    },
    delete : {
        noPermission: {
            code:   4061,
            status: false,
            message: 'The Product could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:   4069,
            status: false,
            message: 'The Product could not be deleted, an error has occurred.' 
        },
        errorProductVariation: {
            code:   4061,
            status: false,
            message: 'The Product variation could not be deleted, an error has occurred.' 
        },
        errorProductStock: {
            code:   4062,
            status: false,
            message: 'The stock could not be deleted, an error has occurred.' 
        },
        success: {
            code: 4160,
            status: true,
            message: 'The product has been deleted succesfully', 
        }
    },
    disable : {
        noPermission: {
            code:   4040,
            status: false,
            message: 'The Product could not be disabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:   4049,
            status: false,
            message: 'The Product could not be disabled, an error has occurred.' 
        },
        errorProductVariation: {
            code:   4041,
            status: false,
            message: 'The Product variation could not be disabled, an error has occurred.' 
        },
        errorProductStock: {
            code:   4042,
            status: false,
            message: 'The stock could not be disabled, an error has occurred.' 
        },
        success: {
            code: 4140,
            status: true,
            message: 'The product has been disabled succesfully', 
        }
    },
    activate : {
        noPermission: {
            code:   4050,
            status: false,
            message: 'The Product could not be activated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:   4059,
            status: false,
            message: 'The Product could not be activated, an error has occurred.' 
        },
        success: {
            code:   4150,
            status: true,
            message: 'The Product has been successfully activated.' 
        }
    }
};
