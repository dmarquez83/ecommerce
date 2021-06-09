const sharp = require('sharp');

export class ImageServices {

    /**
     * Compress image JPEG or JPG, change quality 40% and reduce 40% pixels
     * @param file Image to compress
     */
    async compressJPEGorJPG(file: any) {
        const metaData = await sharp(file.buffer)
            .metadata();
        
        return await sharp(file.buffer)
            .resize(Math.trunc(Number(metaData.width * 0.60)),
                Math.trunc(Number(metaData.height * 0.60)))
            .median()
            .jpeg({
                quality: 40,
                progressive: true,
                trellisQuantisation: true,
                force: false,
            })
            .toBuffer({ resolveWithObject: true })
            .catch(err => {
                console.log('err', err);
            });
    }

    /**
     * Compression handle by mimetype
     * @param mimeType mime type of image
     * @param file Image to compress
     */
    async sharpHandle(file: any) {

        const sizeInMB = file.size / Math.pow(1024, 2);
        if (sizeInMB < 3) {
            return file;
        }

        return this.compressJPEGorJPG(file);
    }

}
