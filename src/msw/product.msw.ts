import { HttpResponse, http } from 'msw'
import config from 'src/constants/config'

const productListRes = {
  data: [
    {
      id: '3mPHrsiPZbRLaq',
      status: 0,
      created_at: '2024-06-09T20:37:47.855+07:00',
      updated_at: '2024-06-09T20:37:47.855+07:00',
      name: 'Koenigsegg Gemera',
      product_line: 'collaborating',
      category: 'cars',
      quantity: 496,
      discount: 0,
      collection: 'Koenigsegg',
      type: 'megacar',
      price: 180,
      original_price: 210,
      color: 'green',
      sold: 0,
      like_count: 0,
      tag: 1,
      cron_status: 0,
      default: true,
      group: {
        id: '3mPHruwNC94Ei1',
        status: 0,
        created_at: '2024-06-09T20:37:25.908+07:00',
        updated_at: '2024-06-09T20:37:25.908+07:00',
        name: 'Koenigsegg Gemera'
      },
      avatar: {
        id: '3pcp8e5xdvcTaF',
        status: 0,
        created_at: '2024-06-09T20:38:01.447+07:00',
        updated_at: '2024-06-09T20:38:01.447+07:00',
        url: 'https://d2csq352pki9k7.cloudfront.net/image/291278603.jpg',
        file_name: '291278603.jpg',
        width: 0,
        height: 0,
        cloud_name: '',
        extension: ''
      }
    },
    {
      id: '3mMo3xrdL4ZG7h',
      status: 0,
      created_at: '2024-06-09T20:37:07.087+07:00',
      updated_at: '2024-06-09T20:37:07.087+07:00',
      name: 'Ferrari 458',
      product_line: 'collaborating',
      category: 'cars',
      quantity: 498,
      discount: 0,
      collection: 'Ferrari',
      type: 'megacar',
      price: 160,
      original_price: 160,
      color: 'yellow',
      sold: 0,
      like_count: 0,
      tag: 1,
      cron_status: 0,
      default: true,
      group: {
        id: '3mMo415bxdcTz7',
        status: 0,
        created_at: '2024-06-09T20:36:42.985+07:00',
        updated_at: '2024-06-09T20:36:42.985+07:00',
        name: 'Ferrari 458'
      },
      avatar: {
        id: '3pZ7NM12zjxTsb',
        status: 0,
        created_at: '2024-06-09T20:37:15.357+07:00',
        updated_at: '2024-06-09T20:37:15.357+07:00',
        url: 'https://d2csq352pki9k7.cloudfront.net/image/60896268.jpg',
        file_name: '60896268.jpg',
        width: 0,
        height: 0,
        cloud_name: '',
        extension: ''
      }
    },
    {
      id: '3mKb6adTp84iH9',
      status: 0,
      created_at: '2024-06-09T20:36:22.998+07:00',
      updated_at: '2024-06-09T20:36:22.998+07:00',
      name: 'McLaren Senna',
      product_line: 'collaborating',
      category: 'cars',
      quantity: 499,
      discount: 0,
      collection: 'McLaren',
      type: 'megacar',
      price: 140,
      original_price: 170,
      color: 'white',
      sold: 0,
      like_count: 0,
      tag: 0,
      cron_status: 0,
      default: true,
      group: {
        id: '3mKbFwZ8Qjpq2b',
        status: 0,
        created_at: '2024-06-09T20:35:38.414+07:00',
        updated_at: '2024-06-09T20:35:38.414+07:00',
        name: 'McLaren Senna'
      },
      avatar: {
        id: '3mMo3xsdmisYNw',
        status: 0,
        created_at: '2024-06-09T20:36:35.315+07:00',
        updated_at: '2024-06-09T20:36:35.315+07:00',
        url: 'https://d2csq352pki9k7.cloudfront.net/image/229627438.jpg',
        file_name: '229627438.jpg',
        width: 0,
        height: 0,
        cloud_name: '',
        extension: ''
      }
    },
    {
      id: '3mHPJUzVDToSyu',
      status: 0,
      created_at: '2024-06-09T18:27:17.255+07:00',
      updated_at: '2024-06-09T18:27:17.255+07:00',
      name: 'Koenigsegg Regera',
      product_line: 'collaborating',
      category: 'cars',
      quantity: 498,
      discount: 0,
      collection: 'Koenigsegg',
      type: 'megacar',
      price: 190,
      original_price: 190,
      color: 'red',
      sold: 0,
      like_count: 0,
      tag: 1,
      cron_status: 0,
      default: true,
      group: {
        id: '3mHPJZKxtmuej1',
        status: 0,
        created_at: '2024-06-09T18:26:50.037+07:00',
        updated_at: '2024-06-09T18:26:50.037+07:00',
        name: 'Koenigsegg Regera'
      },
      avatar: {
        id: '3mKb6aex7orTgs',
        status: 0,
        created_at: '2024-06-09T18:27:27.154+07:00',
        updated_at: '2024-06-09T18:27:27.154+07:00',
        url: 'https://d2csq352pki9k7.cloudfront.net/image/911888337.jpg',
        file_name: '911888337.jpg',
        width: 0,
        height: 0,
        cloud_name: '',
        extension: ''
      }
    },
    {
      id: 'iV7RTj4cSspD',
      status: 0,
      created_at: '2024-06-09T18:24:36.229+07:00',
      updated_at: '2024-06-09T18:24:36.229+07:00',
      name: 'McLaren 720S',
      product_line: 'collaborating',
      category: 'cars',
      quantity: 497,
      discount: 0,
      collection: 'McLaren',
      type: 'megacar',
      price: 160,
      original_price: 180,
      color: 'red',
      sold: 0,
      like_count: 0,
      tag: 3,
      cron_status: 0,
      default: true,
      group: {
        id: 'iV7TghhBW5gd',
        status: 0,
        created_at: '2024-06-09T18:17:49.754+07:00',
        updated_at: '2024-06-09T18:17:49.754+07:00',
        name: 'McLaren 720S'
      },
      avatar: {
        id: 'gHA3G3rMk5Td',
        status: 0,
        created_at: '2024-06-09T18:24:52.469+07:00',
        updated_at: '2024-06-09T18:24:52.469+07:00',
        url: 'https://d2csq352pki9k7.cloudfront.net/image/281871919.jpg',
        file_name: '281871919.jpg',
        width: 0,
        height: 0,
        cloud_name: '',
        extension: ''
      }
    }
  ],
  paging: {
    page: 1,
    limit: 50,
    total: 5,
    cursor: '',
    next_cursor: ''
  }
}

const productListRequest = http.post(`${config.ApiURL}item/`, () => {
  return HttpResponse.json(productListRes)
})

const productRequest = [productListRequest]

export default productRequest
