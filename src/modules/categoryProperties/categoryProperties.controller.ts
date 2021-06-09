import { Controller, Get, Param } from '@nestjs/common';
import { CategoryPropertiesService } from './categoryProperties.service';

@Controller('properties')
export class CategoryPropertiesController {

    constructor(private readonly categoryPropertiesService: CategoryPropertiesService) {}

    @Get('category/:id')
    findByCategory(@Param('id') id: number) {
        return this.categoryPropertiesService.findByCategory(id);
    }
    
    @Get('product/:id')
    findByProduct(@Param('id') id: number) {
        return this.categoryPropertiesService.findByProduct(id);
    }
}
