export const rolesResponses = {
    list: {
        error: {
            code:	20039,
            status: false,
            message: 'The Role(s) could not be listed, an error has occurred.' 
        },
        notFound: {
            code:	20031,
            status: false,
            message: 'The Role(s) could not be listed, couldn\'t be found.' 
        },
        success: {
            code:	20130,
            status: true,
            message: 'The Role(s) has been successfully listed.' 
        }
    }
};