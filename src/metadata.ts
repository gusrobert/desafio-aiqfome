export default async () => {
  const t = {
    ['./favorites/entities/favorite.entity']: await import(
      './favorites/entities/favorite.entity.js'
    ),
    ['./clients/entities/client.entity']: await import(
      './clients/entities/client.entity.js'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./favorites/dto/create-favorite.dto.js'),
          {
            CreateFavoriteDto: {
              clientId: { required: true, type: () => Number },
              productId: { required: true, type: () => Number },
            },
          },
        ],
        [
          import('./favorites/dto/update-favorite.dto.js'),
          { UpdateFavoriteDto: {} },
        ],
        [
          import('./clients/entities/client.entity.js'),
          {
            Client: {
              id: { required: true, type: () => Number },
              name: { required: true, type: () => String },
              email: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('./favorites/entities/favorite.entity.js'),
          {
            Favorite: {
              id: { required: true, type: () => Number },
              clientId: { required: true, type: () => Number },
              productId: { required: true, type: () => Number },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('./products/dto/product.dto.js'),
          {
            ProductDto: {
              id: { required: true, type: () => Number },
              title: { required: true, type: () => String },
              price: { required: true, type: () => Number },
              description: { required: true, type: () => String },
              image: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./clients/dto/create-client.dto.js'),
          {
            CreateClientDto: {
              name: { required: true, type: () => String },
              email: { required: true, type: () => String },
            },
          },
        ],
        [import('./clients/dto/update-client.dto.js'), { UpdateClientDto: {} }],
      ],
      controllers: [
        [
          import('./favorites/favorites.controller.js'),
          {
            FavoritesController: {
              create: {
                type: t['./favorites/entities/favorite.entity'].Favorite,
              },
              findAll: {
                type: [t['./favorites/entities/favorite.entity'].Favorite],
              },
              findOne: { type: Object },
              update: {},
              remove: {},
              getFavoritesByClient: {},
            },
          },
        ],
        [
          import('./clients/clients.controller.js'),
          {
            ClientsController: {
              create: { type: t['./clients/entities/client.entity'].Client },
              findAll: { type: [t['./clients/entities/client.entity'].Client] },
              findOne: { type: t['./clients/entities/client.entity'].Client },
              update: { type: Object },
              remove: {},
            },
          },
        ],
      ],
    },
  };
};
