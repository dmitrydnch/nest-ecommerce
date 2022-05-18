import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { FavouriteService } from '../favourite/favourite.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly responseBuilderService: ResponseBuilderService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly favouriteService: FavouriteService,
  ) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({
    status: 201,
    description: 'Created',
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
            name: 'Silver ring',
            price: 4999,
            categoryId: 1,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async create(
    @Request() req,
    @Res() res,
    @Body() createProductDto: CreateProductDto,
  ): Promise<any> {
    try {
      const category = await this.categoryService.findById(
        createProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const product = await this.productService.create(createProductDto);
      return res
        .status(HttpStatus.CREATED)
        .json(this.responseBuilderService.sendSuccess(product));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find product by id' })
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
            name: 'Silver ring',
            price: 4999,
            categoryId: 1,
            category: {
              title: 'Jewerly',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findOne(
    @Request() req,
    @Res() res,
    @Param('id') productId: number,
  ): Promise<any> {
    try {
      const product = await this.productService.findById(+productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(product));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'List of all products' })
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
              name: 'Silver ring',
              price: 4999,
              categoryId: 1,
              category: {
                title: 'Jewerly',
              },
            },
            {
              id: 2,
              name: 'Golden ring',
              price: 9999,
              categoryId: 1,
              category: {
                title: 'Jewerly',
              },
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
      const product = await this.productService.findAll();
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(product));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Update product' })
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
            name: 'Golden ring',
            price: 19999,
            categoryId: 1,
            category: {
              title: 'Jewerly',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async update(
    @Request() req,
    @Res() res,
    @Param('id') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<any> {
    try {
      const searchProduct = await this.productService.findById(productId);
      if (!searchProduct) {
        throw new NotFoundException();
      }

      const product = await this.productService.update(
        +productId,
        updateProductDto,
      );
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(product));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Delete product' })
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
            name: 'Golden ring',
            price: 9999,
            categoryId: 1,
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
    @Param('id') productId: string,
  ): Promise<any> {
    try {
      const searchProduct = await this.productService.findById(+productId);
      if (!searchProduct) {
        throw new NotFoundException();
      }

      await this.favouriteService.deleteAllByProductId(+productId);
      const product = await this.productService.delete(+productId);
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(product));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
