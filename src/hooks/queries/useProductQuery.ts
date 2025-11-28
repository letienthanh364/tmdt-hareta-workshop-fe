import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { ProductListQueryConfig } from '../useProductListQueryConfig'
import { ProductsInGroupConfig } from 'src/types/product.type'

const useGetProductList = (queryConfig: ProductListQueryConfig) => {
  return useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProductList(queryConfig),
    staleTime: 1000 * 60 * 5
  })
}

const useGetProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productApi.getProductDetail(id),
    staleTime: 1000 * 60 * 5
  })
}

const useGetProductsInGroup = (queryConfig: ProductsInGroupConfig, enable: boolean) => {
  return useQuery({
    queryKey: ['product-groups', 'variants', queryConfig.id],
    queryFn: () => productApi.getProductsInGroup(queryConfig),
    staleTime: 1000 * 60 * 5,
    enabled: enable
  })
}

export const productQuery = {
  useGetProductList,
  useGetProductDetail,
  useGetProductsInGroup
}
