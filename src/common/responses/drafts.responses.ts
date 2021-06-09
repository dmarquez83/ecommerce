export const draftsResponses = {
    list: {
        noPermission: {
            code:	27030,
            status: false,
            message: 'The Draft could not be listed, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	27039,
            status: false,
            message: 'The Draft(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	27130,
            status: true,
            message: 'The Draft(s) has been successfully listed.' 
        }
    },
    delete: {
        noPermission: {
            code:	27060,
            status: false,
            message: 'The Draft could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	27069,
            status: false,
            message: 'The Draft could not be deleted, an error has occurred.' 
        },
        success: {
            code:	27160,
            status: true,
            message: 'The Draft has been successfully deleted.' 
        }
    },
    create: {
        noPermission: {
            code:	27010,
            status: false,
            message: 'The Draft could not be created, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code: 27019,
            status: false,
            message: 'The Draft could not be created, an error has occurred.' 
        },
        success: {
            code:	27110,
            status: true,
            message: 'The Draft has been successfully created.' 
        },
    },
    update: {
        noPermission: {
            code:	27020,
            status: false,
            message: 'The Draft could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	27029,
            status: false,
            message: 'The Draft could not be modified, an error has occurred.' 
        },
        success: {
            code:	27120,
            status: true,
            message: 'The Draft has been successfully updated.' 
        },
    }
};
