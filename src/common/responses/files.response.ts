export const filesResponses = {
    upload: {
        noPermission: {
            code:	22010,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        adultContent: {
            code:	22011,
            status: false,
            message: 'You can not upload the file, it has adult content' 
        },
        error: {
            code:	22019,
            status: false,
            message: 'The File(s) could not be uploaded, an error has occurred.' 
        },
        success: {
            code:	22110,
            status: true,
            message: 'The File(s) has been successfully uploaded.' 
        }
    },
    list: {
        noPermission: {
            code:	22030,
            status: false,
            message: 'You do not have the necessary permissions to perform this action.' 
        },
        notFound: {
            code:	22031,
            status: false,
            message: 'The File(s) was not found.' 
        },
        error: {
            code:	22039,
            status: false,
            message: 'The File(s) could not be listed, an error has occurred.' 
        },
        success: {
            code:	22130,
            status: true,
            message: 'The File(s) has been successfully listed.' 
        }
    }
};
