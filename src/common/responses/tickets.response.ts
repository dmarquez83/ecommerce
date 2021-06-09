export const ticketsResponses = {
    list: {
        noPermission: {
            code:	13030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	13039,
            status: false,
            message: 'The Ticket(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	13130,
            status: true,
            message: 'The Ticket(s) has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	13040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	13049,
            status: false,
            message: 'The Ticket could not be disabled, an error has occurred.' 
        },
        NotOwner: {
            code:	13040,
            status: false,
            message: 'The Ticket could not be disabled, you did,\'t create the ticket.' 
        },
        NotFound: {
            code:	13048,
            status: false,
            message: 'The Ticket could not be disabled, the ticket was not found.' 
        },
        success: {
            code:	13140,
            status: true,
            message: 'The Ticket has been successfully disabled.' 
        }
    },
    create: {
        noPermission: {
            code:	13010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	13019,
            status: false,
            message: 'The Ticket could not be created, an error has occurred.' 
        },
        attrMustExist: {
            code:	13011,
            status: false,
            message: 'The Ticket could not be created, please verify the ticket type.' 
        },
        success: {
            code:	13110,
            status: true,
            message: 'The Ticket has been successfully created.' 
        }
    },
    modify: {
        noPermission: {
            code:	13021,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	13029,
            status: false,
            message: 'The Ticket could not be modified, an error has occurred.' 
        },
        attrMustExist: {
            code:	13022,
            status: false,
            message: 'The Ticket could not be modified, please verify the data.' 
        },
        success: {
            code:	13120,
            status: true,
            message: 'The Ticket has been successfully modified.' 
        }
    },
};
