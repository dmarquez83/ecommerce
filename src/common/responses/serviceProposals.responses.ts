export const spResponses = {
    create: {
        noPermission: {
            code:	26010,
            status: false,
            message: 'The Service proposal could not be created, you do not have the necessary permissions to perform this action.' 
        },
        serviceBeUniqueByUser: {
            code:	26011,
            status: false,
            message: 'A Service proposal with that service already exist for this user' 
        },
        deniedByService: {
            code:	26012,
            status: false,
            message: 'No proposals can be made to the service.' 
        },
        error: {
            code: 26019,
            status: false,
            message: 'The Service proposal could not be created, an error has occurred.' 
        },
        success: {
            code:	26110,
            status: true,
            message: 'The Service proposal has been successfully created.' 
        }
    },
    list: {
        noPermission: {
            code:	26030,
            status: false,
            message: 'The Service proposal could not be listed, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	26039,
            status: false,
            message: 'The Service proposal(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	26130,
            status: true,
            message: 'The Service proposal(s) has been successfully listed.' 
        }
    },
    cancel: {
        noPermission: {
            code:	26040,
            status: false,
            message: 'The Service proposal could not be canceled, you do not have the necessary permissions to perform this action.' 
        },
        deniedByService: {
            code:	26041,
            status: false,
            message: 'Proposal cannot be canceled due to service status.' 
        },
        deniedByProposalStatus: {
            code:	26042,
            status: false,
            message: 'Proposal cannot be canceled due to proposal status.' 
        },
        error: {
            code: 26049,
            status: false,
            message: 'The Service proposal could not be canceled, an error has occurred.' 
        },
        success: {
            code:	26140,
            status: true,
            message: 'The Service proposal has been successfully canceled.' 
        }
    },
    decline: {
        noPermission: {
            code:	26050,
            status: false,
            message: 'The Service proposal could not be declined, you do not have the necessary permissions to perform this action.' 
        },
        deniedByService: {
            code:	26051,
            status: false,
            message: 'Proposal cannot be declined due to service status.' 
        },
        deniedByProposalStatus: {
            code:	26052,
            status: false,
            message: 'Proposal cannot be declined due to proposal status.' 
        },
        error: {
            code: 26059,
            status: false,
            message: 'The Service proposal could not be declined, an error has occurred.' 
        },
        success: {
            code:	26150,
            status: true,
            message: 'The Service proposal has been successfully declined.' 
        }
    },
    accept: {
        noPermission: {
            code:	26070,
            status: false,
            message: 'The Service proposal could not be accepted, you do not have the necessary permissions to perform this action.' 
        },
        deniedByService: {
            code:	26071,
            status: false,
            message: 'Proposal cannot be accepted due to service status.' 
        },
        deniedByProposalStatus: {
            code:	26072,
            status: false,
            message: 'Proposal cannot be accepted due to proposal status.' 
        },
        error: {
            code: 26079,
            status: false,
            message: 'The Service proposal could not be accepted, an error has occurred.' 
        },
        success: {
            code:	26170,
            status: true,
            message: 'The Service proposal has been successfully accepted.' 
        }
    }
};
