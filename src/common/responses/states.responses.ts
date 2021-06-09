export const statesResponses = {
    list: {
        noPermission: {
            code:	16030,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	16039,
            status: false,
            message: 'The State(s) could not be listed, an error has occurred.' 
        },
        attrMustExist: {
            code:	16031,
            status: false,
            message: 'The State was not found' 
        },
        success: {
            code:	16130,
            status: true,
            message: 'The State(s) has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	16040,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	16049,
            status: false,
            message: 'The State could not be disabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	16041,
            status: false,
            message: 'The State was not found' 
        },
        success: {
            code:	16140,
            status: true,
            message: 'The State has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	16050,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	16059,
            status: false,
            message: 'The State could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	16051,
            status: false,
            message: 'The State was not found' 
        },
        success: {
            code:	16150,
            status: true,
            message: 'The State has been successfully enabled.' 
        }
    },
    create: {
        noPermission: {
            code:	16010,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code: 16019,
            status: false,
            message: 'The State could not be created, an error has occurred.' 
        },
        nameBeUnique: {
            code:	16011,
            status: false,
            message: 'A State with that name already exist' 
        },
        success: {
            code:	16110,
            status: true,
            message: 'The State has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	16021,
            status: false,
            message: 'The Business could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	16029,
            status: false,
            message: 'The State could not be modified, an error has occurred.' 
        },
        nameBeUnique: {
            code:	16022,
            status: false,
            message: 'A State with that name already exist' 
        },
        attrMustExist: {
            code:	16023,
            status: false,
            message: 'The State was not found' 
        },
        success: {
            code:	16120,
            status: true,
            message: 'The State has been successfully updated.' 
        }
    }
};
