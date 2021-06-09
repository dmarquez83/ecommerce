export const tsResponses = {
    create: {
        noPermission: {
            code:	25010,
            status: false,
            message: 'The transport Service could not be created, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code: 25019,
            status: false,
            message: 'The transport Service could not be created, an error has occurred.' 
        },
        success: {
            code:	25110,
            status: true,
            message: 'The transport Service has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	25020,
            status: false,
            message: 'The transport Service could not be updated, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	25029,
            status: false,
            message: 'The transport Service could not be modified, an error has occurred.' 
        },
        success: {
            code:	25120,
            status: true,
            message: 'The transport Service has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	25030,
            status: false,
            message: 'The transport Service(s) could not be listed, you do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	25039,
            status: false,
            message: 'The transport Service(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	25130,
            status: true,
            message: 'The transport Service(s) has been successfully listed.' 
        }
    },
    cancel: {
        noPermission: {
            code:	25040,
            status: false,
            message: 'The transport Service could not be canceled, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25041,
            status: false,
            message: 'The transport Service could not be canceled due to its status.' 
        },
        error: {
            code:	25140,
            status: false,
            message: 'The transport Service could not be canceled, an error has occurred.' 
        },
        success: {
            code:	23140,
            status: true,
            message: 'The transport Service has been successfully canceled.' 
        }
    },
    waitingPickUp: {
        noPermission: {
            code:	25050,
            status: false,
            message: 'The transport Service could not be set as Waiting for Pick Up, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25051,
            status: false,
            message: 'The transport Service could not be set as Waiting for Pick Up due to its status.' 
        },
        error: {
            code:	25059,
            status: false,
            message: 'The transport Service could not be set as Waiting for Pick Up, an error has occurred.' 
        },
        success: {
            code:	25150,
            status: true,
            message: 'The transport Service has been successfully set as Waiting for Pick Up.' 
        }
    },
    delete: {
        noPermission: {
            code:	25060,
            status: false,
            message: 'The transport Service could not be deleted, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25061,
            status: false,
            message: 'The transport Service could not be deleted due to its status.' 
        },
        error: {
            code:	25160,
            status: false,
            message: 'The transport Service could not be deleted, an error has occurred.' 
        },
        success: {
            code:	25160,
            status: true,
            message: 'The transport Service has been successfully deleted.' 
        }
    },
    setPickedUp: {
        noPermission: {
            code:	25070,
            status: false,
            message: 'The transport Service could not set as picked up, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25071,
            status: false,
            message: 'The transport Service could not be set as picked up due to its status.' 
        },
        error: {
            code:	25079,
            status: false,
            message: 'The transport Service could not set as picked up, an error has occurred.' 
        },
        success: {
            code:	25170,
            status: true,
            message: 'The transport Service has been successfully set as picked up.' 
        }
    },
    confirmPickedUp: {
        noPermission: {
            code:	25080,
            status: false,
            message: 'Could not confirm the pickup, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25081,
            status: false,
            message: 'Could not confirm the pickup due to its status.' 
        },
        error: {
            code:	25089,
            status: false,
            message: 'Could not confirm the pickup, an error has occurred.' 
        },
        success: {
            code:	25180,
            status: true,
            message: 'The pickup of the Transport Services has been successfully confirmed.' 
        }
    },
    delivered: {
        noPermission: {
            code:	25090,
            status: false,
            message: 'The transport Service could not set as delivered, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25091,
            status: false,
            message: 'The transport Service could not set as delivered due to its status.' 
        },
        error: {
            code:	25099,
            status: false,
            message: 'The transport Service could not be set as delivered, an error has occurred.' 
        },
        success: {
            code:	25190,
            status: true,
            message: 'The transport Service has been successfully set as delivered.' 
        }
    },
    complete: {
        noPermission: {
            code:	250100,
            status: false,
            message: 'The transport Service could not be completed, you do not have the necessary permissions to perform this action.' 
        },
        deniedByStatus: {
            code:	25091,
            status: false,
            message: 'The transport Service could not be completed due to its status.' 
        },
        error: {
            code:	250109,
            status: false,
            message: 'The transport Service could not be completed, an error has occurred.' 
        },
        success: {
            code:	251100,
            status: true,
            message: 'The transport Service has been successfully completed.' 
        }
    }
};
