export const banksAccountsResponses = {
    create: {
        error: {
            code:	17019,
            status: false,
            message: 'The Bank Account could not be created, an error has occurred.' 
        },
        noPermission: {
            code:	17010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        accountExist: {
            code:	17011,
            status: false,
            message: 'The Bank Account could not be created, the account number already exist' 
        },
        walletMustExist: {
            code:	17013,
            status: false,
            message: 'The Bank Account could not be created, please verify the data(wallet, bank, ...).' 
        },
        bankMustExist: {
            code:	17012,
            status: false,
            message: 'The Bank Account could not be created, please verify the data(wallet, bank, ...).' 
        },
        success: {
            code:	17110,
            status: true,
            message: 'The Bank Account has been successfully created.' 
        }
    },
    update: {
        noPermission: {
            code:	17020,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	17029,
            status: false,
            message: 'The Bank Account could not be updated, an error has occurred.' 
        },
        accountExist: {
            code:	17021,
            status: false,
            message: 'The Bank Account could not be updated, the account number already exist' 
        },  
        attrMustExist: {
            code:	17024,
            status: false,
            message: 'The Bank Account could not be updated, please verify the data(bank account, wallet, bank, ...).'
        },
        walletMustExist: {
            code:	17023,
            status: false,
            message: 'The Bank Account could not be updated, please verify the data(bank account, wallet, bank, ...).'
        },
        bankMustExist: {
            code:	17022,
            status: false,
            message: 'The Bank Account could not be updated, please verify the data(bank account, wallet, bank, ...).'
        },
        success: {
            code:	17120,
            status: true,
            message: 'The Bank Account has been successfully updated.' 
        }
    },
    list: {
        noPermission: {
            code:	17030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	17039,
            status: false,
            message: 'The Bank Account could not be listed, an error has occurred.' 
        },
        attrMustExist: {
            code:	17031,
            status: true,
            message: 'The Bank Account was not found' 
        },
        success: {
            code:	17130,
            status: true,
            message: 'The Bank Account has been successfully listed.' 
        }
    },
    disable: {
        noPermission: {
            code:	17040,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	17049,
            status: false,
            message: 'The Bank Account could not be disabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	17041,
            status: true,
            message: 'The Bank Account was not found' 
        },
        success: {
            code:	17140,
            status: true,
            message: 'The Bank Account has been successfully disabled.' 
        }
    },
    enable: {
        noPermission: {
            code:	17050,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        error: {
            code:	17059,
            status: false,
            message: 'The Bank could not be enabled, an error has occurred.' 
        },
        attrMustExist: {
            code:	17051,
            status: true,
            message: 'The Bank was not found' 
        },
        success: {
            code:	17150,
            status: true,
            message: 'The Bank has been successfully enabled.' 
        }
    }
};
