export const municipalitiesResponse = {
    list: {
        error: {
            code: 18030,
            status: false,
            message: 'The Municipality(s) could not be listed, an error has occurred.' 
        },
        success: {
            code: 18130,
            status: true,
            message: 'The Municipality(s) has been successfully listed.' 
        }
    },
    disable: {
        error: {
            code: 19049,
            status: false,
            message: 'The Municipality could not be disabled, an error has occurred.' 
        },
        notFound: {
            code: 18040,
            status: false,
            message: 'You don\'t have permission' 
        },
        success: {
            code: 19140,
            status: true,
            message: 'The Municipality has been successfully disabled.' 
        }
    },
    enable: {
        error: {
            code: 18059,
            status: false,
            message: 'The Municipality could not be enabled, an error has occurred.' 
        },
        notFound: {
            code: 18050,
            status: false,
            message: 'You don\'t have permission' 
        },
        success: {
            code: 19150,
            status: true,
            message: 'The Municipality has been successfully enabled.' 
        }
    },
    create: {
        error: {
            code: 19019,
            status: false,
            message: 'The Municipality could not be created, an error has occurred.' 
        },
        nameBeUniqueInMunicipality: {
            code: 19011,
            status: false,
            message: 'A Municipality with that name already exist in this Municipality' 
        },
        success: {
            code: 18110,
            status: true,
            message: 'The Municipality has been successfully created.' 
        }
    },
    update: {
        error: {
            code: 19029,
            status: false,
            message: 'The Municipality could not be modified, an error has occurred.' 
        },
        notFound: {
            code: 19020,
            status: false,
            message: 'You don\'t have permission' 
        },
        nameBeUnique: {
            code: 19021,
            status: false,
            message: 'A Municipality with that name already exist' 
        },
        success: {
            code: 19120,
            status: true,
            message: 'The Municipality has been successfully updated.' 
        }
    }
};
