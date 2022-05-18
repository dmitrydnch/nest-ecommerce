import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FavouriteService } from './favourite.service';
import {
  notfoundResponse,
  unauthroziedResponse,
} from '../config/swagger-responses';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { ProductService } from '../product/product.service';

@ApiTags('Favourite')
@Controller('favourite')
export class FavouriteController {
  constructor(
    private readonly favouriteService: FavouriteService,
    private readonly productService: ProductService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @ApiOperation({ summary: 'Add to favourite' })
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
            id: 13,
            userId: 5,
            productId: 2,
            product: {
              id: 2,
              name: 'Golden square ring',
              price: 19999,
              categoryId: 1,
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiConflictResponse({
    description: 'Conflict: You already have this product in favourite list',
    content: {
      'application/json': {
        example: {
          result: false,
          error: {
            message:
              'The next error was caught: You already added this product to favourite list',
            code: 1000,
          },
          data: {},
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  public async create(
    @Request() req,
    @Res() res,
    @Param('productId') productId: string,
  ): Promise<any> {
    try {
      const { user } = req;

      const product = await this.productService.findById(+productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const userFavourites =
        await this.favouriteService.findAllByUserIdAndProductId(
          user.id,
          +productId,
        );
      if (userFavourites) {
        throw new ConflictException(
          'You already added this product to favourite list',
        );
      }

      const favourite = await this.favouriteService.add(user.id, +productId);

      const responseBody = this.responseBuilderService.sendSuccess(favourite);
      return res.status(HttpStatus.CREATED).json(responseBody);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'List of user favourite products' })
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
              id: 11,
              userId: 5,
              productId: 2,
              product: {
                id: 2,
                name: 'Golden square ring',
                price: 19999,
                categoryId: 1,
              },
            },
            {
              id: 12,
              userId: 5,
              productId: 3,
              product: {
                id: 3,
                name: 'Silver ring',
                price: 4999,
                categoryId: 1,
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
  @Get()
  public async myList(@Request() req, @Res() res): Promise<any> {
    try {
      const { user } = req;
      const userFavourites = await this.favouriteService.findAllByUserId(
        user.id,
      );
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(userFavourites));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Remove favourite product' })
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
            count: 1,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  public async delete(
    @Request() req,
    @Res() res,
    @Param('productId') productId: string,
  ): Promise<any> {
    try {
      const { user } = req;
      const userFavourites =
        await this.favouriteService.findAllByUserIdAndProductId(
          user.id,
          +productId,
        );

      if (!userFavourites) {
        throw new NotFoundException('Favourite product not found');
      }

      const favourite = await this.favouriteService.delete(user.id, +productId);
      return res
        .status(HttpStatus.OK)
        .json(this.responseBuilderService.sendSuccess(favourite));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
