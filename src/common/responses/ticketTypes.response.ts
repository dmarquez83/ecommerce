export const ticketTypesResponses = {
    list: {
        noPermission: {
            code:	14030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	14039,
            status: false,
            message: 'The Ticket Type(s) could not be listed, an error has occurred.' 
        },
        attrMustExist: {
            code:	14031,
            status: false,
            message: 'The Ticket Type(s) was not found.' 
        },
        success: {
            code:	14130,
            status: true,
            message: 'The Ticket Type(s) has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	14040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	14049,
            status: false,
            message: 'The Ticket Type could not be disabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	14041,
            status: false,
            message: 'The Ticket Type was not found.' 
        },
        success: {
            code:	14140,
            status: true,
            message: 'The Ticket Type has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	14050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	14059,
            status: false,
            message: 'The Ticket Type could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	14051,
            status: false,
            message: 'The Ticket Type was not found.' 
        },
        success: {
            code:	14150,
            status: true,
            message: 'The Ticket Type has been successfully enabled.' 
        }
    },
    create: {
        noPermission: {
            code:	14010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	14019,
            status: false,
            message: 'The Ticket Type could not be created, an error has occurred.' 
        },
        codeAndNameBeUnique: {
            code:	14012,
            status: false,
            message: 'The Ticket Type could not be created, the code or name already exist' 
        },
        success: {
            code:	14110,
            status: true,
            message: 'The Ticket Type has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	14021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	14029,
            status: false,
            message: 'The Ticket Type could not be updated, an error has occurred.' 
        },
        attrMustExist: {
            code:	14022,
            status: false,
            message: 'The Ticket Type was not found.' 
        },
        codeAndNameBeUnique: {
            code:	14023,
            status: false,
            message: 'The Ticket Type could not be updated, the code or name already exist' 
        },
        success: {
            code:	14120,
            status: true,
            message: 'The Ticket Type has been successfully updated.' 
        }
    }
}