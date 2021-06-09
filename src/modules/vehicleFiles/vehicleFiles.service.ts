import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services';
import { VehicleFile } from '../../models';
import { FilesService } from '../files/files.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateVehicleFileDto } from './dto/createVehicleFile.dto';
import { UpdateVehicleFileDto } from './dto/updateVehicleFile.dto';

@Injectable()
export class VehicleFilesService extends BasicService<VehicleFile> {

    constructor(
        @InjectRepository(VehicleFile)
        private readonly VehicleFileRepository: Repository<VehicleFile>,
        private readonly filesService: FilesService
    ) {
        super(VehicleFileRepository);
    }

    /**
     *  Create a vehicleFile
     * @param data Vehicle file
     * @param user Logged user
     * @param response Response to return structure
     */
    async create(data: CreateVehicleFileDto, user: IUserReq, response: any) {
        for (const [index, imgCode] of data.imgCode.entries()) {
            const vehicleFile: {
                imgCode: string;
                idVehicle: number,
                position: number;
            } = {
                imgCode,
                position: index,
                idVehicle: data.idVehicle
            };

            await this.filesService.findByNameOrFail(imgCode);

            await this.save(vehicleFile, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }

    }

    /**
     *  Find all files of this vehicle
     * @param id IdVehicle to find
     */
    async findAllVehicleFiles(id: number) {

        return this.find({ where: { idVehicle: id} });
    }

    /**
     * Update all files of the vehicle
     * @param data Data to create a file group
     * @param user Logged user
     * @param response response to return structure
     */
    async update(data: UpdateVehicleFileDto, user: IUserReq, response: any) {

        const vehicleFiles = await this.findAllVehicleFiles(data.idVehicle);
    
        // check vehicleFiles to delete
        const vehicleFilesToDelete = vehicleFiles.filter(item => {
            return !data.imgCode.some(e => e === item.imgCode);
        });

        await this.deleteEntity(vehicleFilesToDelete)
            .catch(() => {
                throw new InternalServerErrorException(response.cantDeleteImages);
            });

        await this.create(data, user, response);
        
    }

    /**
     *  Save all images of the vehicle
     * @param images Array of img name
     * @param idVehicle id of vehicle
     * @param user Logged user
     * @param response response to return structure
     */
    async saveVehicleFiles(images: string[], user: IUserReq, response: any,
                           idVehicle: number): Promise<void> {
        const vehicleFile: {
            imgCode: string[],
            idVehicle: number
        } = {
            imgCode: images,
            idVehicle
        };
        
        await this.create(vehicleFile, user, response);
    }

    /**
     *  Update all images of the vehicle
     * @param images Array of img name
     * @param idVehicle id of vehicle
     * @param user Logged user
     * @param response response to return structure
     */
    async updateVehicleFiles(images: string[], user: IUserReq, response: any,
                             idVehicle: number): Promise<void> {
        const vehicleFile: {
            imgCode: string[],
            idVehicle: number
        } = {
            imgCode: images,
            idVehicle
        };
        
        await this.update(vehicleFile, user, response);
    }

}
