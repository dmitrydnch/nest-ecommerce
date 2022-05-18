import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Request,
  Res,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  notfoundResponse,
  unauthroziedResponse,
} from '../config/swagger-responses';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            id: 1,
            title: 'Jewerly',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(
    @Request() req,
    @Res() res,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<any> {
    try {
      const category = await this.categoryService.create(createCategoryDto);
      return res
        .status(HttpStatus.CREATED)
        .json(this.responseBuilderService.sendSuccess(category));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get categories' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: [
            {
              id: 1,
              title: 'Jewerly',
              products: [
                {
                  id: 2,
                  name: 'Golden square ring',
                  price: 19999,
                  categoryId: 1,
                },
                {
                  id: 3,
                  name: 'Silver ring',
                  price: 4999,
                  categoryId: 1,
                },
              ],
            },
            {
              id: 2,
              title: 'cars',
              products: [],
            },
          ],
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async list(@Request() req, @Res() res): Promise<any> {
    try {
      const categories = await this.categoryService.findAll();
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(categories));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Remove category' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            id: 3,
            title: 'test2',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(
    @Request() req,
    @Res() res,
    @Param('id') categoryId: string,
  ): Promise<any> {
    try {
      const categorySearch = await this.categoryService.findById(+categoryId);
      if (!categorySearch) {
        throw new NotFoundException('Category not found');
      }

      const category = await this.categoryService.delete(+categoryId);
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(category));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
