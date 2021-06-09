export const categoryResponses = {
    list: {
        noPermission: {
            code:	6030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	6039,
            status: false,
            message: 'The Category could not be listed, an error has occurred.' 
        },
        missingType: {
            code: 6038,
            status: false,
            message: 'Must send a type'
        },
        success: {
            code:	6130,
            status: true,
            message: 'The Category has been successfully listed.' 
        },
        notFoundParent: {
            code:	6029,
            status: false,
            message: 'The Category could not be listed, the parent category does not exist.' 
        },
    }, 
    creation: {
        noPermission: {
            code:	6010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	6019,
            status: false,
            message: 'The Category could not be created, an error has occurred.' 
        },
        nameAndParentIdError: {
            code:	6012,
            status: false,
            message: 'The Category could not be created, There is already one with this name and parent.' 
        },
        success: {
            code:	6110,
            status: true,
            message: 'The Category has been successfully created.' 
        },
        notFoundParent: {
            code:	6029,
            status: false,
            message: 'The Category could not be created, the parent category does not exist.' 
        },
    },
    modification: {
        noPermission: {
            code:	6021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        notFoundParent: {
            code:	6029,
            status: false,
            message: 'The Category could not be modified, the parent category does not exist.' 
        },
        nameAndParentIdError: {
            code:	6023,
            status: false,
            message: 'The Category could not be modified, There is already one with this name and parent.' 
        },
        success: {
            code:	6120,
            status: true,
            message: 'The Category has been successfully updated.' 
        },
        error: {
            code:	6029,
            status: false,
            message: 'The Category could not be updated, an error has occurred.' 
        }
    },
    disable: {
        noPermission: {
            code:	6040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	6049,
            status: false,
            message: 'The Category could not be disabled, an error has occurred.' 
        },
        success: {
            code:	6140,
            status: true,
            message: 'The Category has been successfully disabled.' 
        }
    },
    activate: {
        noPermission: {
            code:	6050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	6059,
            status: false,
            message: 'The Category could not be activated, an error has occurred.' 
        },
        success: {
            code:	6150,
            status: true,
            message: 'The Category has been successfully activated.' 
        }
    }
};
