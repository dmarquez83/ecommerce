export const devicesResponses = {
    creation: {
        error: {
            code:	2019,
            status: false,
            message: 'The Device could not be created, an error has occurred.' 
        },
        success: {
            code:	2110,
            status: true,
            message: 'The Device has been successfully created.' 
        },
    },
    notification: {
        error: {
            code:	2029,
            status: false,
            message: 'The Notification could not be sent, an error has occurred.' 
        },
        success: {
            code:	2120,
            status: true,
            message: 'The notification has been successfully sent.' 
        },
    },
    list: {
        noPermission: {
            code:	2030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	2039,
            status: false,
            message: 'The Device(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	2130,
            status: true,
            message: 'The Device(s) has been successfully listed.' 
        }
    },
    delete: {
        noPermission: {
            code:	2060,
            status: false,
            message: 'The Device could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	2069,
            status: false,
            message: 'The Device could not be deleted, an error has occurred.' 
        },
        success: {
            code:	2160,
            status: true,
            message: 'The Device has been successfully deleted.' 
        }
    }
};
