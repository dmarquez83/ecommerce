export const offerResponses = {
    creation: {
        noPermission: {
            code:	5010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	5011,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        nameBeUnique: {
            code:	5012,
            status: false,
            message: 'The company already has an offer with the same name.' 
        },
        businessDisabled: {
            code:	5013,
            status: false,
            message: 'You cannot create the offer, because the associated Business is not active.' 
        },
        error: {
            code:	5019,
            status: false,
            message: 'The offer could not be created, an error has occurred.' 
        },
        success: {
            code:	5110,
            status: true,
            message: 'The Offer has been successfully created.' 
        }
    },
    modification: {
        noPermission: {
            code:	5020,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        attrMustExist: {
            code:	5021,
            status: false,
            message: 'The value of the entered field must exist.' 
        },
        nameBeUnique: {
            code:	5022,
            status: false,
            message: 'The company already has an offer with the same name.' 
        },
        businessDisabled: {
            code:	5023,
            status: false,
            message: 'You cannot update the offer, because the associated Business is not active.' 
        },
        offerDisabled: {
            code:	5023,
            status: false,
            message: 'You cannot update the offer, because it is in a state that does not allow it.' 
        },
        error: {
            code:	5029,
            status: false,
            message: 'The offer could not be updated, an error has occurred.' 
        },
        success: {
            code:	5120,
            status: true,
            message: 'The Offer has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	5030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	5039,
            status: false,
            message: 'The Offer could not be listed, an error has occurred.' 
        },
        success: {
            code:	5130,
            status: true,
            message: 'The Offer has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	5040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        businessDisabled: {
            code:	5041,
            status: false,
            message: 'You cannot disable the offer, because the associated Business is not active.' 
        },
        error: {
            code:	5049,
            status: false,
            message: 'The offer could not be disabled, an error has occurred.' 
        },
        success: {
            code:	5140,
            status: true,
            message: 'The Offer has been successfully disabled.' 
        }
    }
};
