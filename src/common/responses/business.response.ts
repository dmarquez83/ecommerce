export const businessResponses = {
    creation: {
        noPermission: {
            code:	2010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        nameBeUnique: {
            code:	2011,
            status: false,
            message: 'The Business could not be created, because the supplied name is currently in use.' 
        },
        error: {
            code:	2019,
            status: false,
            message: 'The Business could not be created, an error has occurred.' 
        },
        success: {
            code:	2110,
            status: true,
            message: 'The Business has been successfully created.' 
        },
        alreadyExistRole: {
            code: '',
            status: false,
            message: 'The user already has this role in the business.'
        },
        assignRoles: {
            code: '',
            status: true,
            message: 'Role assigned correctly.' 
        },
        assignRoleError: {
            code: '',
            status: false,
            message: 'Failed to assign role.' 
        },
        findRoleError: {
            code: '',
            status: false,
            message: 'Failed to find role.' 
        },
        mailNotFound: {
            code: '',
            status: false,
            message: 'User with specified mail, was not found.' 
        },
    },
    modification: {
        noPermission: {
            code:	2020,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        nameBeUnique: {
            code:	2021,
            status: false,
            message: 'The Business could not be updated, because the supplied name is currently in use.' 
        },
        cantChangeName: {
            code:	2022,
            status: false,
            message: 'The Business could not be updated, the name cannot be changed.' 
        },
        error: {
            code:	2029,
            status: false,
            message: 'The Business could not be updated, an error has occurred.' 
        },
        success: {
            code:	2120,
            status: true,
            message: 'The Business has been successfully updated.' 
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
            message: 'The Business(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	2130,
            status: true,
            message: 'The Business(s) has been successfully listed.' 
        }
    },
    disable : {
        noPermission: {
            code:	2040,
            status: false,
            message: 'The Business could not be disabled, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	2049,
            status: false,
            message: 'The Business could not be disabled, an error has occurred.' 
        },
        success: {
            code:	2140,
            status: true,
            message: 'The Business has been successfully disabled.' 
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
    },
    inviteTeammate: {
        error: {
            code:	0,
            status: false,
            message: 'User could not be invited, an error has occurred.' 
        },
        userNotFound: {
            code:	0,
            status: false,
            message: 'User could not be founded.' 
        },
        userIsTeammate: {
            code:	0,
            status: false,
            message: 'User could not be invited, is already associated with the business.' 
        },
        success: {
            code:	0,
            status: true,
            message: 'The teammate has been successfully invited.' 
        },

    },
    delete: {
        noPermission: {
            code:	2060,
            status: false,
            message: 'The Business could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	2069,
            status: false,
            message: 'The Business could not be deleted, an error has occurred.' 
        },
        success: {
            code:	2160,
            status: true,
            message: 'The Business has been successfully deleted.' 
        }
    }
};
