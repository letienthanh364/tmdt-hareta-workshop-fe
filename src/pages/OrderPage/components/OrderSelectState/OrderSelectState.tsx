import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { locationApi } from 'src/apis/location.api'
import LoadingRing from 'src/components/LoadingRing'
import { AppContext } from 'src/contexts/app.context'
import { OrderContext } from 'src/contexts/order.context'
import { AddressState } from 'src/types/location.type'

interface Props {
  isError: boolean
}

export default function OrderSelectState({ isError }: Props) {
  const { theme } = useContext(AppContext)
  const { addressCountry, addressState, setStateAddress } = useContext(OrderContext)

  //! Get state list list
  const { data: statesData } = useQuery({
    queryKey: ['states', addressCountry?.iso2],
    queryFn: () => locationApi.getStatesByCountry(addressCountry?.iso2 || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(addressCountry)
  })
  const stateList = statesData?.data || []

  //! Combobox
  const [query, setQuery] = useState('')
  const filteredStates =
    query == ''
      ? stateList
      : stateList.filter((country) => {
          return country.name.toLowerCase().includes(query.toLowerCase())
        })

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <div className='w-full '>
      <div className='flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-lightColor900 outline-haretaColor/60 hover:outline-haretaColor dark:bg-darkColor900'>
        {!addressCountry && (
          <div className='flex h-10 items-center justify-center opacity-60'>{t('bill.State / Province')}</div>
        )}
        {!!addressCountry && !statesData && <LoadingRing width={40} />}
      </div>
      {statesData && (
        <Combobox value={addressState} onChange={setStateAddress} onClose={() => setQuery('')}>
          <div className='relative'>
            <ComboboxInput
              className={classNames(
                'w-full rounded-xl border-none bg-lightColor900 py-1.5 pl-3 pr-8 text-sm/6 font-semibold text-black outline outline-2 dark:bg-darkColor900 dark:text-white',
                {
                  'outline-black/40 focus:outline-haretaColor dark:outline-white/40 dark:focus:outline-haretaColor':
                    !isError,
                  'outline-alertRed dark:outline-alertRed': isError
                }
              )}
              displayValue={(element: AddressState) => element?.name || ''}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxButton className='group absolute inset-y-0 right-0 px-2.5'>
              <FontAwesomeIcon
                icon={faChevronDown}
                className='size-4 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white '
              />
            </ComboboxButton>
          </div>
          <ComboboxOptions
            anchor='bottom'
            transition
            className={classNames(
              'w-[var(--input-width)] space-y-1 border p-1 transition duration-100 ease-in',
              theme == 'dark' ? 'dark' : 'light',
              {
                'border-white/60 bg-black text-lightText': theme == 'dark',
                'border-black/60 bg-white text-darkText': theme == 'light'
              }
            )}
          >
            <div className='max-h-96'>
              {filteredStates.map((element) => (
                <ComboboxOption key={element.id} value={element} className=''>
                  {({ focus, selected }) => (
                    <div
                      className={classNames(
                        'group flex select-none rounded-xl px-2 py-1',
                        (focus || selected) && 'bg-haretaColor font-semibold text-darkText'
                      )}
                    >
                      <span className={classNames('block truncate ', {})}>{element?.name}</span>
                    </div>
                  )}
                </ComboboxOption>
              ))}
            </div>
          </ComboboxOptions>
        </Combobox>
      )}
    </div>
  )
}
