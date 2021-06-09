import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services';
import { ServiceFile } from '../../models';
import { FilesService } from '../files/files.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateServiceFileDto } from './dto/createServiceFile.dto';
import { UpdateServiceFileDto } from './dto/updateServiceFile.dto';

@Injectable()
export class ServiceFilesService extends BasicService<ServiceFile> {

    constructor(
        @InjectRepository(ServiceFile)
        private readonly serviceFilesRepository: Repository<ServiceFile>,
        private readonly filesService: FilesService,
    ) {
        super(serviceFilesRepository);
    }

     /**
      * Create a serviceFile
      * @param data Service file
      * @param user Logged user
      * @param response Response to return structure
      */
    async create(data: CreateServiceFileDto, user: IUserReq, response: any) {
        for (const [index, imgCode] of data.imgCode.entries()) {
            const serviceFile: {
                imgCode: string;
                idService: number,
                position: number;
            } = {
                imgCode,
                position: index,
                idService: data.idService
            };

            await this.filesService.findByNameOrFail(imgCode);

            await this.save(serviceFile, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }

    }

    /**
     *  Find all files of this service
     * @param id IdService to find
     */
    async findAllServiceFiles(id: number) {

        return this.find({ where: { idService: id} });
    }

    /**
     * Update all files of the service
     * @param data Data to create a file group
     * @param user Logged user
     * @param response response to return structure
     */
    async update(data: UpdateServiceFileDto, user: IUserReq, response: any) {

        const serviceFiles = await this.findAllServiceFiles(data.idService);
    
        // check serviceFiles to delete
        const serviceFilesToDelete = serviceFiles.filter(item => {
            return !data.imgCode.some(e => e === item.imgCode);
        });

        await this.deleteEntity(serviceFilesToDelete)
            .catch(() => {
                throw new InternalServerErrorException(response.cantDeleteImages);
            });

        await this.create(data, user, response);
        
    }

    /**
     *  Save all images of the service
     * @param images Array of img name
     * @param idService id of service
     * @param user Logged user
     * @param response response to return structure
     */
    async saveServiceFiles(images: string[], user: IUserReq, response: any,
                           idService: number): Promise<void> {
        const serviceFile: {
            imgCode: string[],
            idService: number
        } = {
            imgCode: images,
            idService
        };
        
        await this.create(serviceFile, user, response);
    }

    /**
     *  Update all images of the service
     * @param images Array of img name
     * @param idService id of service
     * @param user Logged user
     * @param response response to return structure
     */
    async updateServiceFiles(images: string[], user: IUserReq, response: any,
                             idService: number): Promise<void> {
        const serviceFile: {
            imgCode: string[],
            idService: number
        } = {
            imgCode: images,
            idService
        };
        
        await this.update(serviceFile, user, response);
    }
}
