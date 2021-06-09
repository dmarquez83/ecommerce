export const teammatesResponses = {
    invitation: {
        noPermission: {
            code:	21010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        rolesEmpty: {
            code:	21011,
            status: false,
            message: 'Cannot process request, no role specified.' 
        },
        rolesDuplicated: {
            code:	21012,
            status: false,
            message: 'Cannot process request, the same role has been specified more than once in the list of roles.' 
        },
        userNotFound: {
            code:	1031,
            status: false,
            message: 'User could not be founded.' 
        },
        userIsTeammate: {
            code:	21013,
            status: false,
            message: 'User could not be invited, is already associated with the business.' 
        },
        error: {
            code:	21019,
            status: false,
            message: 'User could not be invited, an error has occurred.' 
        },
        success: {
            code:	21110,
            status: true,
            message: 'The teammate has been successfully invited.' 
        },
    },
    modification: {
        noPermission: {
            code:	21020,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        rolesEmpty: {
            code:	21021,
            status: false,
            message: 'Cannot process request, no role specified.' 
        },
        rolesDuplicated: {
            code:	21022,
            status: false,
            message: 'Cannot process request, the same role has been specified more than once in the list of roles.' 
        },
        userNotFound: {
            code:	0,
            status: false,
            message: 'User could not be founded.' 
        },
        error: {
            code:	21029,
            status: false,
            message: 'Teammate could not be modified, an error has occurred.' 
        },
        success: {
            code:	21120,
            status: true,
            message: 'The teammate has been successfully modified.' 
        },

    },
    list : {
        noPermission: {
            code:	21030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	21039,
            status: false,
            message: 'Teammate could not be listed, an error has occurred.' 
        },
        success: {
            code:	21130,
            status: true,
            message: 'The teammate has been successfully listed.' 
        },

    },
    disable: {
        noPermission: {
            code:	21040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	21049,
            status: false,
            message: 'Teammate could not be disabled, an error has occurred.' 
        },
        success: {
            code:	21140,
            status: true,
            message: 'The teammate has been successfully disabled.' 
        },
    }
};
