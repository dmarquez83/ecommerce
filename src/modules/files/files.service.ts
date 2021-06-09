import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { safeSearchAnnotation } from '../../common/enum/safeSearchAnnotation.enum';
import { IResponseStructureReturn } from '../../common/interfaces';
import { filesResponses } from '../../common/responses/files.response';
import { BasicService } from '../../common/services';
import { File } from '../../models';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { ImageServices } from './images.service';
const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

@Injectable()
export class FilesService extends BasicService<File> {

    constructor(@InjectRepository(File)
    private readonly fileRepository: Repository<File>,
        private readonly imagesService: ImageServices
    ) {
        super(fileRepository);
    }

    /**
     *  Find files by Array of name
     * @param filename array of files to find
     */
    async findByArrayNamesOrFail(filenames: string[]): Promise<File[] | undefined> {
        return await this.createQueryBuilder()
            .where('name ILIKE any(:filenames)', { filenames })
            .getMany()
            .catch(() => {
                throw new NotFoundException(filesResponses.list.notFound);
            });
    }

    /**
     *  Find a file by name
     * @param filename name of file to find
     */
    async findByNameOrFail(filename: string): Promise<File | undefined> {
        return await this.findOneWithOptionsOrFail({ where: { name: filename } })
            .catch(() => {
                throw new NotFoundException(filesResponses.list.notFound);
            });
    }

    /**
     * Get image tags through google vision
     * @param image image to which you want get descriptive tags
     */
    async getImageTags(image: File): Promise<string[]> {

        // Creates a google vision client
        const googleVision = new ImageAnnotatorClient({ keyFilename: './lo.json' });

        // Performs label detection on the image file
        const [result] = await googleVision.labelDetection(image.url);
        const tags = result.labelAnnotations.map((element) => element.description);

        return tags;
    }

    /**
     *  Get public link of the file
     * @param filename filename
     */
    getPublicUrl(filename: string) {
        return `https://storage.googleapis.com/waykka/${filename}`;
    }

    /**
     * Save image tags
     * @param image image to which you want to save descriptive labels
     * @param user user who makes the request
     */
    async saveImageTags(image: File, user: IUserReq): Promise<File> {
        const imgUpdated = { ...image };
        imgUpdated.tags = await this.getImageTags(image);

        return await this.updateEntity(imgUpdated, image, user);
    }

    /**
     *  Upload file in the google cloud
     * @param fs upload file
     * @param directory directory to upload the file
     */
    async uploadFileGoogleCloud(fs: any, directory: string, user: IUserReq):
        Promise<IResponseStructureReturn> {

        try {

            const fileCompressed = await this.imagesService.sharpHandle(fs);

            if (fileCompressed.info) {
                fs.size = fileCompressed.info.size;
                fs.buffer = fileCompressed.data;
            }

            await this.detectExplicitContent(fs);

            return await new Promise(async (resolve, reject) => {
                const bucketName = 'waykka';
                // Creates a client
                const storage = new Storage({ keyFilename: './lo.json' });

                // creates a filename in respective directory with random string name of 30 characters
                let fileName = this.generateRandomCodeByLength(30);

                // constant to the loop
                let i = 0;

                do {
                    // Verifying the newly generated code is not in the database
                    const existThisName = await this.findOneWithOptions({ where: { name: fileName } });

                    // if exist stop the loop
                    i = existThisName ? 1 : 0;

                    // get other filename
                    if (i > 0) {
                        fileName = this.generateRandomCodeByLength(30);
                    }

                } while (i === 1);

                const gcsname = `${directory}/${fileName}.${fs.originalname.split('.').pop()}`;

                // create a file in the bucket storage
                const file = storage.bucket(bucketName).file(gcsname);

                // create a stream, to save directly in google cloud
                file.createWriteStream({
                    resumable: false,
                    validation: false,
                    metadata: {
                        contentType: file.mimetype
                    },
                }).on('error', (err: Error) => {
                    file.cloudStorageError = err;
                    return reject(this.formatReturn(filesResponses.upload.error, 'error', err));
                }).on('finish', () => {
                    // upload is successfully in the cloud
                    file.cloudStorageObject = gcsname;

                    // create a public link of the file
                    file.makePublic().then(async () => {
                        file.cloudStoragePublicUrl = this.getPublicUrl(gcsname);

                        // save the file in DB
                        const fileDB: {
                            name: string;
                            extension: string;
                            origin: string;
                            url: string;
                        } = {
                            name: fileName,
                            extension: fs.originalname.split('.').pop(),
                            origin: directory,
                            url: file.cloudStoragePublicUrl
                        };

                        const fileSaved = await this.save(fileDB, user);

                        // Make promise to save image tags in the background
                        this.saveImageTags(fileSaved, user);

                        delete fileSaved['status'];
                        return resolve(this.formatReturn(filesResponses.upload.success,
                            'file',
                            fileSaved));
                    });

                }).end(fs.buffer);

            });

        } catch (error) {

            if (error instanceof NotAcceptableException) {
                throw new NotAcceptableException(error['response']);
            }

            throw new InternalServerErrorException(filesResponses.upload.error);
        }
    }

    /**
     * Detect explicit content in the files to upload
     * @param fs File to upload
     */
    async detectExplicitContent(fs: any) {
        const googleVision = new ImageAnnotatorClient({ keyFilename: './lo.json' });

        const annotationNotAccepted = [
            safeSearchAnnotation.VERY_LIKELY,
            safeSearchAnnotation.LIKELY,
        ];
        
        // Performs safe search detection on the local file
        const [result] = await googleVision.safeSearchDetection(fs.buffer as Buffer);
        const detections = result.safeSearchAnnotation;

        const adultContent = annotationNotAccepted.some( item => {
            return item === detections.adult;
        });
        
        if (adultContent) {
            throw new NotAcceptableException(filesResponses.upload.adultContent);
        }
    }
}
